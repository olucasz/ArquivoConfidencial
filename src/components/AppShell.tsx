import type { ReactNode } from 'react';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="app-shell h-dvh w-full overflow-hidden overflow-x-hidden px-4 py-4 text-terminal-white">
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[460px] items-center justify-center overflow-x-hidden">
        {children}
      </div>
    </main>
  );
}
