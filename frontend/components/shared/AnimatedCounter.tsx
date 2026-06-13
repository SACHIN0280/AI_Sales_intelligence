"use client";
import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export default function AnimatedCounter({ end, duration = 2000, prefix = "", suffix = "", decimals = 0 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * end);
      if (progress < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [end, duration]);

  const formatted = count.toFixed(decimals);
  return <span>{prefix}{Number(formatted).toLocaleString()}{suffix}</span>;
}
