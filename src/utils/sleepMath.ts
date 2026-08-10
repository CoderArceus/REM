import { addMinutes, format, parse, isValid } from 'date-fns';

export const CYCLE_LENGTH = 90; // minutes
export const SLEEP_LATENCY = 15; // minutes to fall asleep
export const REM_WINDOW_START = 60; // REM peaks at ~60min into cycle
export const REM_WINDOW_END = 80; // to 80min

export interface SleepOption {
  cycles: number;
  bedtime: Date;
  displayTime: string;
  totalSleepMinutes: number;
  remPeaks: Date[];
  quality: 'optimal' | 'good' | 'minimal';
}

export function calculateBedtimes(wakeTime: Date): SleepOption[] {
  const options: SleepOption[] = [];
  const cycleCounts = [6, 5, 4, 3]; // 9h, 7.5h, 6h, 4.5h sleep
  
  for (const cycles of cycleCounts) {
    const sleepMinutes = cycles * CYCLE_LENGTH;
    const bedtime = addMinutes(wakeTime, -(sleepMinutes + SLEEP_LATENCY));
    
    const remPeaks: Date[] = [];
    for (let i = 0; i < cycles; i++) {
      const cycleStart = addMinutes(bedtime, SLEEP_LATENCY + i * CYCLE_LENGTH);
      remPeaks.push(addMinutes(cycleStart, REM_WINDOW_START));
    }
    
    let quality: SleepOption['quality'] = 'minimal';
    if (cycles >= 5) quality = 'optimal';
    else if (cycles === 4) quality = 'good';
    
    options.push({
      cycles,
      bedtime,
      displayTime: format(bedtime, 'h:mm a'),
      totalSleepMinutes: sleepMinutes,
      remPeaks,
      quality
    });
  }
  
  return options;
}

export function parseTimeString(timeStr: string): Date | null {
  const today = new Date();
  const parsed = parse(timeStr, 'h:mm a', today);
  return isValid(parsed) ? parsed : null;
}

export function formatTime(date: Date): string {
  return format(date, 'h:mm a');
}

export function getSleepQualityLabel(quality: SleepOption['quality']): string {
  const labels = { optimal: '🌙 Optimal (7.5h+)', good: '⭐ Good (6h)', minimal: '☁️ Minimal (4.5h)' };
  return labels[quality];
}

export function getQualityColor(quality: SleepOption['quality']): string {
  const colors = { optimal: '#00d4aa', good: '#ffb800', minimal: '#ff6b6b' };
  return colors[quality];
}
