export type FMSTestItem = {
  id: string;
  name: string;
  description: string;
  icon: string;
  jointsToTrack: string[];
};

export type TestStatus = 'idle' | 'preparing' | 'recording' | 'analyzing' | 'completed';

export type JointAngleData = {
  timestamp: number;
  hip: number;
  knee: number;
  ankle: number;
  shoulder: number;
};

export type TestResult = {
  testId: string;
  score: 0 | 1 | 2 | 3;
  feedback: string[];
  improvements: string[];
  maxAngles: Partial<Record<keyof Omit<JointAngleData, 'timestamp'>, number>>;
};
