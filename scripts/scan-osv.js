import fs from 'fs';
import path from 'path';

async function scanWithOSV() {
  console.log('\n🔍 Loading package-lock.json for OSV.dev vulnerability audit...');

  const lockfilePath = path.resolve(process.cwd(), 'package-lock.json');
  if (!fs.existsSync(lockfilePath)) {
    console.error('❌ package-lock.json not found!');
    process.exit(1);
  }

  const lockfile = JSON.parse(fs.readFileSync(lockfilePath, 'utf-8'));
  const packagesToScan = [];

  // package-lock.json v2/v3 structure
  if (lockfile.packages) {
    for (const [pkgPath, pkgInfo] of Object.entries(lockfile.packages)) {
      if (!pkgPath || pkgPath === '') continue;
      const name = pkgInfo.name || pkgPath.replace(/^node_modules\//, '');
      const version = pkgInfo.version;
      if (name && version) {
        packagesToScan.push({
          package: {
            name: name,
            ecosystem: 'npm'
          },
          version: version
        });
      }
    }
  }

  console.log(`📦 Found ${packagesToScan.length} unique packages in dependency tree.`);
  console.log('📡 Querying Google OSV API (https://api.osv.dev/v1/querybatch)...');

  // Query in batches of 500
  const batchSize = 500;
  let totalVulns = 0;
  const vulnerabilitiesFound = [];

  for (let i = 0; i < packagesToScan.length; i += batchSize) {
    const batch = packagesToScan.slice(i, i + batchSize);
    try {
      const response = await fetch('https://api.osv.dev/v1/querybatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queries: batch })
      });

      if (!response.ok) {
        throw new Error(`OSV API returned status ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      if (data.results) {
        data.results.forEach((res, idx) => {
          if (res.vulns && res.vulns.length > 0) {
            const pkg = batch[idx];
            res.vulns.forEach((v) => {
              vulnerabilitiesFound.push({
                package: pkg.package.name,
                version: pkg.version,
                vulnId: v.id,
                summary: v.summary || 'No summary provided',
                severity: v.database_specific?.severity || 'UNKNOWN',
                fixedIn: v.affected?.[0]?.ranges?.[0]?.events?.find(e => e.fixed)?.fixed || 'N/A',
                url: `https://osv.dev/vulnerability/${v.id}`
              });
              totalVulns++;
            });
          }
        });
      }
    } catch (err) {
      console.error('Error contacting OSV.dev:', err.message);
      process.exit(1);
    }
  }

  console.log('─────────────────────────────────────────────────────────────────');
  if (totalVulns === 0) {
    console.log('✅ OSV.dev Security Audit: CLEAN (0 vulnerabilities detected!)');
    console.log(`   All ${packagesToScan.length} packages scanned against the Google OSV database.`);
    console.log('─────────────────────────────────────────────────────────────────\n');
    process.exit(0);
  } else {
    console.error(`⚠️  OSV.dev Security Audit: ${totalVulns} vulnerability/vulnerabilities detected!\n`);
    vulnerabilitiesFound.forEach((v, index) => {
      console.error(`${index + 1}. [${v.severity}] ${v.package}@${v.version} - ${v.vulnId}`);
      console.error(`   Summary: ${v.summary}`);
      console.error(`   Fixed in: ${v.fixedIn}`);
      console.error(`   Details: ${v.url}\n`);
    });
    console.error('Remediation: Update the vulnerable packages or add overrides in package.json.');
    console.log('─────────────────────────────────────────────────────────────────\n');
    process.exit(1);
  }
}

scanWithOSV();
