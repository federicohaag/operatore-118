import { useState, useEffect, useRef } from 'react';
import styles from './TextToSpeech.module.css';

interface TextToSpeechProps {
    /** Whether TTS is enabled */
    enabled: boolean;
    /** Callback when enabled state changes */
    onToggle: (enabled: boolean) => void;
}

/**
 * TextToSpeech component using the Web Speech API
 * 
 * Provides a toggle button to enable/disable text-to-speech functionality.
 * When enabled, text can be spoken using the speak() method via ref.
 */
export const TextToSpeech: React.FC<TextToSpeechProps> = ({ enabled, onToggle }) => {
    const [isSupported, setIsSupported] = useState(true);
    const [isSpeaking, setIsSpeaking] = useState(false);
    
    useEffect(() => {
        // Check if Web Speech API is supported
        if (!('speechSynthesis' in window)) {
            setIsSupported(false);
            console.warn('Web Speech API is not supported in this browser');
        }
    }, []);
    
    const handleToggle = () => {
        if (!isSupported) return;
        
        // If disabling while speaking, cancel current speech
        if (enabled && isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
        
        onToggle(!enabled);
    };
    
    // Monitor speech synthesis state
    useEffect(() => {
        if (!isSupported) return;
        
        const checkSpeaking = () => {
            setIsSpeaking(window.speechSynthesis.speaking);
        };
        
        const interval = setInterval(checkSpeaking, 100);
        return () => clearInterval(interval);
    }, [isSupported]);
    
    return (
        <button
            className={`${styles['tts-button']} ${enabled ? styles['enabled'] : ''} ${!isSupported ? styles['disabled'] : ''}`}
            onClick={handleToggle}
            disabled={!isSupported}
            title={!isSupported ? 'Text-to-speech not supported' : enabled ? 'Disable text-to-speech' : 'Enable text-to-speech'}
        >
            <span className={styles['tts-icon']}>
                {enabled ? (isSpeaking ? '🔊' : '🔉') : '🔇'}
            </span>
            <span className={styles['tts-label']}>TTS</span>
        </button>
    );
};

/**
 * Hook to control text-to-speech functionality
 * 
 * @returns Object with speak and stop functions
 */
export const useTextToSpeech = () => {
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    
    /**
     * Speaks the provided text
     * 
     * @param text - Text to speak
     * @param lang - Language code (default: 'it-IT' for Italian)
     */
    const speak = (text: string, lang: string = 'it-IT') => {
        if (!('speechSynthesis' in window)) return;
        
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        utteranceRef.current = utterance;
        
        // Speak
        window.speechSynthesis.speak(utterance);
    };
    
    /**
     * Stops current speech
     */
    const stop = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    };
    
    return {
        speak,
        stop,
    };
};

export default TextToSpeech;
