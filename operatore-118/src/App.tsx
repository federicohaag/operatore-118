import RegionSelector from './modules/region-selector/RegionSelector'
import ModalContainer from './modules/modal-container/ModalContainer';
import Game from './modules/game/Game';
import { useAppSelector, selectSelectedRegion, selectSelectedDispatchCenter } from './modules/shared-state';
import './App.css'

function App() {
  const selectedRegion = useAppSelector(selectSelectedRegion);
  const selectedDispatchCenter = useAppSelector(selectSelectedDispatchCenter);

  return (
    <>
      <ModalContainer>
        {!selectedRegion || !selectedDispatchCenter ? (
          <RegionSelector />
        ) : (
          <Game />
        )}
      </ModalContainer>
    </>
  )
}

export default App
