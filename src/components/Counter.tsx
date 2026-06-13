import { useEffect, useMemo, useState } from 'react';

type CounterProps = {
  startDate: string;
};

type CounterValue = {
  label: string;
  value: number;
};

const formatter = new Intl.NumberFormat('pt-BR');

function getFullMonths(start: Date, end: Date) {
  let months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();

  if (end.getDate() < start.getDate()) {
    months -= 1;
  }

  return Math.max(0, months);
}

function getCounterValues(startDate: string, now: Date): CounterValue[] {
  const start = new Date(`${startDate}T00:00:00`);
  const safeStart = Number.isNaN(start.getTime()) ? now : start;
  const diffMs = Math.max(0, now.getTime() - safeStart.getTime());
  const totalMinutes = Math.floor(diffMs / 60000);
  const totalHours = Math.floor(diffMs / 3600000);
  const totalDays = Math.floor(diffMs / 86400000);

  return [
    { label: 'dias', value: totalDays },
    { label: 'meses', value: getFullMonths(safeStart, now) },
    { label: 'horas', value: totalHours },
    { label: 'minutos', value: totalMinutes },
  ];
}

export function Counter({ startDate }: CounterProps) {
  const [now, setNow] = useState(() => new Date());
  const values = useMemo(() => getCounterValues(startDate, now), [now, startDate]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <section className="grid grid-cols-2 gap-2">
      {values.map((item) => (
        <div
          key={item.label}
          className="border border-terminal-green/35 bg-terminal-green/5 p-3 text-center"
        >
          <p className="font-pixel text-4xl leading-none text-terminal-lime">
            {formatter.format(item.value)}
          </p>
          <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-terminal-muted">
            {item.label}
          </p>
        </div>
      ))}
    </section>
  );
}
