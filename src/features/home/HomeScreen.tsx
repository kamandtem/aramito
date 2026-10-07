import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Flame,
  Wind,
  Waves,
  Sparkles,
  BookOpen,
  ArrowLeft,
  RefreshCw,
  Clock,
  Heart,
  Headphones
} from 'lucide-react';
import { getRandomQuote, CalmQuote } from '../../data/quotes';
import { storage, UserStats } from '../../services/storage';
import { toPersianDigits, getGreeting } from '../../utils/persian';
import { haptics } from '../../services/haptics';
import { TabType } from '../../components/BottomNav';

interface HomeScreenProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenBreathingTechnique: (techniqueId: string) => void;
  onOpenMeditation: (meditationId: string) => void;
  onOpenQuickSession: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTab,
  onOpenBreathingTechnique,
  onOpenMeditation,
  onOpenQuickSession,
}) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [quote, setQuote] = useState<CalmQuote>(getRandomQuote());
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [moodSubmitted, setMoodSubmitted] = useState(false);

  useEffect(() => {
    storage.getStats().then((s) => {
      setStats(s);
      if (s.moods.length > 0) {
        const todayIso = new Date().toISOString().split('T')[0];
        const todayMood = s.moods.find((m) => m.date.startsWith(todayIso));
        if (todayMood) {
          setSelectedMood(todayMood.moodIndex);
          setMoodSubmitted(true);
        }
      }
    });
  }, []);

  const handleMoodSelect = async (index: number) => {
    haptics.light();
    setSelectedMood(index);
  };

  const handleMoodSubmit = async () => {
    if (selectedMood === null) return;
    haptics.medium();
    await storage.addMood(selectedMood, moodNote || undefined);
    const updated = await storage.getStats();
    setStats(updated);
    setMoodSubmitted(true);
  };

  const handleRefreshQuote = () => {
    haptics.light();
    setQuote(getRandomQuote());
  };

  const moods = [
    { label: 'عالی', emoji: '✨' },
    { label: 'خوب', emoji: '🌿' },
    { label: 'آرام', emoji: '🕊️' },
    { label: 'خسته', emoji: '🌙' },
    { label: 'مضطرب', emoji: '🌧️' }
  ];

  const greeting = getGreeting();

  return (
    <div className="space-y-5 pb-safe px-4 max-w-md mx-auto">
      {/* Hero Banner: Greeting & Streak */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="liquid-glass rounded-3xl p-5 relative overflow-hidden shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[var(--accent-sage)] tracking-wider">
              مرکز خودمراقبتی و بهزیستی
            </span>
            <h2 className="text-xl font-black text-[var(--text-primary)] mt-1">
              {greeting.text}، وقت آرامش درون
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
              {greeting.subtext}
            </p>
          </div>

          {/* Streak pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl liquid-glass-subtle text-amber-600 dark:text-amber-400 shrink-0">
            <Flame className="w-4 h-4 fill-current animate-pulse" />
            <span className="text-xs font-bold">{toPersianDigits(stats?.streakDays || 0)} روز پیاپی</span>
          </div>
        </div>

        {/* 1-Minute Quick Calm Action Button */}
        <div className="mt-4 pt-3 border-t border-[var(--border-glass-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <Clock className="w-3.5 h-3.5 text-[var(--accent-sage)]" />
            <span>یک دقیقه وقت داری؟</span>
          </div>
          <button
            onClick={() => {
              haptics.medium();
              onOpenQuickSession();
            }}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#8FAE9B] to-[#7FD1C7] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <span>یک دقیقه آرامش</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Mood Tracker Bento Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="liquid-glass rounded-3xl p-5 shadow-lg"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            <span>حالت امروزت چطوره؟</span>
          </h3>
          {moodSubmitted && (
            <span className="text-[11px] text-[var(--accent-sage)] font-semibold">ثبت شد ✓</span>
          )}
        </div>

        <div className="grid grid-cols-5 gap-2 pt-1">
          {moods.map((m, idx) => {
            const isSelected = selectedMood === idx;
            return (
              <button
                key={m.label}
                onClick={() => handleMoodSelect(idx)}
                className={`flex flex-col items-center py-2.5 px-1 rounded-2xl transition-all ${
                  isSelected
                    ? 'bg-[var(--accent-sage)]/20 border-2 border-[var(--accent-sage)] scale-105 shadow-sm'
                    : 'liquid-glass-subtle hover:bg-white/50 dark:hover:bg-white/10'
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[10px] font-medium text-[var(--text-secondary)] mt-1">{m.label}</span>
              </button>
            );
          })}
        </div>

        {!moodSubmitted && selectedMood !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 pt-3 border-t border-[var(--border-glass-subtle)] space-y-2"
          >
            <input
              type="text"
              placeholder="اگر مایل بودی، یادداشت کوتاهی بنویس..."
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl liquid-glass-subtle text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none border border-[var(--border-glass)]"
            />
            <button
              onClick={handleMoodSubmit}
              className="w-full py-2 rounded-xl bg-[var(--accent-sage)] text-white text-xs font-bold active:scale-98 transition-all"
            >
              ثبت حال امروز
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Quote of the Day Bento Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="liquid-glass rounded-3xl p-5 shadow-lg relative"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[var(--accent-sage)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>حکمت روز</span>
          </span>
          <button
            onClick={handleRefreshQuote}
            title="جملهٔ دیگر"
            className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] liquid-glass-subtle"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed italic">
          «{quote.text}»
        </p>
        <p className="text-xs text-[var(--text-secondary)] mt-2 font-bold text-left">
          — {quote.author}
        </p>
      </motion.div>

      {/* Bento Grid: Core Sections */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Card 1: Breathing */}
        <motion.button
          onClick={() => {
            haptics.light();
            onNavigateTab('breathe');
          }}
          whileTap={{ scale: 0.97 }}
          className="liquid-glass rounded-3xl p-4 text-right flex flex-col justify-between h-36 relative overflow-hidden group shadow-md"
        >
          <div className="w-10 h-10 rounded-2xl bg-[var(--accent-sage-soft)] text-[var(--accent-sage)] flex items-center justify-center">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">تنفس علمی</h4>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">۸ تکنیک بالینی استنفورد و HRV</p>
          </div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-[var(--accent-sage)] opacity-10 group-hover:scale-150 transition-transform" />
        </motion.button>

        {/* Card 2: Sounds */}
        <motion.button
          onClick={() => {
            haptics.light();
            onNavigateTab('sounds');
          }}
          whileTap={{ scale: 0.97 }}
          className="liquid-glass rounded-3xl p-4 text-right flex flex-col justify-between h-36 relative overflow-hidden group shadow-md"
        >
          <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">میکسر طبیعت</h4>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">۱۴ کانال، باینورال و بدون اینترنت</p>
          </div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-sky-400 opacity-10 group-hover:scale-150 transition-transform" />
        </motion.button>

        {/* Card 3: Meditation */}
        <motion.button
          onClick={() => {
            haptics.light();
            onOpenMeditation('mbsr-breath-awareness');
          }}
          whileTap={{ scale: 0.97 }}
          className="liquid-glass rounded-3xl p-4 text-right flex flex-col justify-between h-36 relative overflow-hidden group shadow-md"
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">مدیتیشن MBSR</h4>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">ذهن‌آگاهی تنفس ۱۰ دقیقه‌ای</p>
          </div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-purple-400 opacity-10 group-hover:scale-150 transition-transform" />
        </motion.button>

        {/* Card 4: Library */}
        <motion.button
          onClick={() => {
            haptics.light();
            onNavigateTab('library');
          }}
          whileTap={{ scale: 0.97 }}
          className="liquid-glass rounded-3xl p-4 text-right flex flex-col justify-between h-36 relative overflow-hidden group shadow-md"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">کتابخانه و مقالات</h4>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">۳ کتاب مرجع، ۱۰ مقاله و پادکست</p>
          </div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-amber-400 opacity-10 group-hover:scale-150 transition-transform" />
        </motion.button>
      </div>

      {/* Recommended Practice for Current Time */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="liquid-glass rounded-3xl p-5 shadow-lg"
      >
        <span className="text-[11px] font-bold text-[var(--accent-sage)]">پیشنهاد هوشمند اکنون</span>
        <div className="flex items-center justify-between mt-2">
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">
              {new Date().getHours() >= 20 ? 'بازدم طولانی ۴-۶ برای خواب' : 'آه فیزیولوژیک (استنفورد)'}
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {new Date().getHours() >= 20
                ? 'کاهش فعالیت سیستم سمپاتیک و تسهیل ورود به امواج دلتا'
                : 'سریع‌ترین مهار استرس روز با دو دم متوالی و یک بازدم کشیده'}
            </p>
          </div>
          <button
            onClick={() => {
              const techId = new Date().getHours() >= 20 ? 'long-exhale-sleep' : 'physiological-sigh';
              onOpenBreathingTechnique(techId);
            }}
            className="w-10 h-10 rounded-2xl bg-[var(--accent-sage)] text-white flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-all mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
