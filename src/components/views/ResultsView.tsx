import React from 'react';
import { motion } from 'motion/react';
import { FMSTestItem, TestResult } from '@/src/types';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { RotateCcw, Home, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface ResultsViewProps {
  test: FMSTestItem;
  result: TestResult;
  onRetest: () => void;
  onHome: () => void;
}

export function ResultsView({ test, result, onRetest, onHome }: ResultsViewProps) {
  const getScoreColor = (score: number) => {
    switch (score) {
      case 3: return 'text-emerald-500 bg-emerald-50 border-emerald-200';
      case 2: return 'text-amber-500 bg-amber-50 border-amber-200';
      case 1: return 'text-orange-500 bg-orange-50 border-orange-200';
      case 0: return 'text-red-500 bg-red-50 border-red-200';
      default: return 'text-zinc-500 bg-zinc-50 border-zinc-200';
    }
  };

  const scoreColor = getScoreColor(result.score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 py-12 max-w-4xl"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl mb-4">
          测试结果
        </h1>
        <p className="text-lg text-zinc-500">
          {test.name} - YOLO26 动作捕捉分析报告
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card className="md:col-span-1 flex flex-col items-center justify-center p-8 text-center border-2 shadow-sm">
          <CardTitle className="text-zinc-500 mb-4 text-lg">最终得分</CardTitle>
          <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${scoreColor} mb-4`}>
            <span className="text-6xl font-black">{result.score}</span>
          </div>
          <p className="text-sm text-zinc-500">
            {result.score === 3 ? '完美执行，无需代偿' :
             result.score === 2 ? '完成动作，存在轻微代偿' :
             result.score === 1 ? '无法完成动作' : '测试中出现疼痛'}
          </p>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-500" />
                动作分析反馈
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                {result.feedback.map((item, idx) => (
                  <li key={idx} className="flex items-start text-zinc-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 mr-3 flex-shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b border-zinc-100">
              <CardTitle className="text-lg flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                改进建议
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                {result.improvements.map((item, idx) => (
                  <li key={idx} className="flex items-start text-zinc-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 mr-3 flex-shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3 border-b border-zinc-100">
          <CardTitle className="text-lg flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-500" />
            关键关节最大角度
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(result.maxAngles).map(([joint, angle]) => (
              <div key={joint} className="bg-zinc-50 p-4 rounded-lg border border-zinc-100 text-center">
                <div className="text-sm text-zinc-500 capitalize mb-1">{joint}</div>
                <div className="text-2xl font-mono font-semibold text-zinc-900">{angle?.toFixed(1)}°</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center gap-4">
        <Button size="lg" variant="outline" onClick={onRetest} className="w-40">
          <RotateCcw className="mr-2 h-5 w-5" /> 重新测试
        </Button>
        <Button size="lg" onClick={onHome} className="w-40 bg-zinc-900 text-white hover:bg-zinc-800">
          <Home className="mr-2 h-5 w-5" /> 返回首页
        </Button>
      </div>
    </motion.div>
  );
}
