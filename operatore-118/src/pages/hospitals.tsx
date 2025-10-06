import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '../modules/shared-state'
import HospitalsView from '../modules/hospitals-view/HospitalsView.tsx'
import ModalContainer from '../modules/modal-container/ModalContainer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ModalContainer>
        <HospitalsView />
      </ModalContainer>
    </Provider>
  </StrictMode>,
)
