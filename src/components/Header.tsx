import React from 'react';
import { Sun, Moon, Sparkles, Bell } from 'lucide-react';
import { getGreeting, getPersianDate } from '../utils/persian';
import { haptics } from '../services/haptics';

interface HeaderProps {
  theme: 'light' | 'dark' | 'auto';
  onToggleTheme: () => void;
  onOpenNotifications: () => void;
  onOpenQuickSession: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onOpenNotifications,
  onOpenQuickSession
}) => {
  const greeting = getGreeting();
  const todayPersian = getPersianDate();

  return (
    <header className="sticky top-0 z-30 pt-safe px-4 pb-3 transition-colors">
      <div className="max-w-md mx-auto liquid-glass rounded-3xl px-5 py-3.5 flex items-center justify-between">
        {/* Right side (in RTL): Greeting & Date */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-medium">
            <span>{todayPersian}</span>
          </div>
          <h1 className="text-base font-bold text-[var(--text-primary)] mt-0.5 flex items-center gap-1.5">
            <span>{greeting.text}</span>
            <span className="text-xs font-normal text-[var(--accent-sage)]">· آرامیتو</span>
          </h1>
        </div>

        {/* Left side (in RTL): Actions */}
        <div className="flex items-center gap-1.5">
          {/* Quick Breath Pill */}
          <button
            onClick={() => {
              haptics.light();
              onOpenQuickSession();
            }}
            title="جلسه سریع آرامش"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium text-[var(--text-primary)] liquid-glass-subtle hover:bg-white/60 dark:hover:bg-white/10 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-sage)]" />
            <span className="hidden sm:inline">آرامش فوری</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => {
              haptics.light();
              onOpenNotifications();
            }}
            title="یادآورها و نوتیفیکیشن‌ها"
            className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] liquid-glass-subtle hover:bg-white/60 dark:hover:bg-white/10 active:scale-95 transition-all"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={() => {
              haptics.light();
              onToggleTheme();
            }}
            title={`تغییر پوسته (اکنون: ${theme === 'auto' ? 'خودکار' : theme === 'dark' ? 'تیره' : 'روشن'})`}
            className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] liquid-glass-subtle hover:bg-white/60 dark:hover:bg-white/10 active:scale-95 transition-all"
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-[var(--accent-sage)]" />
            ) : theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <div className="relative">
                <Sun className="w-4 h-4 text-amber-500/70" />
                <span className="absolute -bottom-1 -right-1 text-[8px] font-bold text-[var(--accent-sage)]">A</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
