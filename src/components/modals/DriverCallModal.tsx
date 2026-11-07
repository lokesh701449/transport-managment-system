import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, User, Radio } from 'lucide-react';

interface DriverCallModalProps {
  isOpen: boolean;
  driverName: string;
  driverPhone: string;
  onClose: () => void;
}

export const DriverCallModal: React.FC<DriverCallModalProps> = ({
  isOpen,
  driverName,
  driverPhone,
  onClose
}) => {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let timer: any;
    let durationTimer: any;

    if (isOpen) {
      setCallStatus('connecting');
      setCallDuration(0);
      setIsMuted(false);

      // Simulate connecting in 1.8 seconds
      timer = setTimeout(() => {
        setCallStatus('connected');
      }, 1800);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(durationTimer);
    };
  }, [isOpen]);

  useEffect(() => {
    let durationTimer: any;
    if (callStatus === 'connected') {
      durationTimer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(durationTimer);
  }, [callStatus]);

  if (!isOpen) return null;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleHangUp = () => {
    setCallStatus('ended');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-center overflow-hidden">
        {/* Signal status top indicator */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-6">
          <span className="flex items-center gap-1.5 text-teal-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            VoIP Ops Radio
          </span>
          <span>AIS-140 Bridge</span>
        </div>

        {/* Driver Avatar with animated waves */}
        <div className="relative mx-auto w-24 h-24 mb-5 flex items-center justify-center">
          {callStatus === 'connecting' && (
            <div className="absolute inset-0 rounded-full border-2 border-teal-500/40 animate-ping" />
          )}
          {callStatus === 'connected' && (
            <div className="absolute -inset-2 rounded-full border-2 border-emerald-500/30 animate-pulse" />
          )}
          <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-teal-500 flex items-center justify-center shadow-xl">
            <User className="w-10 h-10 text-teal-400" />
          </div>
        </div>

        {/* Driver Details */}
        <h3 className="text-lg font-bold text-white tracking-tight">{driverName}</h3>
        <p className="text-xs text-slate-400 font-mono mt-1">{driverPhone}</p>

        {/* Call state */}
        <div className="mt-3 inline-block">
          {callStatus === 'connecting' ? (
            <span className="text-xs text-amber-400 font-medium animate-pulse">
              Connecting audio channel...
            </span>
          ) : callStatus === 'connected' ? (
            <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              Live: {formatSeconds(callDuration)}
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-medium">Call Disconnected</span>
          )}
        </div>

        {/* Audio Waveform mock */}
        {callStatus === 'connected' && (
          <div className="flex items-center justify-center gap-1.5 my-6 h-6">
            <div className="w-1 bg-teal-400 rounded-full animate-bounce h-3" />
            <div className="w-1 bg-teal-400 rounded-full animate-bounce h-6" style={{ animationDelay: '0.15s' }} />
            <div className="w-1 bg-teal-400 rounded-full animate-bounce h-4" style={{ animationDelay: '0.3s' }} />
            <div className="w-1 bg-teal-400 rounded-full animate-bounce h-5" style={{ animationDelay: '0.45s' }} />
            <div className="w-1 bg-teal-400 rounded-full animate-bounce h-2" style={{ animationDelay: '0.2s' }} />
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full border transition-all ${
              isMuted
                ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={handleHangUp}
            className="p-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all hover:scale-105 active:scale-95"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button
            className="p-3.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all"
            title="Speakerphone"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
