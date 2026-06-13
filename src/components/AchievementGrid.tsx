import { Lock } from 'lucide-react';

type AchievementGridProps = {
  stats: {
    label: string;
    value: string;
  }[];
  locked: string[];
  showStats?: boolean;
  showLocked?: boolean;
};

export function AchievementGrid({
  stats,
  locked,
  showStats = true,
  showLocked = true,
}: AchievementGridProps) {
  return (
    <section className="space-y-4">
      {showStats ? (
        <div className="space-y-2">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-terminal-muted">
            dados
          </p>
          <div className="grid grid-cols-1 gap-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border border-terminal-green/35 bg-terminal-green/5 p-3"
              >
                <p className="font-pixel text-3xl leading-none text-terminal-lime">
                  {stat.value}
                </p>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-terminal-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {showLocked ? (
        <div className="space-y-2">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-terminal-muted">
            bloqueadas por enquanto
          </p>
          <div className="grid grid-cols-1 gap-2">
            {locked.map((achievement) => (
              <div
                key={achievement}
                className="flex items-center gap-3 border border-terminal-green/20 bg-terminal-black/40 p-3 font-mono text-sm text-terminal-muted"
              >
                <span className="flex h-5 w-5 items-center justify-center border border-terminal-green/30 text-terminal-muted">
                  <Lock className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span>{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
