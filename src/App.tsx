/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { questions } from './questions';

export default function App() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [isFinished, setIsFinished] = useState(false);

  const letters = ['A', 'B', 'C', 'D'];

  const totalAnswered = useMemo(() => answered.filter((a) => a !== null).length, [answered]);
  const progress = useMemo(() => ((current + 1) / questions.length) * 100, [current]);

  const handleAnswer = (idx: number) => {
    if (answered[current] !== null) return;
    
    const newAnswered = [...answered];
    newAnswered[current] = idx;
    setAnswered(newAnswered);
    
    if (idx === questions[current].correct) {
      setScore((prev) => prev + 1);
    }
  };

  const navigate = (dir: number) => {
    setCurrent((prev) => Math.max(0, Math.min(questions.length - 1, prev + dir)));
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setAnswered(new Array(questions.length).fill(null));
    setIsFinished(false);
  };

  if (isFinished) {
    const pct = Math.round((score / totalAnswered) * 100) || 0;
    const grade = pct >= 90 ? '🎉 Excellent!' : pct >= 70 ? '👍 Good job!' : pct >= 50 ? '📚 Keep studying!' : '💪 Keep practicing!';
    
    return (
      <div className="quiz-wrap">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="results q-card"
          id="results-container"
        >
          <div className="results-score">{pct}%</div>
          <div style={{ fontSize: '20px', marginBottom: '0.5rem' }}>{grade}</div>
          <div className="results-label">{score} correct out of {totalAnswered} answered</div>
          <div style={{ margin: '1.5rem 0' }}>
            <button className="nav-btn primary" id="restart-btn" onClick={restart}>restart quiz</button>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            {questions.length - totalAnswered} questions skipped
          </div>
        </motion.div>
      </div>
    );
  }

  const q = questions[current];
  const userAns = answered[current];

  return (
    <div className="quiz-wrap px-4">
      <h2 className="sr-only">Python and REST API quiz with 110 multiple choice questions</h2>
      <header className="header" id="quiz-header">
        <div style={{ fontSize: '18px', fontWeight: '500', color: 'var(--color-text-primary)' }}>
          Python & REST API Quiz
        </div>
        <div className="score-badge" id="score-badge">
          Score: {score} / {totalAnswered}
        </div>
      </header>

      <div className="progress-bar" id="progress-bar">
        <div 
          className="progress-fill" 
          id="progress-fill" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="q-card"
          id={`question-card-${current}`}
        >
          <div className="topic-tag">{q.topic}</div>
          <div className="q-num">Question {current + 1} of {questions.length}</div>
          <div className="q-text">{q.q}</div>
          
          <div className="options">
            {q.opts.map((opt, i) => {
              let cls = 'opt';
              if (userAns !== null) {
                cls += ' answered disabled';
                if (i === q.correct) cls += ' correct';
                else if (i === userAns) cls += ' wrong';
              }
              
              return (
                <button 
                  key={i}
                  id={`opt-${current}-${i}`}
                  className={cls} 
                  onClick={() => handleAnswer(i)}
                  disabled={userAns !== null}
                >
                  <span className="opt-letter">{letters[i]}</span>
                  <span className="opt-text">{opt}</span>
                </button>
              );
            })}
          </div>

          {userAns !== null && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="explanation"
              id={`explanation-${current}`}
            >
              <strong>Explanation:</strong> {q.exp}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="nav" id="quiz-nav">
        <button 
          className="nav-btn" 
          id="prev-btn" 
          onClick={() => navigate(-1)} 
          disabled={current === 0}
        >
          ← prev
        </button>
        <span className="q-counter" id="nav-counter">
          {current + 1} of {questions.length}
        </span>
        {current === questions.length - 1 ? (
          <button 
            className="nav-btn primary" 
            id="finish-btn" 
            onClick={() => setIsFinished(true)}
          >
            finish ✓
          </button>
        ) : (
          <button 
            className="nav-btn primary" 
            id="next-btn" 
            onClick={() => navigate(1)}
          >
            next →
          </button>
        )}
      </div>
    </div>
  );
}

