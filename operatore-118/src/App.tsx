import RegionSelector from './components/region-selector/RegionSelector'
import ModalContainer from './components/modal-container/ModalContainer';
import Game from './components/game/Game';
import { useAppSelector, selectRegion, selectDispatchCenter } from './shared-state';
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
