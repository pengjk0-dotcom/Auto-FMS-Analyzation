import React from 'react';
import { motion } from 'motion/react';
import { FMS_TESTS } from '@/src/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/Card';
import * as Icons from 'lucide-react';
import { FMSTestItem } from '@/src/types';

interface HomeViewProps {
  onSelectTest: (test: FMSTestItem) => void;
}

export function HomeView({ onSelectTest }: HomeViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto px-4 py-12 max-w-6xl"
    >
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl mb-4">
          选择测试项目
        </h1>
        <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
          基于 YOLO26 + Kalman Filter + Transformer 的高精度实时动作捕捉与评分系统。请选择一项 FMS 功能性运动筛查项目开始测试。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FMS_TESTS.map((test, index) => {
          const IconComponent = (Icons as any)[test.icon] || Icons.Activity;
          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="h-full cursor-pointer hover:border-zinc-400 transition-colors bg-white hover:shadow-md"
                onClick={() => onSelectTest(test)}
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-zinc-100 rounded-xl text-zinc-900">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{test.name}</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    {test.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {test.jointsToTrack.map(joint => (
                      <span key={joint} className="text-xs px-2 py-1 bg-zinc-100 text-zinc-600 rounded-md capitalize font-mono">
                        {joint}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
