import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const getColor = (score) => {
  if (score >= 90) return '#10b981';
  if (score >= 80) return '#f59e0b';
  return '#ef4444';
};

const getLabel = (score) => {
  if (score >= 90) return 'High Confidence';
  if (score >= 80) return 'Medium Confidence';
  return 'Low Confidence';
};

const getRisk = (score) => {
  if (score >= 80) return 'Low';
  if (score >= 60) return 'Medium';
  return 'High';
};

const ConfidenceMeter = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 500);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full"
            style={{ background: getColor(score) }}
            initial={{ width: 0 }}
            animate={{ width: `${animatedScore}%` }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold" style={{ color: getColor(score) }}>{animatedScore}%</div>
          <div className="text-sm text-muted-foreground">{getLabel(score)}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium">Risk Level</div>
          <div className="text-xs text-muted-foreground">{getRisk(score)}</div>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceMeter; 