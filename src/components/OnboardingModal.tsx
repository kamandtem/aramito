import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Moon, Brain, ShieldAlert, Clock, Bell, ArrowLeft, Check } from 'lucide-react';
import { storage } from '../services/storage';
import { notifications } from '../services/notifications';
import { haptics } from '../services/haptics';
import timeManagementArt from '../assets/time-management.svg';
import peaceOfMindArt from '../assets/peace-of-mind.svg';
import aloneArt from '../assets/alone.svg';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedGoal, setSelectedGoal] = useState<'sleep' | 'stress' | 'focus' | 'anxiety'>('stress');
  const [reminderTime, setReminderTime] = useState<string>('21:30');
  const [notifGranted, setNotifGranted] = useState<boolean>(false);

  if (!isOpen) return null;

  const goals = [
    { id: 'stress' as const, title: 'کاهش استرس و تنش روزمره', icon: Sparkles, desc: 'فعال‌سازی سیستم پاراسمپاتیک در چند دقیقه' },
    { id: 'sleep' as const, title: 'خواب عمیق و آسوده', icon: Moon, desc: 'پایان دادن به نشخوار فکری و بی‌خوابی شبانه' },
    { id: 'focus' as const, title: 'افزایش تمرکز و بهره‌وری ذهنی', icon: Brain, desc: 'آرام‌سازی پرش افکار پیش از کار عمیق' },
    { id: 'anxiety' as const, title: 'مهار اضطراب و دلشوره', icon: ShieldAlert, desc: 'روش‌های اثبات‌شده استنفورد برای آرامش فوری' }
  ];

  const handleNextStep = async () => {
    haptics.light();
    if (step === 1) {
      setStep(2);
    } else if (step === 2 || step === 3) {
      setStep(3);
      if (step === 3) setStep(4);
    } else {
      // Finish onboarding
      const settings = await storage.getSettings();
      settings.onboardingCompleted = true;
      settings.primaryGoal = selectedGoal;
      await storage.saveSettings(settings);

      const notifSettings = await storage.getNotifications();
      notifSettings.meditationReminderTime = reminderTime;
      await storage.saveNotifications(notifSettings);

      haptics.heavy();
      onComplete();
    }
  };

  const handleRequestNotif = async () => {
    haptics.medium();
    const granted = await notifications.requestPermission();
    setNotifGranted(granted);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-md liquid-glass rounded-3xl p-6 relative overflow-hidden shadow-2xl"
      >
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-8 bg-[var(--accent-sage)]' : s < step ? 'w-3 bg-[var(--accent-sage-soft)]' : 'w-3 bg-black/10 dark:bg-white/10'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-[var(--text-secondary)] font-medium">مرحله {step} از ۴</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3 text-center"
            >
              <img src={timeManagementArt} alt="آرامش با مدیریت زمان" className="w-48 h-44 object-contain mx-auto" />
              <h2 className="text-xl font-black text-[var(--text-primary)]">یک مکث برای خودت</h2>
              <p className="text-sm leading-7 text-[var(--text-secondary)]">در شلوغی روز، چند دقیقه نفس بکش و دوباره با خودت همراه شو.</p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3 text-center"
            >
              <img src={peaceOfMindArt} alt="ذهن آرام" className="w-48 h-44 object-contain mx-auto" />
              <h2 className="text-xl font-black text-[var(--text-primary)]">آرامش، همین حالا</h2>
              <p className="text-sm leading-7 text-[var(--text-secondary)]">با تنفس علمی، مدیتیشن و صداهای طبیعت، ریتم آرام خودت را پیدا کن.</p>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3 text-center"
            >
              <img src={aloneArt} alt="خلوت آگاهانه" className="w-48 h-44 object-contain mx-auto" />
              <h2 className="text-xl font-black text-[var(--text-primary)]">خلوتی که به تو می‌رسد</h2>
              <p className="text-sm leading-7 text-[var(--text-secondary)]">داده‌هایت روی همین گوشی می‌مانند؛ آرامیتو همراهی ساده و خصوصی برای حال بهتر است.</p>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--accent-sage-soft)] text-[var(--accent-sage)] flex items-center justify-center mx-auto">
                <Bell className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">آرامیتو را برای خودت تنظیم کن</h2>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">هدفت را انتخاب کن و اگر خواستی یک یادآور ملایم برای خلوت روزانه‌ات بگذار.</p>
              </div>

              <div className="space-y-2 text-right">
                {goals.map((g) => {
                  const Icon = g.icon;
                  const isSelected = selectedGoal === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => { haptics.light(); setSelectedGoal(g.id); }}
                      className={`w-full p-2.5 rounded-2xl flex items-center gap-2.5 transition-all ${isSelected ? 'bg-[var(--accent-sage)]/15 border-2 border-[var(--accent-sage)]' : 'liquid-glass-subtle'}`}
                    >
                      <Icon className="w-4 h-4 text-[var(--accent-sage)]" />
                      <span className="flex-1 text-xs font-bold text-[var(--text-primary)]">{g.title}</span>
                      {isSelected && <Check className="w-4 h-4 text-[var(--accent-sage)]" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between gap-3 p-3 rounded-2xl liquid-glass-subtle">
                <div className="text-right">
                  <p className="text-xs font-bold text-[var(--text-primary)]">یادآور آرامش</p>
                  <p className="text-[10px] text-[var(--text-secondary)]">هر روز در زمان انتخابی</p>
                </div>
                <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className="text-sm font-bold text-[var(--text-primary)] bg-transparent outline-none" />
              </div>

              <div className="p-3.5 rounded-2xl liquid-glass-subtle text-right">
                <p className="text-xs text-[var(--text-primary)] font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--accent-sage)]" />
                  <span>تضمین حریم خصوصی:</span>
                </p>
                <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                  تمام داده‌ها و تنظیمات ۱۰۰٪ روی گوشی شما ذخیره شده و هیچ اطلاعاتی ارسال نمی‌شود.
                </p>
              </div>

              <button
                onClick={handleRequestNotif}
                className={`w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  notifGranted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/70 dark:bg-white/10 hover:bg-white text-[var(--text-primary)] border border-[var(--border-glass)]'
                }`}
              >
                {notifGranted ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>دسترسی نوتیفیکیشن تأیید شد</span>
                  </>
                ) : (
                  <span>فعال‌سازی نوتیفیکیشن‌ها</span>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        <div className="mt-6 pt-2">
          <button
            onClick={handleNextStep}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8FAE9B] to-[#7FD1C7] text-white font-bold text-sm shadow-md hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>{step === 4 ? 'ورود به آرامیتو' : 'ادامه'}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
