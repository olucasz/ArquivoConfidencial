import { motion } from 'framer-motion';

type EndingScreenProps = {
  title: string;
  lines: string[];
};

export function EndingScreen({ title, lines }: EndingScreenProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="flex min-h-[calc(100dvh-3rem)] w-full flex-col justify-center border border-terminal-lime/20 bg-terminal-black/80 p-6 text-center shadow-[0_0_34px_rgb(184_255_77_/_0.08)]"
    >
      <div className="space-y-10">
        <h1 className="font-pixel text-6xl leading-none text-terminal-lime">{title}</h1>

        <div className="space-y-2 font-mono text-base leading-7 text-terminal-white/80">
          {lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
