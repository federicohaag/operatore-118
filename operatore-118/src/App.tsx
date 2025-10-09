import RegionSelector from './components/region-selector/RegionSelector'
import ModalContainer from './components/modal-container/ModalContainer';
import Game from './components/game/Game';
import { useAppSelector } from './global-state/hooks';
import { selectRegion, selectDispatchCenter } from './global-state/slices/localization';
import './App.css'

function App() {
  const region = useAppSelector(selectRegion);
  const dispatchCenter = useAppSelector(selectDispatchCenter);

  return (
    <>
        {!region || !dispatchCenter ? (
          <ModalContainer>
            <RegionSelector />
          </ModalContainer>
        ) : (
          <Game />
        )}
    </>
  )
}

export default App
