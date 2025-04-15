
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface AnimatedElementProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  animation?: "fadeIn" | "slideUp" | "scale" | "none";
}

const AnimatedElement = ({
  children,
  delay = 0,
  className = "",
  animation = "fadeIn"
}: AnimatedElementProps) => {
  const animations = {
    fadeIn: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.6,
          ease: "easeOut",
          delay
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
          ease: "easeOut",
          delay
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
          ease: "easeOut",
          delay
        }
      }
    },
    none: {
      hidden: {},
      visible: {}
    }
  };

  const selectedAnimation = animations[animation];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={selectedAnimation}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedElement;
