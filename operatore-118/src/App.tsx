import RegionSelector from './modules/region-selector/RegionSelector'
import ModalContainer from './modules/modal-container/ModalContainer';
import Game from './modules/game/Game';
import { useAppSelector, selectSelectedRegion, selectSelectedDispatchCenter } from './modules/shared-state';
import './App.css'
import HospitalsView from './modules/hospitals-view/HospitalsView';

function App() {
  const selectedRegion = useAppSelector(selectSelectedRegion);
  const selectedDispatchCenter = useAppSelector(selectSelectedDispatchCenter);

  return (
    <>
      <ModalContainer>
        {!selectedRegion || !selectedDispatchCenter ? (
          <RegionSelector />
        ) : (
          <><Game /><HospitalsView /></>
        )}
      </ModalContainer>
    </>
  )
}

export default App
