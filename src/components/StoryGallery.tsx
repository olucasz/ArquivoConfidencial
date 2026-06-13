import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { ContinueButton } from './ContinueButton';
import { MediaRenderer } from './MediaRenderer';

export type StoryGalleryItem = {
  id: string;
  mediaSrc?: string;
  mediaType?: 'image' | 'video';
};

type StoryGalleryProps = {
  stories: StoryGalleryItem[];
  onComplete: () => void;
};

export function StoryGallery({ stories, onComplete }: StoryGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const currentStory = stories[currentIndex];

  const handleNext = () => {
    if (currentIndex >= stories.length - 1) {
      setIsFinished(true);
      return;
    }

    setCurrentIndex((current) => Math.min(current + 1, stories.length - 1));
  };

  if (isFinished) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: 'easeOut' }}
        className="flex h-[min(720px,calc(100dvh-32px))] w-full max-w-full flex-col justify-center overflow-hidden overflow-x-hidden border border-terminal-green/60 bg-terminal-black p-5 shadow-terminal"
      >
        <div className="space-y-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-terminal-muted">
            arquivo restaurado
          </p>
          <h1 className="font-pixel text-5xl leading-none text-terminal-lime">
            memória desbloqueada.
          </h1>
          <ContinueButton onClick={onComplete}>[ continuar ]</ContinueButton>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: 'easeOut' }}
      className="flex h-[min(720px,calc(100dvh-32px))] w-full max-w-full flex-col overflow-hidden overflow-x-hidden border border-terminal-green/60 bg-terminal-black shadow-terminal"
    >
      <div className="flex shrink-0 gap-1 px-3 pt-3">
        {stories.map((story, index) => (
          <span key={story.id} className="h-1 min-w-0 flex-1 overflow-hidden bg-terminal-green/20">
            <span
              className={`block h-full bg-terminal-lime transition-all duration-300 ${
                index <= currentIndex ? 'w-full' : 'w-0'
              }`}
            />
          </span>
        ))}
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={handleNext}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') {
            return;
          }

          event.preventDefault();
          handleNext();
        }}
        className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-terminal-lime/60"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStory.id}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="flex h-full max-h-[clamp(360px,62dvh,560px)] w-full max-w-full items-center justify-center overflow-hidden border border-terminal-green/35 bg-terminal-black"
          >
            <MediaRenderer
              media={
                currentStory.mediaSrc && currentStory.mediaType
                  ? { src: currentStory.mediaSrc, type: currentStory.mediaType }
                  : undefined
              }
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="shrink-0 px-4 pb-4 pt-1">
        <ContinueButton onClick={handleNext}>
          {currentIndex >= stories.length - 1 ? '[ finalizar ]' : '[ próxima ]'}
        </ContinueButton>
      </div>
    </motion.section>
  );
}
