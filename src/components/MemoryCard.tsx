import type { ReactNode } from 'react';

type MemoryCardProps = {
  title?: string;
  text?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageFit?: 'contain' | 'cover';
  imageLayout?: 'standard' | 'square';
  imagePosition?: string;
  placeholderLabel?: string;
  children?: ReactNode;
  className?: string;
};

export function MemoryCard({
  title,
  text,
  imageSrc,
  imageAlt = '',
  imageFit = 'contain',
  imageLayout = 'standard',
  imagePosition = 'center',
  placeholderLabel,
  children,
  className = '',
}: MemoryCardProps) {
  const imageAspectClass = imageLayout === 'square' ? 'aspect-square' : 'aspect-[4/3]';
  const imageFitClass = imageFit === 'cover' ? 'object-cover' : 'object-contain';

  return (
    <article
      className={`overflow-hidden border border-terminal-green/40 bg-terminal-black/50 text-terminal-white shadow-[0_0_18px_rgb(66_255_106_/_0.08)] ${className}`}
    >
      {imageSrc ? (
        <div
          className={`flex ${imageAspectClass} w-full items-center justify-center overflow-hidden border-b border-terminal-green/25 bg-terminal-black/80`}
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            className={`h-full w-full ${imageFitClass} opacity-90 saturate-[0.9]`}
            style={{ objectPosition: imagePosition }}
          />
        </div>
      ) : placeholderLabel ? (
        <div className="flex aspect-[4/3] w-full items-center justify-center border-b border-terminal-green/25 bg-terminal-green/5 font-mono text-xs uppercase tracking-[0.22em] text-terminal-muted">
          {placeholderLabel}
        </div>
      ) : null}

      <div className="space-y-3 p-4">
        {title ? (
          <h2 className="font-pixel text-3xl leading-none text-terminal-lime">{title}</h2>
        ) : null}

        {text ? <p className="font-mono text-sm leading-6 text-terminal-white/80">{text}</p> : null}

        {children}
      </div>
    </article>
  );
}
