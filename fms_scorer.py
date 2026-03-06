from abc import ABC, abstractmethod
from typing import Dict, List, Tuple
import numpy as np
from angle_calculator import AngleCalculator

class BaseFMSAnalyzer(ABC):
    def __init__(self, name: str):
        self.name = name
        self.required_angles: List[Tuple[str, Tuple[int, int, int]]] = []  # (名称, (p1,p2,p3))
        self.required_distances: List[str] = []  # 用于肩部等距离测试

    @abstractmethod
    def analyze(self, angles_history: List[Dict], distances_history: List[float] = None) -> Tuple[int, List[str]]:
        pass


class DeepSquatAnalyzer(BaseFMSAnalyzer):
    def __init__(self):
        super().__init__("Deep Squat")
        self.required_angles = [
            ("左膝角度", (23, 25, 27)), ("右膝角度", (24, 26, 28)),
            ("左髋躯干", (11, 23, 25)), ("右髋躯干", (12, 24, 26))
        ]

    def analyze(self, angles_history: List[Dict], _) -> Tuple[int, List[str]]:
        if not angles_history: return 0, ["未检测到动作"]
        knee_angles = [(a.get("左膝角度", 180) + a.get("右膝角度", 180)) / 2 for a in angles_history]
        bottom = angles_history[np.argmin(knee_angles)]
        lk, rk = bottom.get("左膝角度", 180), bottom.get("右膝角度", 180)
        torso = (bottom.get("左髋躯干", 180) + bottom.get("右髋躯干", 180)) / 2
        score, tips = 3, []
        if lk > 110 or rk > 110: score = 1; tips.append("下蹲深度不足（髋未低于膝）")
        elif lk > 100 or rk > 100: score = 2; tips.append("深度稍浅，加强踝关节活动度")
        if abs(lk - rk) > 15: score = min(score, 1); tips.append("左右不对称")
        if torso < 140: score = min(score, 1); tips.append("躯干前倾，强化核心")
        if score == 3: tips.append("完美！保持")
        return score, tips


class HurdleStepAnalyzer(BaseFMSAnalyzer):
    def __init__(self):
        super().__init__("Hurdle Step")
        self.required_angles = [
            ("左髋-膝-踝", (23, 25, 27)), ("右髋-膝-踝", (24, 26, 28)),
            ("腰椎稳定", (11, 23, 27))
        ]

    def analyze(self, angles_history: List[Dict], _) -> Tuple[int, List[str]]:
        if not angles_history: return 0, ["未检测到动作"]
        avg_align = np.mean([abs(a.get("左髋-膝-踝", 180) - 180) + abs(a.get("右髋-膝-踝", 180) - 180) for a in angles_history])
        lumbar_move = np.std([a.get("腰椎稳定", 180) for a in angles_history])
        score = 3 if avg_align < 15 and lumbar_move < 8 else 2 if avg_align < 30 else 1
        tips = ["动作完美"] if score == 3 else ["髋膝踝未完全对齐" if avg_align > 15 else "腰椎晃动明显"]
        return score, tips


class InLineLungeAnalyzer(BaseFMSAnalyzer):
    def __init__(self):
        super().__init__("In-line Lunge")
        self.required_angles = [("躯干垂直", (11, 23, 27)), ("前膝弯曲", (23, 25, 27))]

    def analyze(self, angles_history: List[Dict], _) -> Tuple[int, List[str]]:
        torso_avg = np.mean([a.get("躯干垂直", 180) for a in angles_history])
        score = 3 if torso_avg > 165 else 2 if torso_avg > 150 else 1
        tips = ["完美对齐"] if score == 3 else ["躯干倾斜，注意核心控制"]
        return score, tips


class ShoulderMobilityAnalyzer(BaseFMSAnalyzer):
    def __init__(self):
        super().__init__("Shoulder Mobility")
        self.required_distances = ["肩部距离"]

    def analyze(self, _, distances_history: List[float]) -> Tuple[int, List[str]]:
        if not distances_history: return 0, ["未检测到动作"]
        min_dist = min(distances_history)  # 越小越好
        hand_len_approx = 0.08  # 归一化手长参考
        if min_dist <= 0: score = 3
        elif min_dist <= hand_len_approx: score = 2
        else: score = 1
        tips = ["肩部活动度优秀！"] if score == 3 else ["双手距离过大，加强肩关节内外旋"]
        return score, tips


class ActiveStraightLegRaiseAnalyzer(BaseFMSAnalyzer):
    def __init__(self):
        super().__init__("Active Straight Leg Raise")
        self.required_angles = [("抬腿角度", (23, 25, 27)), ("非移动腿", (24, 26, 28))]

    def analyze(self, angles_history: List[Dict], _) -> Tuple[int, List[str]]:
        leg_angles = [a.get("抬腿角度", 0) for a in angles_history]
        max_angle = max(leg_angles) if leg_angles else 0
        score = 3 if max_angle > 70 else 2 if max_angle > 50 else 1
        tips = ["抬腿高度优秀"] if score == 3 else ["腘绳肌柔韧性不足"]
        return score, tips


class TrunkStabilityPushupAnalyzer(BaseFMSAnalyzer):
    def __init__(self):
        super().__init__("Trunk Stability Push-up")
        self.required_angles = [("脊柱稳定", (11, 23, 27)), ("手臂伸展", (11, 13, 15))]

    def analyze(self, angles_history: List[Dict], _) -> Tuple[int, List[str]]:
        spine_std = np.std([a.get("脊柱稳定", 180) for a in angles_history])
        score = 3 if spine_std < 10 else 2 if spine_std < 20 else 1
        tips = ["核心稳定优秀"] if score == 3 else ["腰椎下沉，强化躯干稳定性"]
        return score, tips


class RotaryStabilityAnalyzer(BaseFMSAnalyzer):
    def __init__(self):
        super().__init__("Rotary Stability")
        self.required_angles = [("对侧伸展稳定", (11, 23, 27)), ("髋部水平", (23, 25, 27))]

    def analyze(self, angles_history: List[Dict], _) -> Tuple[int, List[str]]:
        stability = np.mean([a.get("对侧伸展稳定", 180) for a in angles_history])
        score = 3 if stability > 160 else 2 if stability > 140 else 1
        tips = ["旋转稳定性完美"] if score == 3 else ["对侧肢体不稳定，加强核心旋转控制"]
        return score, tips


class FMSScorer:
    _analyzers = {
        "Deep Squat": DeepSquatAnalyzer(),
        "Hurdle Step": HurdleStepAnalyzer(),
        "In-line Lunge": InLineLungeAnalyzer(),
        "Shoulder Mobility": ShoulderMobilityAnalyzer(),
        "Active Straight Leg Raise": ActiveStraightLegRaiseAnalyzer(),
        "Trunk Stability Push-up": TrunkStabilityPushupAnalyzer(),
        "Rotary Stability": RotaryStabilityAnalyzer(),
    }

    @classmethod
    def get_analyzer(cls, test_name: str) -> BaseFMSAnalyzer:
        return cls._analyzers.get(test_name, DeepSquatAnalyzer())  # 默认兜底
