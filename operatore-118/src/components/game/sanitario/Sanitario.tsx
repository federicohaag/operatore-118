import styles from './Sanitario.module.css';
import HospitalsView from './hospitals-view/HospitalsView';

export default function Sanitario() {
    return (
        <div className={styles['sanitario-container']}>
            <h3>Sanitario</h3>
            <p>Informazioni sanitarie e risorse mediche...</p>
            <div className={styles['hospitals-section']}>
                <HospitalsView />
            </div>
        </div>
    );
}