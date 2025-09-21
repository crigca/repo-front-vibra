import './App.css'
import Main from './components/Main'
import {Sidebar} from './components/Sidebar'
//import {Player} from './components/Player'
//import {playTrack} from './components/player'

function App() {
  
  /*Mock for player*/
  const playTrack=():any=>{
    console.log("player:playing");
  }
  
  return (
    <>
      <Sidebar/>
      <Main handlerPlayer={playTrack}/>
      {/* <Player/> */}
    </>
  )
}

export default App
