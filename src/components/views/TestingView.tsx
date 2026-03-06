import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { FMSTestItem, JointAngleData, TestStatus } from '@/src/types';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowLeft, Play, Square, Loader2, CheckCircle2 } from 'lucide-react';

interface TestingViewProps {
  test: FMSTestItem;
  onBack: () => void;
  onComplete: (data: JointAngleData[]) => void;
}

export function TestingView({ test, onBack, onComplete }: TestingViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<TestStatus>('idle');
  const [data, setData] = useState<JointAngleData[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Start webcam
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    async function setupCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: 'user' },
        });
        activeStream = s;
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    }
    setupCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Simulate data and tracking
  useEffect(() => {
    let animationFrameId: number;
    let intervalId: NodeJS.Timeout;

    if (status === 'recording') {
      const startTime = Date.now();
      
      // Generate simulated joint data
      intervalId = setInterval(() => {
        const time = (Date.now() - startTime) / 1000;
        setData(prev => {
          const newData = [...prev, {
            timestamp: time,
            hip: 90 + Math.sin(time * 2) * 40 + Math.random() * 5,
            knee: 120 + Math.cos(time * 2) * 60 + Math.random() * 5,
            ankle: 80 + Math.sin(time * 1.5) * 20 + Math.random() * 5,
            shoulder: 150 + Math.cos(time * 1.5) * 30 + Math.random() * 5,
          }];
          return newData.slice(-50); // Keep last 50 points
        });
      }, 100);

      // Draw simulated tracking overlay
      const drawOverlay = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (canvas && video && video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw a simulated bounding box and skeleton
            const time = Date.now() / 1000;
            const cx = canvas.width / 2 + Math.sin(time) * 50;
            const cy = canvas.height / 2 + Math.cos(time * 0.5) * 30;
            
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.rect(cx - 150, cy - 250, 300, 500);
            ctx.stroke();

            // Simulate joints
            ctx.fillStyle = '#ff0000';
            const joints = [
              [cx, cy - 200], // Head
              [cx - 50, cy - 100], // L Shoulder
              [cx + 50, cy - 100], // R Shoulder
              [cx - 40, cy + 50], // L Hip
              [cx + 40, cy + 50], // R Hip
              [cx - 50, cy + 150], // L Knee
              [cx + 50, cy + 150], // R Knee
            ];
            
            joints.forEach(([x, y]) => {
              ctx.beginPath();
              ctx.arc(x, y, 6, 0, 2 * Math.PI);
              ctx.fill();
            });

            // Draw lines
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(joints[0][0], joints[0][1]);
            ctx.lineTo((joints[1][0] + joints[2][0])/2, (joints[1][1] + joints[2][1])/2);
            ctx.lineTo((joints[3][0] + joints[4][0])/2, (joints[3][1] + joints[4][1])/2);
            ctx.stroke();
          }
        }
        animationFrameId = requestAnimationFrame(drawOverlay);
      };
      drawOverlay();
    } else if (status === 'idle' || status === 'analyzing') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    return () => {
      clearInterval(intervalId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [status]);

  const handleStart = () => {
    setStatus('recording');
    setData([]);
  };

  const handleStop = () => {
    setStatus('analyzing');
    setTimeout(() => {
      onComplete(data);
    }, 2000); // Simulate analysis time
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 max-w-7xl"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} disabled={status === 'recording' || status === 'analyzing'}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">{test.name}</h1>
            <p className="text-zinc-500">{test.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {status === 'idle' && (
            <Button onClick={handleStart} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Play className="mr-2 h-4 w-4" /> 开始测试
            </Button>
          )}
          {status === 'recording' && (
            <Button onClick={handleStop} variant="destructive">
              <Square className="mr-2 h-4 w-4" /> 结束测试
            </Button>
          )}
          {status === 'analyzing' && (
            <Button disabled className="bg-zinc-800 text-white">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 分析中...
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden bg-black relative aspect-video border-zinc-800">
            {!stream && (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">正在请求摄像头权限...</span>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
            />
            {status === 'recording' && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-mono">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                REC
              </div>
            )}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-md text-xs font-mono">
              YOLO26 + Kalman Filter Active
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">实时关节角度</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                    <XAxis dataKey="timestamp" type="number" domain={['dataMin', 'dataMax']} tickFormatter={(val) => val.toFixed(1)} stroke="#a1a1aa" fontSize={12} />
                    <YAxis domain={[0, 180]} stroke="#a1a1aa" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                      labelFormatter={(val) => `Time: ${Number(val).toFixed(2)}s`}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    {test.jointsToTrack.includes('hip') && <Line type="monotone" dataKey="hip" stroke="#ef4444" dot={false} strokeWidth={2} isAnimationActive={false} />}
                    {test.jointsToTrack.includes('knee') && <Line type="monotone" dataKey="knee" stroke="#3b82f6" dot={false} strokeWidth={2} isAnimationActive={false} />}
                    {test.jointsToTrack.includes('ankle') && <Line type="monotone" dataKey="ankle" stroke="#10b981" dot={false} strokeWidth={2} isAnimationActive={false} />}
                    {test.jointsToTrack.includes('shoulder') && <Line type="monotone" dataKey="shoulder" stroke="#f59e0b" dot={false} strokeWidth={2} isAnimationActive={false} />}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-400 text-sm">
                  点击开始测试以查看实时数据
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">系统状态</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">模型加载</span>
                  <span className="flex items-center text-emerald-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> YOLO26 Ready
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">追踪算法</span>
                  <span className="flex items-center text-emerald-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Kalman Filter
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">时序分析</span>
                  <span className="flex items-center text-emerald-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Transformer
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">FPS</span>
                  <span className="font-mono text-zinc-900">
                    {status === 'recording' ? '60.0' : '0.0'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
