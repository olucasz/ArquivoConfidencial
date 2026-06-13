import { Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';

type MusicPlayerProps = {
  title: string;
  artist: string;
  audioSrc?: string;
  coverSrc?: string;
  isPlaying?: boolean;
  onToggle?: () => void;
  progress?: number;
};

export function MusicPlayer({
  title,
  artist,
  audioSrc,
  coverSrc,
  isPlaying = false,
  onToggle,
  progress = 0,
}: MusicPlayerProps) {
  const [visualIsPlaying, setVisualIsPlaying] = useState(false);
  const [visualProgress, setVisualProgress] = useState(0);
  const playerIsPlaying = onToggle ? isPlaying : visualIsPlaying;
  const playerProgress = onToggle ? progress : visualProgress;

  useEffect(() => {
    if (onToggle || audioSrc || !visualIsPlaying) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setVisualProgress((current) => (current >= 100 ? 0 : current + 1));
    }, 260);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [audioSrc, onToggle, visualIsPlaying]);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
      return;
    }

    setVisualIsPlaying((current) => !current);
  };

  return (
    <section className="space-y-4 border border-terminal-green/40 bg-terminal-black/50 p-4 shadow-[0_0_22px_rgb(66_255_106_/_0.08)]">
      <div className="flex gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center border border-terminal-green/35 bg-terminal-green/5">
          {coverSrc ? (
            <img src={coverSrc} alt={title} className="h-full w-full object-cover" />
          ) : (
            <span className="px-2 text-center font-mono text-[0.62rem] uppercase tracking-[0.18em] text-terminal-muted">
              capa aqui
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-terminal-muted">
              trilha encontrada
            </p>
            <h2 className="mt-1 font-pixel text-4xl leading-none text-terminal-lime">{title}</h2>
            <p className="font-mono text-sm text-terminal-white/75">{artist}</p>
          </div>

          <button
            type="button"
            onClick={handleToggle}
            className="inline-flex items-center gap-2 border border-terminal-green/60 bg-terminal-green/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-terminal-lime transition hover:border-terminal-lime hover:bg-terminal-lime hover:text-terminal-black focus:outline-none focus:ring-2 focus:ring-terminal-lime/60"
          >
            {playerIsPlaying ? (
              <Pause className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            )}
            {playerIsPlaying ? 'pausar' : 'tocar'}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-1.5 w-full bg-terminal-green/15">
          <div
            className="h-full bg-terminal-lime transition-all duration-200"
            style={{ width: `${Math.min(100, Math.max(0, playerProgress))}%` }}
          />
        </div>
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-terminal-muted">
          {audioSrc ? 'arquivo de áudio pronto' : 'player visual preparado'}
        </p>
      </div>
    </section>
  );
}
