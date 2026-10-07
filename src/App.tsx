import React, { useState, useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { AuroraBackground } from './components/AuroraBackground';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { MiniPlayer } from './components/MiniPlayer';
import { ToastContainer } from './components/Toast';
import { OnboardingModal } from './components/OnboardingModal';
import { HomeScreen } from './features/home/HomeScreen';
import { BreatheScreen } from './features/breathe/BreatheScreen';
import { BreathingSessionModal } from './features/breathe/BreathingSessionModal';
import { SoundsScreen } from './features/sounds/SoundsScreen';
import { MeditateScreen } from './features/meditate/MeditateScreen';
import { LibraryScreen } from './features/library/LibraryScreen';
import { ProfileScreen } from './features/profile/ProfileScreen';
import { NotificationSettingsModal } from './features/notifications/NotificationSettingsModal';
import { BREATHING_TECHNIQUES, BreathingTechnique } from './data/breathing';
import { storage, AppSettings } from './services/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>('auto');
  const [isDarkEffective, setIsDarkEffective] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Modals & Navigation helpers
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [quickSessionTech, setQuickSessionTech] = useState<BreathingTechnique | null>(null);
  const [directTechId, setDirectTechId] = useState<string | null>(null);
  const [directMedId, setDirectMedId] = useState<string | null>(null);

  // Initialize settings & theme
  useEffect(() => {
    storage.getSettings().then((s) => {
      setThemeMode(s.theme);
      if (!s.onboardingCompleted) {
        setOnboardingOpen(true);
      }
    });
  }, []);

  // Compute effective dark mode
  useEffect(() => {
    const evaluateDark = () => {
      if (themeMode === 'dark') return true;
      if (themeMode === 'light') return false;
      // Auto mode: dark after 18:30 (sunset) or before 06:00
      const hour = new Date().getHours();
      const min = new Date().getMinutes();
      const totalMin = hour * 60 + min;
      return totalMin >= 18 * 60 + 30 || totalMin < 6 * 60;
    };

    const isDark = evaluateDark();
    setIsDarkEffective(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  // Keep the WebView below the Android status bar. CSS safe-area padding
  // handles cutouts and gesture navigation inside the web content.
  useEffect(() => {
    const syncSystemBars = async () => {
      try {
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setStyle({ style: isDarkEffective ? Style.Light : Style.Dark });
        await StatusBar.setBackgroundColor({ color: isDarkEffective ? '#0F1222' : '#F6F3EE' });
      } catch {
        // Browser preview does not expose native system-bar APIs.
      }
    };
    syncSystemBars();
  }, [isDarkEffective]);

  // Track window scroll for bottom bar compaction
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Android Hardware Back Button
  useEffect(() => {
    let listenerHandle: { remove: () => void } | null = null;
    try {
      CapApp.addListener('backButton', () => {
        if (quickSessionTech) {
          setQuickSessionTech(null);
        } else if (notificationsOpen) {
          setNotificationsOpen(false);
        } else if (currentTab !== 'home') {
          setCurrentTab('home');
        } else {
          // At home, optionally let system handle back / minimize
        }
      }).then((handle) => {
        listenerHandle = handle;
      });
    } catch {}

    return () => {
      if (listenerHandle) listenerHandle.remove();
    };
  }, [quickSessionTech, notificationsOpen, currentTab]);

  const handleToggleTheme = async () => {
    const modes: ('light' | 'dark' | 'auto')[] = ['auto', 'light', 'dark'];
    const next = modes[(modes.indexOf(themeMode) + 1) % modes.length];
    setThemeMode(next);
    const settings = await storage.getSettings();
    settings.theme = next;
    await storage.saveSettings(settings);
  };

  const handleOpenQuickSession = () => {
    // 1-minute Physiological Sigh for rapid autonomic reset
    const sigh = BREATHING_TECHNIQUES.find((t) => t.id === 'physiological-sigh') || BREATHING_TECHNIQUES[0];
    setQuickSessionTech(sigh);
  };

  const handleOpenBreathingFromHome = (id: string) => {
    setDirectTechId(id);
    setCurrentTab('breathe');
  };

  const handleOpenMeditationFromHome = (id: string) => {
    setDirectMedId(id);
    setCurrentTab('home'); // or meditate screen
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between selection:bg-[var(--accent-sage)] selection:text-white">
      {/* Dynamic Aurora Ambient Glow Orbs */}
      <AuroraBackground />

      {/* In-app Toast Banner for Notification feedback */}
      <ToastContainer onNavigateTab={(tab) => setCurrentTab(tab)} />

      {/* Sticky Header with greeting, date & quick actions */}
      <Header
        theme={themeMode}
        onToggleTheme={handleToggleTheme}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenQuickSession={handleOpenQuickSession}
      />

      {/* Main Tab Screens */}
      <main className="flex-1 w-full pt-1 pb-[calc(env(safe-area-inset-bottom,0px)+6rem)]">
        {currentTab === 'home' && (
          <HomeScreen
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onOpenBreathingTechnique={handleOpenBreathingFromHome}
            onOpenMeditation={handleOpenMeditationFromHome}
            onOpenQuickSession={handleOpenQuickSession}
          />
        )}

        {currentTab === 'breathe' && (
          <BreatheScreen initialTechniqueId={directTechId} />
        )}

        {currentTab === 'sounds' && (
          <SoundsScreen />
        )}

        {currentTab === 'library' && (
          <LibraryScreen />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            onOpenNotifications={() => setNotificationsOpen(true)}
            onThemeChange={(newTheme) => {
              setThemeMode(newTheme);
              storage.getSettings().then((s) => {
                s.theme = newTheme;
                storage.saveSettings(s);
              });
            }}
            currentTheme={themeMode}
          />
        )}
      </main>

      {/* Floating MiniPlayer above TabBar */}
      <MiniPlayer onExpand={() => setCurrentTab('sounds')} />

      {/* Floating Liquid Glass Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setDirectTechId(null);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenQuickSession={handleOpenQuickSession}
        isScrolled={isScrolled}
      />

      {/* Quick Session / Breathing Player Modal */}
      {quickSessionTech && (
        <BreathingSessionModal
          technique={quickSessionTech}
          onClose={() => setQuickSessionTech(null)}
        />
      )}

      {/* Notifications Management Modal */}
      {notificationsOpen && (
        <NotificationSettingsModal
          onClose={() => setNotificationsOpen(false)}
        />
      )}

      {/* 3-Step Onboarding Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onComplete={() => setOnboardingOpen(false)}
      />
    </div>
  );
}
