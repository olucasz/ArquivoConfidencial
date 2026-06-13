import { AnimatePresence, motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ContinueButton } from './ContinueButton';
import { MediaRenderer, type MediaRendererItem } from './MediaRenderer';

export type MemoryMedia = MediaRendererItem;

export type MemoryBoxItem = {
  id: string;
  title: string;
  text: string[];
  placeholder: string;
  media?: MemoryMedia[];
};

type MemoryBoxProps = {
  items: MemoryBoxItem[];
  onComplete: () => void;
};

export function MemoryBox({ items, onComplete }: MemoryBoxProps) {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [openedItemIds, setOpenedItemIds] = useState<string[]>([]);
  const [mediaIndexes, setMediaIndexes] = useState<Record<string, number>>({});
  const continueRef = useRef<HTMLDivElement | null>(null);
  const allOpened = items.length > 0 && items.every((item) => openedItemIds.includes(item.id));

  useEffect(() => {
    if (!allOpened) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      continueRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 120);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [allOpened]);

  const handleOpenItem = (itemId: string) => {
    setActiveItemId(itemId);
    setOpenedItemIds((current) => (current.includes(itemId) ? current : [...current, itemId]));
    setMediaIndexes((current) => ({ ...current, [itemId]: 0 }));
  };

  const handleNextMedia = (itemId: string, total: number) => {
    setMediaIndexes((current) => ({
      ...current,
      [itemId]: ((current[itemId] ?? 0) + 1) % total,
    }));
  };

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
      className="space-y-5"
    >
      <div className="border border-terminal-green/40 bg-terminal-black/50 p-4 text-center shadow-[0_0_22px_rgb(66_255_106_/_0.08)]">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center border border-terminal-lime/60 bg-terminal-lime/10 text-terminal-lime">
          <Heart className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />
        </div>
        <p className="font-pixel text-4xl leading-none text-terminal-lime">caixa aberta</p>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-terminal-muted">
          toque em uma lembrança
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {items.map((item, index) => {
          const isOpened = openedItemIds.includes(item.id);
          const isActive = activeItemId === item.id;
          const media = item.media ?? [];
          const currentMediaIndex = mediaIndexes[item.id] ?? 0;
          const currentMedia = media[currentMediaIndex];

          return (
            <motion.article
              key={item.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: index * 0.04, ease: 'easeOut' }}
              className={`overflow-hidden border transition duration-200 ${
                isActive
                  ? 'border-terminal-lime bg-terminal-green/15'
                  : 'border-terminal-green/30 bg-terminal-green/5'
              }`}
            >
              <button
                type="button"
                onClick={() => handleOpenItem(item.id)}
                className="w-full p-3 text-left transition duration-200 hover:bg-terminal-green/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-terminal-lime/50"
              >
                <span className="block font-pixel text-3xl leading-none text-terminal-lime">
                  {item.title}
                </span>
                <span className="mt-2 block font-mono text-xs uppercase tracking-[0.18em] text-terminal-muted">
                  {isOpened ? 'memória aberta' : 'abrir memória'}
                </span>
              </button>

              <AnimatePresence>
                {isActive ? (
                  <motion.div
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="overflow-hidden border-t border-terminal-green/25 bg-terminal-panel/70"
                  >
                    <div className="space-y-2 p-4 font-mono text-sm leading-6 text-terminal-white/82">
                      {item.text.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>

                    <div className="space-y-3 px-4 pb-4">
                      <div className="flex h-[clamp(220px,38dvh,360px)] w-full items-center justify-center overflow-hidden border border-terminal-green/25 bg-terminal-black">
                        <MediaRenderer
                          media={currentMedia}
                          alt={item.title}
                          placeholder={item.placeholder}
                        />
                      </div>

                      {media.length > 0 ? (
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-terminal-muted">
                            {currentMediaIndex + 1} / {media.length}
                          </span>

                          {media.length > 1 ? (
                            <button
                              type="button"
                              onClick={() => handleNextMedia(item.id, media.length)}
                              className="border border-terminal-green/50 bg-terminal-green/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-terminal-lime transition duration-200 hover:border-terminal-lime hover:bg-terminal-lime hover:text-terminal-black focus:outline-none focus:ring-2 focus:ring-terminal-lime/50"
                            >
                              {currentMediaIndex >= media.length - 1
                                ? '[ voltar ao início ]'
                                : '[ próxima ]'}
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>

      {allOpened ? (
        <motion.div
          ref={continueRef}
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="sticky bottom-0 z-20 border-t border-terminal-green/20 bg-terminal-black/95 pt-3 shadow-[0_-18px_24px_rgb(3_5_2_/_0.82)]"
        >
          <ContinueButton onClick={onComplete}>[ continuar ]</ContinueButton>
        </motion.div>
      ) : null}
    </motion.section>
  );
}
