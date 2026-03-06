from abc import ABC, abstractmethod
from typing import Dict, List, Tuple, Any
import numpy as np
from angle_calculator import AngleCalculator

class BaseFMSAnalyzer(ABC):
    """FMS测试分析器基类"""
    def __init__(self, name: str):
        self.name = name
        self.required_angles: List[Tuple[str, Tuple[int, int, int]]] = []  # (名称, (p1, p2, p3))

    @abstractmethod
    def analyze(self, angles_history: List[Dict[str, float]]) -> Tuple[int, List[str]]:
        """返回 (得分0-3, 改进建议列表)"""
        pass

class DeepSquatAnalyzer(BaseFMSAnalyzer):
    """Deep Squat完整评分逻辑（基于官方FMS标准简化CV实现）"""
    def __init__(self):
        super().__init__("Deep Squat")
        self.required_angles = [
            ("Left Knee", (23, 25, 27)),   # 左髋-左膝-左踝
            ("Right Knee", (24, 26, 28)),
            ("Left Hip Angle", (11, 23, 25)),  # 躯干对齐参考
            ("Right Hip Angle", (12, 24, 26))
        ]

    def analyze(self, angles_history: List[Dict[str, float]]) -> Tuple[int, List[str]]:
        if not angles_history:
            return 0, ["未检测到有效动作"]

        # 取底部姿态（膝角最小值作为深蹲最低点）
        knee_angles = [(a.get("Left Knee", 180) + a.get("Right Knee", 180)) / 2 for a in angles_history]
        bottom_idx = np.argmin(knee_angles)
        bottom_angles = angles_history[bottom_idx]

        left_knee = bottom_angles.get("Left Knee", 180)
        right_knee = bottom_angles.get("Right Knee", 180)
        left_hip = bottom_angles.get("Left Hip Angle", 180)
        right_hip = bottom_angles.get("Right Hip Angle", 180)

        score = 3
        improvements = []

        # 深度判断（官方：髋低于膝 ≈ 膝角<100°）
        if left_knee > 110 or right_knee > 110:
            score = min(score, 1)
            improvements.append("下蹲深度不足（髋未低于膝）")
        elif left_knee > 100 or right_knee > 100:
            score = min(score, 2)
            improvements.append("下蹲深度稍浅，建议加强踝关节灵活性")

        # 对称性
        if abs(left_knee - right_knee) > 15:
            score = min(score, 1)
            improvements.append("左右膝角度不对称（>15°），可能存在髋/踝代偿")

        # 躯干直立（髋角接近180°表示躯干 upright）
        torso_angle = (left_hip + right_hip) / 2
        if torso_angle < 140:
            score = min(score, 1)
            improvements.append("躯干过度前倾，建议加强核心控制和胸椎灵活性")

        if score == 3:
            improvements.append("动作完美！保持当前水平")

        return score, improvements

class FMSScorer:
    """FMS评分工厂"""
    _analyzers = {
        "Deep Squat": DeepSquatAnalyzer(),
        # 其他6个测试后续扩展（当前返回占位）
        "Hurdle Step": None,
        "In-line Lunge": None,
        "Shoulder Mobility": None,
        "Active Straight Leg Raise": None,
        "Trunk Stability Push-up": None,
        "Rotary Stability": None,
    }

    @classmethod
    def get_analyzer(cls, test_name: str) -> BaseFMSAnalyzer:
        analyzer = cls._analyzers.get(test_name)
        if analyzer is None:
            # Stub for other tests
            class StubAnalyzer(BaseFMSAnalyzer):
                def __init__(self):
                    super().__init__(test_name)
                def analyze(self, _):
                    return 0, ["此测试评分逻辑待扩展（欢迎PR！）"]
            return StubAnalyzer()
        return analyzer
