import React from 'react';
import { Home, Wind, Waves, BookOpen, User } from 'lucide-react';
import { motion } from 'motion/react';
import { haptics } from '../services/haptics';

export type TabType = 'home' | 'breathe' | 'sounds' | 'library' | 'profile';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenQuickSession: () => void;
  isScrolled?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenQuickSession,
  isScrolled = false
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'خانه', icon: Home },
    { id: 'breathe' as TabType, label: 'تنفس', icon: Wind },
    { id: 'sounds' as TabType, label: 'صداها', icon: Waves },
    { id: 'library' as TabType, label: 'کتابخانه', icon: BookOpen },
    { id: 'profile' as TabType, label: 'من', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pt-1 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pointer-events-none">
      <motion.div
        animate={{
          scale: isScrolled ? 0.96 : 1,
          y: 0
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="max-w-md mx-auto liquid-glass rounded-full px-3 py-2 flex items-center justify-between pointer-events-auto shadow-2xl relative"
      >
        {/* First 2 tabs */}
        <div className="flex items-center flex-1 justify-around">
          {tabs.slice(0, 2).map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  haptics.light();
                  onSelectTab(tab.id);
                }}
                className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                  isActive
                    ? 'text-[var(--accent-sage)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 bg-white/40 dark:bg-white/10 rounded-2xl -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5 transition-transform" />
                <span className="text-[11px] font-medium mt-0.5 tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Central Pulsing Quick-Session Button (Breathing sphere) */}
        <div className="relative px-2">
          <motion.button
            onClick={() => {
              haptics.medium();
              onOpenQuickSession();
            }}
            whileTap={{ scale: 0.9 }}
            animate={{
              scale: [1, 1.08, 1],
              boxShadow: [
                '0 0 0 0 rgba(143, 174, 155, 0.4)',
                '0 0 0 10px rgba(143, 174, 155, 0)',
                '0 0 0 0 rgba(143, 174, 155, 0)'
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            title="جلسهٔ تنفس سریع"
            className="w-13 h-13 -my-3 rounded-full bg-gradient-to-tr from-[#8FAE9B] to-[#7FD1C7] text-white flex items-center justify-center shadow-lg border-2 border-white/60 dark:border-white/20 active:scale-95"
          >
            <div className="w-5 h-5 rounded-full bg-white/80 animate-pulse flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#8FAE9B]" />
            </div>
          </motion.button>
        </div>

        {/* Last 3 tabs */}
        <div className="flex items-center flex-1 justify-around">
          {tabs.slice(2).map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  haptics.light();
                  onSelectTab(tab.id);
                }}
                className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                  isActive
                    ? 'text-[var(--accent-sage)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 bg-white/40 dark:bg-white/10 rounded-2xl -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5 transition-transform" />
                <span className="text-[11px] font-medium mt-0.5 tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
