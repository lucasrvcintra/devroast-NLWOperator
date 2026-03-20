"use client";

import { useEffect, useState } from "react";

export function AnimatedNumber({
  value,
  format,
}: {
  value: number;
  format?: Intl.NumberFormatOptions;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - (1 - progress) ** 3;
      const current = value * easeOut;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  const formatted = new Intl.NumberFormat("en-US", format).format(displayValue);

  return <span>{formatted}</span>;
}
