import numpy as np
from typing import Tuple, Optional

class AngleCalculator:
    """静态角度计算工具类（向量法）"""
    @staticmethod
    def calculate_angle(
        a: Tuple[float, float],
        b: Tuple[float, float],
        c: Tuple[float, float]
    ) -> float:
        """计算三点夹角（度），返回0-180"""
        ba = np.array(a) - np.array(b)
        bc = np.array(c) - np.array(b)
        cosine = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc) + 1e-6)
        angle = np.arccos(np.clip(cosine, -1.0, 1.0))
        return np.degrees(angle)

    @staticmethod
    def get_landmark_point(landmarks: Dict[int, Tuple[float, float, float]], idx: int) -> Optional[Tuple[float, float]]:
        """提取2D坐标（忽略z，用于平面角度）"""
        if idx not in landmarks:
            return None
        x, y, _ = landmarks[idx]
        return (x, y)
