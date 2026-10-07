import React, { useEffect, useState } from 'react';
import { Volume2, Square, Clock, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audioEngine } from '../services/audioEngine';
import { formatSeconds, toPersianDigits } from '../utils/persian';
import { haptics } from '../services/haptics';

interface MiniPlayerProps {
  onExpand: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ onExpand }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    return audioEngine.subscribe(() => setTick((t) => t + 1));
  }, []);

  const activeCount = audioEngine.getActiveCount();
  const activeChannels = audioEngine.getActiveChannelList();
  const isRelaxMusic = audioEngine.isRelaxMusicActive();
  const sleepTimer = audioEngine.getSleepTimerRemaining();

  if (activeCount === 0 && !isRelaxMusic) {
    return null;
  }

  const titleText = isRelaxMusic
    ? 'موسیقی ملایم امبینت'
    : activeChannels.length === 1
    ? activeChannels[0].name
    : `${toPersianDigits(activeChannels.length)} صدای طبیعت در حال پخش`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 z-35 max-w-md mx-auto pointer-events-auto"
      >
        <div className="liquid-glass rounded-2xl p-2.5 px-3.5 flex items-center justify-between shadow-lg border border-white/50 dark:border-white/10">
          <button
            onClick={() => {
              haptics.light();
              onExpand();
            }}
            className="flex items-center gap-2.5 flex-1 text-right min-w-0"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--accent-sage-soft)] flex items-center justify-center shrink-0 text-[var(--accent-sage)]">
              <Volume2 className="w-4 h-4 animate-pulse" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{titleText}</p>
              {sleepTimer > 0 ? (
                <p className="text-[10px] text-[var(--accent-warm)] flex items-center gap-1 font-mono">
                  <Clock className="w-2.5 h-2.5" />
                  <span>تایمر خواب: {formatSeconds(sleepTimer)}</span>
                </p>
              ) : (
                <p className="text-[10px] text-[var(--text-secondary)]">لمس برای تنظیم حجم و تایمر</p>
              )}
            </div>
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                haptics.light();
                audioEngine.stopAllChannels();
              }}
              title="توقف صداها"
              className="p-1.5 rounded-full liquid-glass-subtle hover:bg-white/40 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
            <button
              onClick={() => {
                haptics.light();
                onExpand();
              }}
              className="p-1.5 rounded-full liquid-glass-subtle hover:bg-white/40 text-[var(--text-secondary)]"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
