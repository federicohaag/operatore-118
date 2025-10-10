import { useState, useEffect } from 'react';
import styles from './LiveCall.module.css';
import type { Call } from '../../../model/call';

interface LiveCallProps {
    call: Call;
    onClose: () => void;
}

export default function LiveCall({ call, onClose }: LiveCallProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    
    const words = call.text.split('');
    
    useEffect(() => {
        // Reset when call changes
        setDisplayedText('');
        setCurrentWordIndex(0);
    }, [call.id]);
    
    useEffect(() => {
        if (currentWordIndex < words.length) {
            const timer = setTimeout(() => {
                setDisplayedText(prev => {
                    const newText = currentWordIndex === 0 
                        ? words[currentWordIndex]
                        : prev + words[currentWordIndex];
                    return newText;
                });
                setCurrentWordIndex(prev => prev + 1);
            }, 20); // 150ms delay between words
            
            return () => clearTimeout(timer);
        }
    }, [currentWordIndex, words]);
    return (
        <div className={styles['live-call-container']}>
            <div className={styles['call-header']}>
                <h3>Call ID: {call.id}</h3>
            </div>
            <div className={styles['call-content']}>
                <p>
                    {displayedText}
                    {currentWordIndex < words.length && (
                        <span className={styles['cursor']}>|</span>
                    )}
                </p>
            </div>
            <div className={styles['call-actions']}>
                <button 
                    className={styles['close-button']} 
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}