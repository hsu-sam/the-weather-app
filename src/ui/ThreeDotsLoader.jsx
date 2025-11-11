import { motion } from 'framer-motion';

const bounceTransition = {
  duration: 0.4,
  repeat: Infinity,
  repeatType: 'reverse',
  ease: 'easeInOut',
};

export default function ThreeDotsWave() {
  return (
    <div className="flex justify-center items-center space-x-2 py-20">
      {[...Array(3)].map((_, i) => (
        <motion.span
          key={i}
          className="w-3 h-3 rounded-full bg-(--neutral-300)"
          animate={{ y: ['0%', '100%'] }}
          transition={{
            ...bounceTransition,
            delay: i * 0.2, // create the wave effect
          }}
        />
      ))}
    </div>
  );
}
