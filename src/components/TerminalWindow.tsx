import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type TerminalWindowProps = {
  title?: string;
  children: ReactNode;
};

const fakeButtons = ['bg-terminal-pink/80', 'bg-terminal-lime/80', 'bg-terminal-green/80'];

export function TerminalWindow({ title = 'sessao segura', children }: TerminalWindowProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex h-[min(720px,calc(100dvh-32px))] w-full max-w-full overflow-hidden overflow-x-hidden border border-terminal-green/70 bg-terminal-panel/95 shadow-terminal"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgb(184_255_77_/_0.11),transparent_38%)]" />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-terminal-green/25 px-4 py-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {fakeButtons.map((colorClass) => (
              <span
                key={colorClass}
                className={`h-2.5 w-2.5 border border-terminal-white/20 ${colorClass}`}
              />
            ))}
          </div>

          <p className="truncate font-mono text-[0.68rem] uppercase tracking-[0.24em] text-terminal-muted">
            {title}
          </p>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-x-hidden">{children}</div>
      </div>
    </motion.section>
  );
}
