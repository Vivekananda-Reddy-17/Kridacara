// AI-powered scoring system for talent assessment
export interface BenchmarkData {
  [key: string]: {
    [gender: string]: {
      [ageGroup: string]: {
        excellent: number;
        good: number;
        average: number;
        poor: number;
      };
    };
  };
}

const benchmarks: BenchmarkData = {
  'push-ups-1min': {
    male: {
      '18-25': { excellent: 45, good: 35, average: 25, poor: 15 },
      '26-35': { excellent: 40, good: 30, average: 20, poor: 12 },
      '36-45': { excellent: 35, good: 25, average: 18, poor: 10 },
    },
    female: {
      '18-25': { excellent: 35, good: 25, average: 18, poor: 10 },
      '26-35': { excellent: 30, good: 22, average: 15, poor: 8 },
      '36-45': { excellent: 25, good: 18, average: 12, poor: 6 },
    }
  },
  '100m-sprint': {
    male: {
      '18-25': { excellent: 11.5, good: 12.5, average: 13.5, poor: 15.0 },
      '26-35': { excellent: 12.0, good: 13.0, average: 14.0, poor: 15.5 },
      '36-45': { excellent: 12.5, good: 13.5, average: 14.5, poor: 16.0 },
    },
    female: {
      '18-25': { excellent: 13.0, good: 14.0, average: 15.0, poor: 17.0 },
      '26-35': { excellent: 13.5, good: 14.5, average: 15.5, poor: 17.5 },
      '36-45': { excellent: 14.0, good: 15.0, average: 16.0, poor: 18.0 },
    }
  },
  'grip-strength': {
    male: {
      '18-25': { excellent: 50, good: 45, average: 40, poor: 30 },
      '26-35': { excellent: 48, good: 43, average: 38, poor: 28 },
      '36-45': { excellent: 45, good: 40, average: 35, poor: 25 },
    },
    female: {
      '18-25': { excellent: 35, good: 30, average: 25, poor: 18 },
      '26-35': { excellent: 33, good: 28, average: 23, poor: 16 },
      '36-45': { excellent: 30, good: 25, average: 20, poor: 14 },
    }
  }
};

export function calculateAIScore(
  testType: string,
  result: number,
  age: number,
  gender: string
): { score: number; percentile: number; grade: string } {
  const ageGroup = age <= 25 ? '18-25' : age <= 35 ? '26-35' : '36-45';
  const benchmark = benchmarks[testType]?.[gender]?.[ageGroup];
  
  if (!benchmark) {
    // Fallback scoring
    return { score: 50, percentile: 50, grade: 'Average' };
  }

  let score: number;
  let percentile: number;
  let grade: string;

  // For time-based tests (lower is better)
  if (testType.includes('sprint') || testType.includes('time')) {
    if (result <= benchmark.excellent) {
      score = 90 + (benchmark.excellent - result) * 2;
      percentile = 95;
      grade = 'Excellent';
    } else if (result <= benchmark.good) {
      score = 75 + ((benchmark.excellent - result) / (benchmark.excellent - benchmark.good)) * 15;
      percentile = 80;
      grade = 'Good';
    } else if (result <= benchmark.average) {
      score = 50 + ((benchmark.good - result) / (benchmark.good - benchmark.average)) * 25;
      percentile = 60;
      grade = 'Average';
    } else {
      score = Math.max(20, 50 - ((result - benchmark.average) / benchmark.average) * 30);
      percentile = 30;
      grade = 'Needs Improvement';
    }
  } else {
    // For count/strength-based tests (higher is better)
    if (result >= benchmark.excellent) {
      score = 90 + Math.min(10, (result - benchmark.excellent) / benchmark.excellent * 10);
      percentile = 95;
      grade = 'Excellent';
    } else if (result >= benchmark.good) {
      score = 75 + ((result - benchmark.good) / (benchmark.excellent - benchmark.good)) * 15;
      percentile = 80;
      grade = 'Good';
    } else if (result >= benchmark.average) {
      score = 50 + ((result - benchmark.average) / (benchmark.good - benchmark.average)) * 25;
      percentile = 60;
      grade = 'Average';
    } else {
      score = Math.max(20, (result / benchmark.average) * 50);
      percentile = 30;
      grade = 'Needs Improvement';
    }
  }

  return {
    score: Math.round(Math.max(0, Math.min(100, score))),
    percentile: Math.round(Math.max(0, Math.min(100, percentile))),
    grade
  };
}

export const testCategories = {
  strength: [
    { id: 'push-ups-1min', name: 'Push-ups (1 min)', unit: 'reps' },
    { id: 'grip-strength', name: 'Grip Strength', unit: 'kg' },
    { id: 'bench-press', name: 'Bench Press', unit: 'kg' },
    { id: 'deadlift', name: 'Deadlift', unit: 'kg' }
  ],
  endurance: [
    { id: '100m-sprint', name: '100m Sprint', unit: 'seconds' },
    { id: '1km-run', name: '1km Run', unit: 'minutes' },
    { id: '5km-run', name: '5km Run', unit: 'minutes' },
    { id: 'plank-hold', name: 'Plank Hold', unit: 'seconds' }
  ],
  agility: [
    { id: 'shuttle-run', name: 'Shuttle Run', unit: 'seconds' },
    { id: 'ladder-drill', name: 'Ladder Drill', unit: 'seconds' },
    { id: 'cone-drill', name: 'Cone Drill', unit: 'seconds' }
  ],
  reflexes: [
    { id: 'reaction-time', name: 'Reaction Time', unit: 'ms' },
    { id: 'hand-eye-coordination', name: 'Hand-Eye Coordination', unit: 'score' },
    { id: 'balance-test', name: 'Balance Test', unit: 'seconds' }
  ]
};