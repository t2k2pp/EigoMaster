
import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';
import { WordStat, QuizHistory } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';

const StatsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [wordStats, setWordStats] = useState<WordStat[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, history] = await Promise.all([
          db.getWordStats(),
          db.getQuizHistory(),
        ]);
        setWordStats(stats.sort((a,b) => a.accuracy - b.accuracy));
        setQuizHistory(history);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center">読み込み中...</div>;
  }
  
  const overallAccuracy = () => {
      const totalCorrect = wordStats.reduce((sum, stat) => sum + stat.correct, 0);
      const totalAttempts = wordStats.reduce((sum, stat) => sum + stat.correct + stat.incorrect, 0);
      if (totalAttempts === 0) return 0;
      return ((totalCorrect / totalAttempts) * 100).toFixed(1);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">学習記録</h1>
        <button onClick={onBack} className="text-slate-500 hover:text-sky-500 text-sm">
          &larr; ホームに戻る
        </button>
      </div>

      <Card className="mb-6">
        <h2 className="text-xl font-bold mb-2">サマリー</h2>
        <div className="flex justify-around text-center">
            <div>
                <p className="text-3xl font-bold text-sky-500">{quizHistory.length}</p>
                <p className="text-sm text-slate-500">プレイ回数</p>
            </div>
            <div>
                <p className="text-3xl font-bold text-emerald-500">{overallAccuracy()}%</p>
                <p className="text-sm text-slate-500">全体の正解率</p>
            </div>
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="text-xl font-bold mb-4">苦手な単語</h2>
        {wordStats.length > 0 ? (
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {wordStats.slice(0, 10).map((stat) => (
              <li key={stat.english} className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
                <span className="font-medium">{stat.english}</span>
                <span className={`font-bold ${stat.accuracy > 70 ? 'text-green-500' : stat.accuracy > 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {stat.accuracy.toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500">まだデータがありません。</p>
        )}
      </Card>
      
      <Card>
        <h2 className="text-xl font-bold mb-4">最近のプレイ履歴</h2>
        {quizHistory.length > 0 ? (
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {quizHistory.slice(0, 10).map((hist) => (
              <li key={hist.id} className="flex justify-between items-center p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
                <div>
                  <p className="font-medium">{hist.dictionaryName}</p>
                  <p className="text-sm text-slate-500">{new Date(hist.date).toLocaleDateString()}</p>
                </div>
                <span className="font-bold text-lg">{hist.score}/{hist.total}</span>
              </li>
            ))}
          </ul>
        ) : (
           <p className="text-slate-500">まだデータがありません。</p>
        )}
      </Card>
    </div>
  );
};

export default StatsScreen;
