import './App.css'
import { Main } from './components/Main'
import { MusicPlayer } from './components/MusicPlayer'
import { Sidebar } from './components/Sidebar'
function App() {

  return (
    <>
      <Sidebar />
      <Main />
      <MusicPlayer />
    </>
  );
}

export default App
