import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

type ContinueButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  children?: ReactNode;
};

export function ContinueButton({
  children = '[ continuar ]',
  className = '',
  type = 'button',
  ...props
}: ContinueButtonProps) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.985 }}
      className={`w-full border border-terminal-green/70 bg-terminal-green/10 px-5 py-3.5 font-mono text-sm uppercase tracking-[0.16em] text-terminal-lime shadow-terminal transition duration-200 hover:border-terminal-lime hover:bg-terminal-lime hover:text-terminal-black focus:outline-none focus:ring-2 focus:ring-terminal-lime/70 focus:ring-offset-2 focus:ring-offset-terminal-black disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
