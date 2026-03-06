pose_detector.py
```python
import cv2
import mediapipe as mp
from typing import Optional, Dict, Tuple
import numpy as np

class PoseDetector:
    """MediaPipe姿态检测器封装类，支持实时帧处理和关键点提取"""
    def __init__(self, min_detection_confidence: float = 0.7, min_tracking_confidence: float = 0.7):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            enable_segmentation=False,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )
        self.mp_draw = mp.solutions.drawing_utils

    def process(self, frame: np.ndarray) -> Tuple[Optional[object], np.ndarray]:
        """处理单帧，返回results和带标注的帧"""
        if frame is None:
            return None, frame
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.pose.process(rgb)
        annotated = frame.copy()
        if results.pose_landmarks:
            self.mp_draw.draw_landmarks(
                annotated, results.pose_landmarks, self.mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=self.mp_draw.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                connection_drawing_spec=self.mp_draw.DrawingSpec(color=(255, 255, 255), thickness=2)
            )
        return results, annotated

    def extract_landmarks(self, results) -> Optional[Dict[int, Tuple[float, float, float]]]:
        """提取所有关键点（归一化坐标）"""
        if not results or not results.pose_landmarks:
            return None
        landmarks = {}
        for idx, lm in enumerate(results.pose_landmarks.landmark):
            landmarks[idx] = (lm.x, lm.y, lm.z)
        return landmarks
