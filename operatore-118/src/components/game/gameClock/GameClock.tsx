import React, { useState, useEffect } from 'react';
import { VirtualClock } from '../../../core/VirtualClock';
import styles from './GameClock.module.css';

interface GameClockProps {
  clock: VirtualClock;
}

/**
 * GameClock - Simulation time display and controls for the game
 * 
 * Displays the current simulation time in HH:mm:ss format with speed controls
 * integrated into the game interface.
 */
export const GameClock: React.FC<GameClockProps> = ({ clock }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1.0);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    // Initialize state with current clock values
    setCurrentTime(clock.now());
    setSpeed(clock.speed);
    setPaused(clock.paused);

    // Subscribe to clock changes
    const unsubscribe = clock.onChange(() => {
      setCurrentTime(clock.now());
      setSpeed(clock.speed);
      setPaused(clock.paused);
    });

    // Update display regularly while playing
    const interval = setInterval(() => {
      if (!clock.paused) {
        setCurrentTime(clock.now());
      }
    }, 100); // Update 10 times per second for smooth seconds display

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [clock]);

  const handlePlayPause = () => {
    if (paused) {
      clock.play();
    } else {
      clock.pause();
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    clock.setSpeed(newSpeed);
  };

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const speedOptions = [0.5, 1, 2, 4, 8];

  return (
    <div className={styles['clock-container']}>
      <div className={styles['time-display']}>
        {formatTime(currentTime)}
      </div>
      
      <div className={styles['controls']}>
        <button 
          className={`${styles['play-pause-btn']} ${paused ? styles['play'] : styles['pause']}`}
          onClick={handlePlayPause}
          title={paused ? 'Play simulation' : 'Pause simulation'}
        >
          {paused ? '▶' : '⏸'}
        </button>
        
        <div className={styles['speed-control']}>
          <select 
            value={speed} 
            onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
            className={styles['speed-select']}
          >
            {speedOptions.map(option => (
              <option key={option} value={option}>
                Speed: {option}x
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default GameClock;