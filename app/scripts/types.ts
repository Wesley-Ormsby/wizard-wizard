export const SUITS = ["H", "C", "D", "S"] as const;
export type Suit = (typeof SUITS)[number];

export const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;
export type Rank = (typeof RANKS)[number];

export const EXTENDED_RANKS = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  "J",
  "W",
] as const;
export type ExtendedRank = (typeof EXTENDED_RANKS)[number];

export interface Card {
  suit: Suit;
  rank: ExtendedRank;
}

export type workerMessage =
  | { type: "progress"; progress: number }
  | { type: "result"; result: SimulationResult };

export interface WorkerRequest {
  trump: Card | null;
  players: number;
  position: number;
  hand: Card[];
  simulationCount: number;
}

export interface SimulationResult {
  mean: number;
  standardDeviation: number;
  percentages: Record<string, number>;
  expectedPoints: Record<string, number>;
}
