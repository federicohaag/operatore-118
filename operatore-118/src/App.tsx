import RegionSelector from './modules/region-selector/RegionSelector'
import ModalContainer from './modules/modal-container/ModalContainer';
import Game from './modules/game/Game';
import { useAppSelector } from './modules/shared-state/hooks';
import './App.css'
import HospitalsView from './modules/hospitals-view/HospitalsView';

function App() {
  const selectedRegion = useAppSelector((state: { sharedState: { selectedRegion: string | null } }) => state.sharedState.selectedRegion);
  const selectedDispatchCenter = useAppSelector((state: { sharedState: { selectedDispatchCenter: string | null } }) => state.sharedState.selectedDispatchCenter);

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
