import { TestResult } from '../types';

// SuperMemo-2 algorithm parameters
const DEFAULT_EASINESS = 2.5;
const DEFAULT_INTERVAL = 1;
const DEFAULT_REPETITIONS = 0;

export interface SpacedRepetitionData {
  easiness: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
  lastReview: Date | null;
}

export function calculateNextReview(
  quality: number, // 0-5 scale where 5 is perfect recall
  previousData?: SpacedRepetitionData
): SpacedRepetitionData {
  const data = previousData || {
    easiness: DEFAULT_EASINESS,
    interval: DEFAULT_INTERVAL,
    repetitions: DEFAULT_REPETITIONS,
    nextReview: new Date(),
    lastReview: null
  };

  // Implement SuperMemo-2 algorithm
  const newEasiness = Math.max(
    1.3,
    data.easiness + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  );

  let newInterval: number;
  let newRepetitions: number;

  if (quality < 3) {
    newInterval = 1;
    newRepetitions = 0;
  } else {
    newRepetitions = data.repetitions + 1;
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(data.interval * data.easiness);
    }
  }

  const now = new Date();
  const nextReview = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

  return {
    easiness: newEasiness,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReview,
    lastReview: now
  };
}

export function calculateRecallQuality(result: TestResult): number {
  const timeFactorWeight = 0.4;
  const accuracyWeight = 0.6;

  // Calculate time-based factor (0-1)
  const averageTimePerWord = result.totalTime / result.totalCount;
  const timeFactor = Math.min(1, 10000 / averageTimePerWord); // 10 seconds as baseline

  // Calculate accuracy factor (0-1)
  const accuracyFactor = result.correctCount / result.totalCount;

  // Combine factors and convert to 0-5 scale
  const quality = (timeFactor * timeFactorWeight + accuracyFactor * accuracyWeight) * 5;

  return Math.min(5, Math.max(0, quality));
}

export function getOptimalReviewOrder(words: Array<{ id: string; spacedRepetitionData?: SpacedRepetitionData }>) {
  return words.sort((a, b) => {
    const aData = a.spacedRepetitionData;
    const bData = b.spacedRepetitionData;

    if (!aData && !bData) return 0;
    if (!aData) return -1;
    if (!bData) return 1;

    // Prioritize overdue items
    const now = new Date().getTime();
    const aOverdue = now - aData.nextReview.getTime();
    const bOverdue = now - bData.nextReview.getTime();

    if (aOverdue > 0 && bOverdue <= 0) return -1;
    if (bOverdue > 0 && aOverdue <= 0) return 1;

    // If both are overdue or not overdue, sort by scheduled review date
    return aData.nextReview.getTime() - bData.nextReview.getTime();
  });
}