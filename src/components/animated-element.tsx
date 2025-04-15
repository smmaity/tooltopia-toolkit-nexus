
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface AnimatedElementProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  animation?: "fadeIn" | "slideUp" | "scale" | "none";
}

const animations = {
  fadeIn: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  },
  slideUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  },
  none: {
    hidden: { opacity: 1 },
    visible: { opacity: 1 }
  }
};

const AnimatedElement = ({
  children,
  delay = 0,
  className = "",
  animation = "fadeIn"
}: AnimatedElementProps) => {
  // Use fallback animation if the specified one doesn't exist
  const selectedAnimation = animations[animation] || animations.none;
  
  // Apply delay to the transition
  const animationWithDelay = {
    ...selectedAnimation,
    visible: {
      ...selectedAnimation.visible,
      transition: selectedAnimation.visible.transition
        ? {
            ...selectedAnimation.visible.transition,
            delay
          }
        : { delay }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={animationWithDelay}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedElement;
