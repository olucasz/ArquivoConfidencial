import { type MouseEvent, useEffect, useRef, useState } from 'react';

export type MediaRendererItem = {
  type: 'image' | 'video';
  src: string;
};

type MediaRendererProps = {
  media?: MediaRendererItem;
  alt?: string;
  placeholder?: string;
  className?: string;
};

export function MediaRenderer({
  media,
  alt = '',
  placeholder,
  className = '',
}: MediaRendererProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(media?.type === 'video');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsMuted(true);
    setHasError(false);
    setIsLoading(media?.type === 'video');
  }, [media?.src, media?.type]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || media?.type !== 'video') {
      return;
    }

    video.muted = true;
    video.volume = 1;
    video.currentTime = 0;
    void video.play().catch(() => undefined);

    return () => {
      video.pause();

      try {
        video.currentTime = 0;
      } catch {
        // Alguns navegadores não permitem seek antes dos metadados do vídeo carregarem.
      }
    };
  }, [media?.src, media?.type]);

  const handleSoundToggle = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const video = videoRef.current;

    if (!video) {
      return;
    }

    const nextMuted = !isMuted;
    video.muted = nextMuted;
    video.volume = nextMuted ? 0 : 1;

    try {
      await video.play();
      setIsMuted(nextMuted);
    } catch {
      video.muted = true;
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const handleMediaError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-terminal-black ${className}`}
    >
      {media?.type === 'video' && !hasError ? (
        <video
          ref={videoRef}
          src={media.src}
          className="block h-full w-full object-contain"
          autoPlay
          muted={isMuted}
          playsInline
          loop
          controls={false}
          preload="metadata"
          onCanPlay={() => setIsLoading(false)}
          onLoadedData={() => setIsLoading(false)}
          onError={handleMediaError}
        />
      ) : media?.src && !hasError ? (
        <img
          src={media.src}
          alt={alt}
          className="block h-full w-full object-contain"
          onError={handleMediaError}
        />
      ) : null}

      {isLoading && !hasError ? (
        <span className="absolute inset-x-4 top-1/2 -translate-y-1/2 text-center font-mono text-xs uppercase tracking-[0.18em] text-terminal-muted">
          carregando vídeo...
        </span>
      ) : null}

      {hasError ? (
        <span className="px-4 text-center font-mono text-xs uppercase tracking-[0.18em] text-terminal-muted">
          {media?.type === 'video'
            ? 'não foi possível carregar este vídeo'
            : 'não foi possível carregar esta mídia'}
        </span>
      ) : null}

      {!media && placeholder ? (
        <span className="px-4 text-center font-mono text-xs uppercase tracking-[0.2em] text-terminal-muted">
          {placeholder}
        </span>
      ) : null}

      {media?.type === 'video' && !hasError ? (
        <button
          type="button"
          onClick={handleSoundToggle}
          className="absolute bottom-3 right-3 border border-terminal-green/50 bg-terminal-black/85 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-terminal-lime transition duration-200 hover:border-terminal-lime hover:bg-terminal-lime hover:text-terminal-black focus:outline-none focus:ring-2 focus:ring-terminal-lime/50"
        >
          {isMuted ? '[ som ]' : '[ sem som ]'}
        </button>
      ) : null}
    </div>
  );
}
