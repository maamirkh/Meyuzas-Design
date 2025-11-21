"use client";

import React, { useState, useEffect, useCallback, JSX } from 'react';

interface CountdownTimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: string; // ISO 8601 string, e.g., "2025-12-25T00:00:00"
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const calculateTimeLeft = useCallback((): CountdownTimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: CountdownTimeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60)) % 60,
        seconds: Math.floor((difference / 1000)) % 60,
      };
    }

    return timeLeft;
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<CountdownTimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const timerComponents: JSX.Element[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    // Only show days, hours, and minutes for this request
    if (interval === "seconds") return; 
    
    // Ensure the value is a number and not negative
    const value = timeLeft[interval as keyof CountdownTimeLeft]; 
    if (value >= 0) {
      timerComponents.push(
        <span key={interval} className="countdown-segment">
          {`${value} ${interval} `}
        </span>
      );
    }
  });

  return (
    <div className="countdown-timer text-4xl font-bold text-center p-4">
      {timerComponents.length ? timerComponents : <span>Time&apos;s up!</span>}
    </div>
  );
};

export default CountdownTimer;