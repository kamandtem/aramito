/**
 * Utility functions for Persian language, numbers, and dates
 */

export function toPersianDigits(input: string | number): string {
  if (input === null || input === undefined) return '';
  const str = input.toString();
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/\d/g, (x) => persianDigits[parseInt(x, 10)]);
}

export function formatSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  return toPersianDigits(formatted);
}

export function getPersianDate(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch {
    return 'امروز';
  }
}

export function getPersianWeekday(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      weekday: 'long'
    }).format(date);
  } catch {
    return '';
  }
}

export function getGreeting(): { text: string; subtext: string; icon: 'sun' | 'sunset' | 'moon' } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return {
      text: 'صبح به‌خیر',
      subtext: 'روزت را با یک نفس عمیق و آگاهانه آغاز کن',
      icon: 'sun'
    };
  } else if (hour >= 12 && hour < 18) {
    return {
      text: 'عصر آرام',
      subtext: 'لحظه‌ای بایست و تنش‌های روز را رها کن',
      icon: 'sunset'
    };
  } else {
    return {
      text: 'شب آرام',
      subtext: 'ذهنت را برای خوابی عمیق و آسوده آماده کن',
      icon: 'moon'
    };
  }
}
