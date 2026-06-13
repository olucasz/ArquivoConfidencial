import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { ContinueButton } from './ContinueButton';
import { TypewriterText } from './TypewriterText';

type FinalLetterProps = {
  letter: string;
  actionLabel?: string;
  onComplete: () => void;
};

export function FinalLetter({ letter, actionLabel = '[ concluir ]', onComplete }: FinalLetterProps) {
  const paragraphs = useMemo(
    () => letter.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean),
    [letter],
  );
  const [visibleParagraphCount, setVisibleParagraphCount] = useState(1);
  const [completedParagraphCount, setCompletedParagraphCount] = useState(0);
  const visibleParagraphs = paragraphs.slice(0, visibleParagraphCount);
  const allComplete = completedParagraphCount >= paragraphs.length;

  const handleParagraphComplete = (paragraphIndex: number) => {
    const nextCompletedCount = paragraphIndex + 1;

    setCompletedParagraphCount((current) => Math.max(current, nextCompletedCount));
    setVisibleParagraphCount((current) => {
      if (paragraphIndex !== current - 1) {
        return current;
      }

      return Math.min(current + 1, paragraphs.length);
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex h-[min(720px,calc(100dvh-32px))] w-full flex-col overflow-hidden border border-terminal-lime/20 bg-[#10130d]/95 text-terminal-white shadow-[0_0_28px_rgb(184_255_77_/_0.08)]"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="shrink-0 border-b border-terminal-lime/15 p-5 pb-4 sm:p-6 sm:pb-4">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-terminal-muted">
            carta completa
          </p>
        </header>

        <article className="terminal-feed no-scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto overflow-x-hidden p-5 font-mono text-[0.95rem] leading-8 text-terminal-white/88 sm:p-6">
          {visibleParagraphs.map((paragraph, index) => {
            const isCurrentParagraph = index === visibleParagraphs.length - 1;
            const paragraphIsComplete = completedParagraphCount > index;

            return (
              <motion.p
                key={`${paragraph}-${index}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="whitespace-pre-line"
              >
                <TypewriterText
                  text={paragraph}
                  speed={48}
                  startDelay={index === 0 ? 180 : 320}
                  showCursor={isCurrentParagraph && !paragraphIsComplete}
                  onComplete={() => handleParagraphComplete(index)}
                />
              </motion.p>
            );
          })}
        </article>

        {allComplete ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="shrink-0 border-t border-terminal-lime/15 p-5 sm:p-6"
          >
            <ContinueButton onClick={onComplete}>{actionLabel}</ContinueButton>
          </motion.div>
        ) : null}
      </div>
    </motion.section>
  );
}
