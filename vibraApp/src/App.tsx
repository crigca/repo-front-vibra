/* 
  App.tsx
 */
import './App.css'

/* Dependencies  */
import Main from './components/Main'
import { useState } from "react";


/* Components */
import {Sidebar} from './components/Sidebar'
import { MusicPlayer } from './components/MusicPlayer'

/* types */
import type {ReproduceProps} from "../src/types/reproduceProps";

function App() {
  const [dataToReproduce, setDataToReproduce]:[ReproduceProps,any] = useState({id:""});
  
  const playTrack=(data:ReproduceProps)=>{
    console.log("player:playing");
    setDataToReproduce(data);
  }
  return (
    <>
      <Sidebar/>
      <Main handlerPlayer={playTrack}/>
      <MusicPlayer dataPlayer={dataToReproduce}/>
    </>
  )
}

export default App;