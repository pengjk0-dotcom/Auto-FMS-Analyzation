import { FMSTestItem } from './types';

export const FMS_TESTS: FMSTestItem[] = [
  {
    id: 'deep-squat',
    name: '深蹲 (Deep Squat)',
    description: '评估双侧对称性、髋、膝、踝关节的灵活性和核心稳定性。',
    icon: 'Activity',
    jointsToTrack: ['hip', 'knee', 'ankle', 'shoulder'],
  },
  {
    id: 'hurdle-step',
    name: '跨栏步 (Hurdle Step)',
    description: '评估身体在单腿站立时的稳定性、髋关节的灵活性及骨盆的控制能力。',
    icon: 'Footprints',
    jointsToTrack: ['hip', 'knee', 'ankle'],
  },
  {
    id: 'inline-lunge',
    name: '直线弓箭步 (In-Line Lunge)',
    description: '评估躯干、肩、髋和踝关节在不对称姿势下的灵活性和稳定性。',
    icon: 'MoveVertical',
    jointsToTrack: ['hip', 'knee', 'ankle', 'shoulder'],
  },
  {
    id: 'shoulder-mobility',
    name: '肩部灵活性 (Shoulder Mobility)',
    description: '评估双侧肩关节的活动度，包括内旋、外旋、外展等。',
    icon: 'UserRound',
    jointsToTrack: ['shoulder'],
  },
  {
    id: 'active-straight-leg-raise',
    name: '主动直腿上抬 (Active Straight-Leg Raise)',
    description: '评估大腿后侧肌群的柔韧性及骨盆和核心的稳定性。',
    icon: 'ArrowUpRight',
    jointsToTrack: ['hip', 'knee'],
  },
  {
    id: 'trunk-stability-pushup',
    name: '躯干稳定俯卧撑 (Trunk Stability Push-Up)',
    description: '评估在闭链运动中核心稳定脊柱的能力。',
    icon: 'ArrowDownToLine',
    jointsToTrack: ['shoulder', 'hip'],
  },
  {
    id: 'rotary-stability',
    name: '旋转稳定性 (Rotary Stability)',
    description: '评估在四足支撑状态下，躯干在多平面运动中的核心稳定性。',
    icon: 'RotateCw',
    jointsToTrack: ['shoulder', 'hip', 'knee'],
  },
];
