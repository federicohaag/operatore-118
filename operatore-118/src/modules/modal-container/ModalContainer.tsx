import { type ReactNode } from 'react';
import styles from './ModalContainer.module.css';

interface ModalContainerProps {
    children: ReactNode;
}

export default function ModalContainer({ children }: ModalContainerProps) {
    return (
        <div className={styles['modal-container']}>
            {children}
        </div>
    );
}