import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { ContinueButton } from './ContinueButton';
import { TypewriterText } from './TypewriterText';

export type ChoicePuzzleOption = {
  id: string;
  label: string;
  errorFeedback?: string[];
};

type ChoicePuzzleProps = {
  question: string;
  options: ChoicePuzzleOption[];
  correctOptionId: string;
  successFeedback: string[];
  generalErrorFeedback?: string[];
  actionLabel?: string;
  onContinue: () => void;
};

export function ChoicePuzzle({
  question,
  options,
  correctOptionId,
  successFeedback,
  generalErrorFeedback = ['quase.', 'mas pensa melhor...'],
  actionLabel = '[ continuar ]',
  onContinue,
}: ChoicePuzzleProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const isCorrect = selectedOptionId === correctOptionId;
  const selectedOption = options.find((option) => option.id === selectedOptionId);
  const feedback = isCorrect
    ? successFeedback
    : selectedOption?.errorFeedback ?? generalErrorFeedback;

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
      className="space-y-5 border border-terminal-green/35 bg-terminal-black/45 p-4"
    >
      {question ? (
        <p className="font-mono text-sm leading-6 text-terminal-white/85">{question}</p>
      ) : null}

      <div className="space-y-2">
        {options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          const optionIsCorrect = option.id === correctOptionId;

          return (
            <motion.button
              key={option.id}
              type="button"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: index * 0.04, ease: 'easeOut' }}
              onClick={() => setSelectedOptionId(option.id)}
              className={`w-full border px-4 py-3 text-left font-mono text-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-terminal-lime/50 ${
                isSelected && optionIsCorrect
                  ? 'border-terminal-lime bg-terminal-lime text-terminal-black'
                  : isSelected
                    ? 'border-terminal-pink/70 bg-terminal-pink/10 text-terminal-white'
                    : 'border-terminal-green/35 bg-terminal-green/5 text-terminal-white/85 hover:border-terminal-lime hover:bg-terminal-green/10'
              }`}
            >
              {option.label}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selectedOptionId ? (
          <motion.div
            key={selectedOptionId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="space-y-4"
          >
            <div className="space-y-2 border-l border-terminal-green/45 pl-3 font-mono text-sm leading-6 text-terminal-muted">
              {feedback.map((line, index) => (
                <p key={`${selectedOptionId}-${index}`}>
                  <TypewriterText text={line} speed={24} showCursor={index === feedback.length - 1} />
                </p>
              ))}
            </div>

            {isCorrect ? <ContinueButton onClick={onContinue}>{actionLabel}</ContinueButton> : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}
