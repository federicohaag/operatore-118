import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

type LoadingScreenProps = {
    onReady: () => void;
    isGameInitialized?: boolean;
};

/**
 * Loading screen that ensures all dependencies are ready before showing the game
 * 
 * Waits for:
 * - Leaflet library to load
 * - DOM to be fully ready
 * - Game initialization (AddressGenerator + CallGenerator)
 */
export default function LoadingScreen({ onReady, isGameInitialized = false }: LoadingScreenProps) {
    const [status, setStatus] = useState('Loading libraries...');
    
    // Update status when game initialization progresses
    useEffect(() => {
        if (isGameInitialized) {
            setStatus('Ready!');
        }
    }, [isGameInitialized]);
    
    useEffect(() => {
        let mounted = true;
        
        const loadLeaflet = (): Promise<void> => {
            return new Promise((resolve, reject) => {
                // Check if already loaded
                if (window.L) {
                    console.log('✅ Leaflet already loaded');
                    resolve();
                    return;
                }
                
                // Load CSS
                if (!document.querySelector('link[href*="leaflet"]')) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                    document.head.appendChild(link);
                    console.log('📄 Leaflet CSS added');
                }
                
                // Check if script tag exists
                const existingScript = document.querySelector('script[src*="leaflet"]');
                
                if (!existingScript) {
                    // Script doesn't exist, create it
                    const script = document.createElement('script');
                    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                    script.onload = () => {
                        console.log('📦 Leaflet script loaded, checking window.L...');
                        // Poll for window.L to be defined
                        let attempts = 0;
                        const checkInterval = setInterval(() => {
                            attempts++;
                            if (window.L) {
                                clearInterval(checkInterval);
                                console.log('✅ window.L is now available');
                                resolve();
                            } else if (attempts > 50) {
                                clearInterval(checkInterval);
                                console.error('❌ window.L still undefined after 50 attempts');
                                reject(new Error('Leaflet library did not initialize'));
                            }
                        }, 100);
                    };
                    script.onerror = (error) => {
                        console.error('❌ Failed to load Leaflet script:', error);
                        reject(new Error('Failed to load Leaflet script'));
                    };
                    document.head.appendChild(script);
                    console.log('📦 Leaflet script tag added');
                } else {
                    // Script tag exists, poll for window.L
                    console.log('📦 Leaflet script already exists, waiting for window.L...');
                    let attempts = 0;
                    const checkInterval = setInterval(() => {
                        attempts++;
                        if (window.L) {
                            clearInterval(checkInterval);
                            console.log('✅ window.L is now available');
                            resolve();
                        } else if (attempts > 50) {
                            clearInterval(checkInterval);
                            console.error('❌ window.L still undefined after 50 attempts');
                            reject(new Error('Leaflet library did not initialize'));
                        }
                    }, 100);
                }
            });
        };
        
        const checkReady = async () => {
            try {
                // Load Leaflet library
                setStatus('Loading map library...');
                console.log('🔄 Starting Leaflet load...');
                await loadLeaflet();
                
                if (!mounted) return;
                
                console.log('✅ Leaflet loaded successfully, window.L exists:', !!window.L);
                
                // Wait for DOM to be fully ready
                setStatus('Initializing game...');
                await new Promise(resolve => setTimeout(resolve, 300));
                
                if (!mounted) return;
                
                // Mark Leaflet as ready, game will now start initializing
                console.log('🎮 Leaflet ready, calling onReady');
                onReady();
            } catch (error) {
                console.error('❌ Error during initialization:', error);
                setStatus(`Error: ${error instanceof Error ? error.message : 'Failed to load'}`);
            }
        };
        
        checkReady();
        
        return () => {
            mounted = false;
        };
    }, [onReady]);
    
    return (
        <div className={styles['loading-screen']}>
            <div className={styles['loading-content']}>
                <div className={styles['spinner']}></div>
                <h1>Operatore 118</h1>
                <p>{status}</p>
            </div>
        </div>
    );
}
