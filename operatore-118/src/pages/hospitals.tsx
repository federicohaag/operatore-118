import HospitalsView from '../modules/hospitals-view/HospitalsView';
import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../modules/shared-state/store';
import '../index.css';

function HospitalsPage() {
    return (
        <StrictMode>
            <Provider store={store}>
                <HospitalsView />
            </Provider>
        </StrictMode>
    );
}

export default HospitalsPage;