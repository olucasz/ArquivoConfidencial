import { useEffect, useMemo, useRef, useState } from 'react';

type TypewriterTextProps = {
  text: string | string[];
  speed?: number;
  startDelay?: number;
  onComplete?: () => void;
  className?: string;
  showCursor?: boolean;
};

export function TypewriterText({
  text,
  speed = 32,
  startDelay = 120,
  onComplete,
  className = '',
  showCursor = true,
}: TypewriterTextProps) {
  const content = useMemo(() => (Array.isArray(text) ? text.join('\n') : text), [text]);
  const [visibleCount, setVisibleCount] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setVisibleCount(0);

    if (!content.length) {
      onCompleteRef.current?.();
      return;
    }

    let intervalId: number | undefined;
    const delayId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setVisibleCount((current) => {
          const next = Math.min(current + 1, content.length);

          if (next >= content.length && intervalId) {
            window.clearInterval(intervalId);
            onCompleteRef.current?.();
          }

          return next;
        });
      }, Math.max(1, speed));
    }, Math.max(0, startDelay));

    return () => {
      window.clearTimeout(delayId);

      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [content, speed, startDelay]);

  const visibleText = content.slice(0, visibleCount);
  const lines = visibleText.split('\n');

  return (
    <span className={className}>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`}>
          {line}
          {index < lines.length - 1 ? <br /> : null}
        </span>
      ))}
      {showCursor ? (
        <span className="ml-1 inline-block h-5 w-2 translate-y-1 bg-terminal-lime/80 align-middle motion-safe:animate-pulse" />
      ) : null}
    </span>
  );
}
