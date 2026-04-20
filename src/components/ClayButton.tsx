"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { HTMLMotionProps } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "swatch";
type SwatchColor = "matcha" | "slushie" | "lemon" | "ube" | "blueberry" | "pomegranate";

interface ClayButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  swatch?: SwatchColor;
  children: ReactNode;
}

const swatchColors: Record<SwatchColor, { bg: string; text: string; hover: string }> = {
  matcha: {
    bg: "bg-transparent",
    text: "text-[#078a52]",
    hover: "hover:bg-[#078a52] hover:text-white",
  },
  slushie: {
    bg: "bg-transparent",
    text: "text-[#3bd3fd]",
    hover: "hover:bg-[#3bd3fd] hover:text-black",
  },
  lemon: {
    bg: "bg-transparent",
    text: "text-[#fbbd41]",
    hover: "hover:bg-[#fbbd41] hover:text-black",
  },
  ube: {
    bg: "bg-transparent",
    text: "text-[#43089f]",
    hover: "hover:bg-[#43089f] hover:text-white",
  },
  blueberry: {
    bg: "bg-transparent",
    text: "text-[#01418d]",
    hover: "hover:bg-[#01418d] hover:text-white",
  },
  pomegranate: {
    bg: "bg-transparent",
    text: "text-[#fc7981]",
    hover: "hover:bg-[#fc7981] hover:text-white",
  },
};

export default function ClayButton({
  variant = "primary",
  swatch = "lemon",
  children,
  className = "",
  ...props
}: ClayButtonProps) {
  const baseClasses = "font-semibold px-4 py-2 rounded-lg transition-all duration-200";

  const variantClasses = {
    primary:
      "bg-white text-black border border-[#dad4c8] hover:bg-[#faf9f7]",
    secondary: "bg-transparent text-black border border-[#717989] hover:border-black",
    swatch: `${swatchColors[swatch].bg} ${swatchColors[swatch].text} border border-current ${swatchColors[swatch].hover}`,
  };

  return (
    <motion.button
      whileHover={{
        rotate: -8,
        translateY: -3,
      }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        boxShadow:
          variant === "primary"
            ? "rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px"
            : undefined,
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
