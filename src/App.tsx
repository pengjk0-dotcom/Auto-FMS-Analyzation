import React, { useState } from 'react';
import { Header } from '@/src/components/layout/Header';
import { HomeView } from '@/src/components/views/HomeView';
import { TestingView } from '@/src/components/views/TestingView';
import { ResultsView } from '@/src/components/views/ResultsView';
import { FMSTestItem, JointAngleData, TestResult } from '@/src/types';
import { AnimatePresence } from 'motion/react';

type ViewState = 'home' | 'testing' | 'results';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedTest, setSelectedTest] = useState<FMSTestItem | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  const handleSelectTest = (test: FMSTestItem) => {
    setSelectedTest(test);
    setCurrentView('testing');
  };

  const handleTestComplete = (data: JointAngleData[]) => {
    if (!selectedTest) return;

    // Simulate analysis based on data
    const maxAngles: Partial<Record<keyof Omit<JointAngleData, 'timestamp'>, number>> = {};
    selectedTest.jointsToTrack.forEach(joint => {
      maxAngles[joint as keyof typeof maxAngles] = Math.max(...data.map(d => d[joint as keyof typeof d]));
    });

    // Mock result generation
    const score = Math.floor(Math.random() * 3) + 1 as 1 | 2 | 3;
    
    const result: TestResult = {
      testId: selectedTest.id,
      score,
      maxAngles,
      feedback: [
        '动作连贯性良好，未出现明显停顿。',
        score < 3 ? '下蹲深度不足，大腿未达到水平位置。' : '下蹲深度达标，骨盆控制稳定。',
        '躯干前倾角度在可接受范围内。'
      ],
      improvements: [
        '加强踝关节背屈灵活性训练。',
        '进行核心稳定性强化，改善骨盆前倾。',
        '建议加入单腿硬拉以提升不对称姿势下的控制力。'
      ]
    };

    setTestResult(result);
    setCurrentView('results');
  };

  const handleRetest = () => {
    setCurrentView('testing');
  };

  const handleHome = () => {
    setSelectedTest(null);
    setTestResult(null);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Header />
      
      <main className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <HomeView key="home" onSelectTest={handleSelectTest} />
          )}
          {currentView === 'testing' && selectedTest && (
            <TestingView 
              key="testing" 
              test={selectedTest} 
              onBack={handleHome}
              onComplete={handleTestComplete}
            />
          )}
          {currentView === 'results' && selectedTest && testResult && (
            <ResultsView 
              key="results" 
              test={selectedTest} 
              result={testResult}
              onRetest={handleRetest}
              onHome={handleHome}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
