import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '../redux/store.ts'
import HospitalsView from '../components/game/sanitario/hospitals-view/HospitalsView.tsx'
import ModalContainer from '../components/modal-container/ModalContainer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ModalContainer>
        <HospitalsView />
      </ModalContainer>
    </Provider>
  </StrictMode>,
)
