"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const words = ["space", "science", "innovation"];

type IntroAnimationProps = {
  onAnimationComplete: () => void;
};

export default function IntroAnimation({ onAnimationComplete }: IntroAnimationProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (currentWordIndex >= words.length) {
      setTimeout(() => {
        setFadingOut(true);
        setTimeout(onAnimationComplete, 1000);
      }, 500);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentWordIndex(currentWordIndex + 1);
    }, 1200);

    return () => clearTimeout(timer);
  }, [currentWordIndex, onAnimationComplete]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-1000",
        fadingOut && "opacity-0"
      )}
    >
      <div className="font-headline text-5xl md:text-7xl text-foreground relative h-20 w-80 text-center">
        {words.map((word, index) => (
          <span
            key={word}
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              index === currentWordIndex ? "opacity-100" : "opacity-0"
            )}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
