import type { ReactNode } from 'react';

type Speaker = 'sistema' | 'Lucas' | null;

type GuidedMessageProps = {
  speaker?: Speaker;
  children: ReactNode;
  className?: string;
};

export function GuidedMessage({ speaker = null, children, className = '' }: GuidedMessageProps) {
  return (
    <article className={`space-y-2 ${className}`}>
      {speaker ? (
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-terminal-muted">
          {speaker}
        </p>
      ) : null}

      <div className="font-mono text-[0.95rem] leading-7 text-terminal-white/90">
        <span className="mr-2 text-terminal-green">&gt;</span>
        {children}
      </div>
    </article>
  );
}
