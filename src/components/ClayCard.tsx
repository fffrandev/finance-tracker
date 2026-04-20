"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { HTMLMotionProps } from "framer-motion";

interface ClayCardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  featured?: boolean;
  border?: "solid" | "dashed";
  borderColor?: string;
}

export default function ClayCard({
  children,
  featured = false,
  border = "solid",
  borderColor = "#dad4c8",
  className = "",
  ...props
}: ClayCardProps) {
  const baseClasses = "bg-white transition-all duration-300";
  const radiusClass = featured ? "rounded-[24px]" : "rounded-[12px]";
  const borderClass =
    border === "dashed"
      ? "border-dashed"
      : "border-solid";
  
  const shadowStyle = {
    boxShadow:
      "rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px",
  };

  return (
    <motion.div
      whileHover={{
        transform: "translateY(-2px)",
      }}
      className={`${baseClasses} ${radiusClass} ${borderClass} border p-6 ${className}`}
      style={{
        borderColor,
        ...shadowStyle,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
