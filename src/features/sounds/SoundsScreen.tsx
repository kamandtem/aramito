import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  Square,
  Clock,
  Headphones,
  Sliders,
  Sparkles,
  BookmarkPlus,
  Play,
  Pause,
  AlertCircle,
  CloudRain,
  CloudLightning,
  Waves,
  Droplets,
  Wind,
  Flame,
  Trees,
  Bird,
  Moon,
  Coffee,
  Activity,
  Radio,
  Compass,
  Music
} from 'lucide-react';
import { SOUND_CHANNELS, PRESET_MIXES, SoundChannel } from '../../data/sounds';
import { audioEngine } from '../../services/audioEngine';
import { haptics } from '../../services/haptics';
import { toPersianDigits, formatSeconds } from '../../utils/persian';

export const SoundsScreen: React.FC = () => {
  const [, setTick] = useState(0);
  const [activeTab, setActiveTab] = useState<'mixer' | 'presets' | 'ambient_music'>('mixer');
  const [sleepTimerModal, setSleepTimerModal] = useState<boolean>(false);
  const [customMixName, setCustomMixName] = useState<string>('');
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [userPresets, setUserPresets] = useState<{ id: string; name: string; channels: { soundId: string; volume: number }[] }[]>(() => {
    try {
      const saved = localStorage.getItem('aramito_user_presets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    return audioEngine.subscribe(() => setTick((t) => t + 1));
  }, []);

  const iconMap: Record<string, React.ElementType> = {
    CloudRain,
    CloudLightning,
    Waves,
    Droplets,
    Wind,
    Flame,
    Trees,
    Bird,
    Moon,
    Coffee,
    Activity,
    Sliders,
    Compass,
    Headphones,
    Radio
  };

  const activeCount = audioEngine.getActiveCount();
  const sleepTimerRemaining = audioEngine.getSleepTimerRemaining();
  const isRelaxMusic = audioEngine.isRelaxMusicActive();

  const handleSaveMix = () => {
    if (!customMixName.trim()) return;
    const channels = SOUND_CHANNELS.filter((ch) => audioEngine.isChannelActive(ch.id)).map((ch) => ({
      soundId: ch.id,
      volume: audioEngine.getChannelVolume(ch.id)
    }));

    if (channels.length === 0) return;

    const newPreset = {
      id: Date.now().toString(),
      name: customMixName.trim(),
      channels
    };

    const updated = [newPreset, ...userPresets];
    setUserPresets(updated);
    try {
      localStorage.setItem('aramito_user_presets', JSON.stringify(updated));
    } catch {}
    setCustomMixName('');
    setShowSaveModal(false);
    haptics.heavy();
  };

  return (
    <div className="space-y-4 pb-safe px-4 max-w-md mx-auto">
      {/* Top Banner / Master controls */}
      <div className="liquid-glass rounded-3xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[var(--accent-sage)]" />
            <h2 className="text-base font-bold text-[var(--text-primary)]">صداساز و میکسر طبیعت</h2>
          </div>

          <div className="flex items-center gap-1.5">
            {activeCount > 0 && (
              <button
                onClick={() => {
                  haptics.light();
                  audioEngine.stopAllChannels();
                }}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 transition-all flex items-center gap-1"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>توقف همه</span>
              </button>
            )}

            {/* Sleep timer button */}
            <button
              onClick={() => {
                haptics.light();
                setSleepTimerModal(true);
              }}
              className={`p-2 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                sleepTimerRemaining > 0
                  ? 'bg-[var(--accent-warm)] text-white'
                  : 'liquid-glass-subtle text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="تایمر خواب"
            >
              <Clock className="w-4 h-4" />
              {sleepTimerRemaining > 0 && (
                <span className="text-[10px] font-mono pr-1">{formatSeconds(sleepTimerRemaining)}</span>
              )}
            </button>
          </div>
        </div>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          همهٔ صداها به صورت آفلاین و مستقل از اینترنت تولید می‌شوند. کانال‌ها را ترکیب کرده و فضای صوتی دلخواه خود را بسازید.
        </p>

        {/* Tab switcher: Mixer / Presets / Relax Music */}
        <div className="flex items-center gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-2xl">
          <button
            onClick={() => {
              haptics.light();
              setActiveTab('mixer');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'mixer'
                ? 'bg-white dark:bg-white/15 text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            کانال‌ها ({toPersianDigits(SOUND_CHANNELS.length)})
          </button>
          <button
            onClick={() => {
              haptics.light();
              setActiveTab('presets');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'presets'
                ? 'bg-white dark:bg-white/15 text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            میکس‌های آماده
          </button>
          <button
            onClick={() => {
              haptics.light();
              setActiveTab('ambient_music');
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'ambient_music'
                ? 'bg-white dark:bg-white/15 text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>موسیقی آرامش</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Channels Mixer Grid */}
      {activeTab === 'mixer' && (
        <div className="space-y-3">
          {/* Save custom mix bar */}
          {activeCount > 0 && (
            <div className="liquid-glass rounded-2xl p-3 flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)]">
                {toPersianDigits(activeCount)} کانال فعال است
              </span>
              <button
                onClick={() => {
                  haptics.light();
                  setShowSaveModal(true);
                }}
                className="text-xs font-bold text-[var(--accent-sage)] flex items-center gap-1.5 hover:underline"
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>ذخیره این ترکیب</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {SOUND_CHANNELS.map((ch) => {
              const Icon = iconMap[ch.icon] || Waves;
              const isActive = audioEngine.isChannelActive(ch.id);
              const volume = audioEngine.getChannelVolume(ch.id);

              return (
                <div
                  key={ch.id}
                  className={`liquid-glass rounded-3xl p-3.5 flex flex-col justify-between transition-all ${
                    isActive
                      ? 'border-2 border-[var(--accent-sage)] shadow-md bg-white/80 dark:bg-white/15'
                      : 'hover:bg-white/60 dark:hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <button
                      onClick={() => {
                        haptics.light();
                        audioEngine.toggleChannel(ch.id);
                      }}
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-[var(--accent-sage)] text-white shadow-md scale-105'
                          : 'liquid-glass-subtle text-[var(--text-secondary)]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                    </button>

                    <button
                      onClick={() => {
                        haptics.light();
                        audioEngine.toggleChannel(ch.id);
                      }}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                        isActive
                          ? 'bg-[var(--accent-sage-soft)] text-[var(--accent-sage)]'
                          : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {isActive ? 'روشن' : 'خاموش'}
                    </button>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-primary)] truncate">{ch.name}</span>
                      {ch.requiresHeadphones && (
                        <span title="نیاز به هدفون" className="inline-flex">
                          <Headphones className="w-3 h-3 text-[var(--accent-warm)] shrink-0 ml-1" />
                        </span>
                      )}
                    </div>

                    {/* Volume slider */}
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          audioEngine.setChannelVolume(ch.id, v);
                          if (!isActive && v > 0) {
                            audioEngine.startChannel(ch.id);
                          }
                        }}
                        className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--accent-sage)]"
                      />
                      <span className="text-[10px] font-mono text-[var(--text-muted)] w-6 text-left">
                        {toPersianDigits(Math.round(volume * 100))}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Presets */}
      {activeTab === 'presets' && (
        <div className="space-y-3">
          <p className="text-xs text-[var(--text-secondary)] px-1">
            میکس‌های علمی و بالینی از پیش طراحی‌شده برای موقعیت‌های مختلف:
          </p>

          <div className="space-y-3">
            {PRESET_MIXES.map((preset) => (
              <motion.div
                key={preset.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  haptics.medium();
                  audioEngine.applyPreset(preset.id);
                }}
                className="liquid-glass rounded-3xl p-4 cursor-pointer hover:bg-white/70 dark:hover:bg-white/15 transition-all shadow-md flex items-center justify-between"
              >
                <div className="flex-1 text-right">
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">{preset.name}</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{preset.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-[var(--accent-sage)] font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>شامل {toPersianDigits(preset.channels.length)} لایه صوتی</span>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-[var(--accent-sage)] text-white flex items-center justify-center shrink-0 shadow-sm mr-3">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* User saved presets */}
          {userPresets.length > 0 && (
            <div className="pt-3 space-y-3">
              <h4 className="text-xs font-bold text-[var(--text-primary)] px-1">ترکیب‌های ذخیره‌شده شما:</h4>
              {userPresets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => {
                    haptics.medium();
                    audioEngine.stopAllChannels();
                    setTimeout(() => {
                      preset.channels.forEach(({ soundId, volume }) => {
                        audioEngine.setChannelVolume(soundId, volume);
                        audioEngine.startChannel(soundId);
                      });
                    }, 300);
                  }}
                  className="liquid-glass rounded-3xl p-4 cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-[var(--text-primary)]">{preset.name}</h5>
                    <span className="text-[10px] text-[var(--text-secondary)]">{toPersianDigits(preset.channels.length)} کانال صوتی</span>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-[var(--accent-sage-soft)] text-[var(--accent-sage)] flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Generative Relax Ambient Music */}
      {activeTab === 'ambient_music' && (
        <div className="space-y-4">
          <div className="liquid-glass rounded-3xl p-5 shadow-lg text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[var(--accent-sage-soft)] text-[var(--accent-sage)] flex items-center justify-center mx-auto shadow-md">
              <Music className={`w-8 h-8 ${isRelaxMusic ? 'animate-pulse' : ''}`} />
            </div>

            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">موسیقی پنتاتونیک آرامش‌بخش</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                مولد زنده موسیقی آرامش با مقیاس پنتا‌تونیک ذن و نوای ارتعاشی ناقوس. بدون فایل، بی‌نهایت و کاملاً بدون تکرار.
              </p>
            </div>

            <button
              onClick={() => {
                haptics.medium();
                audioEngine.toggleAmbientMusic('pentatonic');
              }}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                isRelaxMusic
                  ? 'bg-rose-500 text-white'
                  : 'bg-gradient-to-r from-[#8FAE9B] to-[#7FD1C7] text-white'
              }`}
            >
              {isRelaxMusic ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>توقف موسیقی</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>پخش موسیقی آرامش</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Sleep Timer Modal */}
      {sleepTimerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm liquid-glass rounded-3xl p-5 shadow-2xl space-y-4 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-sage-soft)] text-[var(--accent-sage)] flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">تایمر خاموشی خودکار</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                صداها در پایان زمان تعیین‌شده به صورت تدریجی محو (Fade-out) خواهند شد.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    haptics.light();
                    audioEngine.setSleepTimer(mins);
                    setSleepTimerModal(false);
                  }}
                  className="py-2.5 rounded-2xl liquid-glass-subtle hover:bg-[var(--accent-sage)] hover:text-white text-xs font-bold transition-all"
                >
                  {toPersianDigits(mins)} دقیقه
                </button>
              ))}
            </div>

            {sleepTimerRemaining > 0 && (
              <button
                onClick={() => {
                  haptics.light();
                  audioEngine.clearSleepTimer();
                  setSleepTimerModal(false);
                }}
                className="w-full py-2.5 rounded-2xl text-xs font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20"
              >
                لغو تایمر خواب
              </button>
            )}

            <button
              onClick={() => setSleepTimerModal(false)}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] block mx-auto pt-1"
            >
              بستن
            </button>
          </motion.div>
        </div>
      )}

      {/* Save Custom Mix Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm liquid-glass rounded-3xl p-5 shadow-2xl space-y-4"
          >
            <h3 className="text-sm font-bold text-[var(--text-primary)]">نام‌گذاری ترکیب دلخواه</h3>
            <input
              type="text"
              placeholder="مثلاً: باران و آتش شبانه"
              value={customMixName}
              onChange={(e) => setCustomMixName(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl liquid-glass-subtle text-[var(--text-primary)] border border-[var(--border-glass)] outline-none focus:border-[var(--accent-sage)]"
            />
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSaveMix}
                className="flex-1 py-2.5 rounded-2xl bg-[var(--accent-sage)] text-white text-xs font-bold"
              >
                ذخیره
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 py-2.5 rounded-2xl liquid-glass-subtle text-xs font-bold text-[var(--text-secondary)]"
              >
                انصراف
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
