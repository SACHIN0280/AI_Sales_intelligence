"use client";

import React, { useState, useEffect } from "react";

interface AITypingProps {
  text: string;
  speed?: number; // ms per char
  delay?: number; // start delay in ms
  className?: string;
  onComplete?: () => void;
}

export default function AITyping({
  text = "",
  speed = 25,
  delay = 0,
  className = "",
  onComplete,
}: AITypingProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!isStarted) return;
    
    setDisplayedText("");
    setIsFinished(false);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText((prev) => prev + text.charAt(currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsFinished(true);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, isStarted, onComplete]);

  return (
    <span className={`inline-flex items-center flex-wrap ${className}`}>
      {displayedText}
      {!isFinished && (
        <span className="inline-block w-1.5 h-4 ml-1 bg-accent-cyan animate-pulse rounded-full shadow-[0_0_8px_rgba(6,214,255,0.8)]" />
      )}
    </span>
  );
}
