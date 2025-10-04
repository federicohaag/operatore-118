import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store, loadInitialState } from '../modules/shared-state'
import HospitalsView from '../modules/hospitals-view/HospitalsView.tsx'
import ModalContainer from '../modules/modal-container/ModalContainer.tsx'

// Load initial state from localStorage
loadInitialState(store);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ModalContainer>
        ciao
        <HospitalsView />
      </ModalContainer>
    </Provider>
  </StrictMode>,
)
