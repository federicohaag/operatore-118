import RegionSelector from './modules/region-selector/RegionSelector'
import ModalContainer from './modules/modal-container/ModalContainer';
import Game from './modules/game/Game';
import { useAppSelector, selectRegion, selectDispatchCenter } from './modules/shared-state';
import './App.css'

function App() {
  const region = useAppSelector(selectRegion);
  const dispatchCenter = useAppSelector(selectDispatchCenter);

  return (
    <>
      <ModalContainer>
        {!region || !dispatchCenter ? (
          <RegionSelector />
        ) : (
          <Game />
        )}
      </ModalContainer>
    </>
  )
}

export default App
