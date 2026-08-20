import { motion } from "framer-motion";
import React from "react";
import "./Aurora.css";

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  return (
    <main>
      <div
        className={`aurora-wrapper ${className || ""}`}
        {...props}
      >
        <div className="aurora-container">
          <div
            className={`aurora-background ${
              showRadialGradient ? "with-radial-mask" : ""
            }`}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`aurora-blob blob-${i + 1}`}
              ></div>
            ))}
          </div>
        </div>
        {children}
      </div>
    </main>
  );
};
