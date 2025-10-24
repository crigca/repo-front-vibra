/* 
  App.tsx
 */
import './App.css'

/* Dependencies  */
import { useState } from "react";

import MusicProvider from './context/MusicProvider';


/* Components */
import Main from './components/Main'
import {Sidebar} from './components/Sidebar'
import MusicPlayer from './components/MusicPlayer'

/* types */
import type {ReproduceProps} from "../src/types/reproduceProps";

function App() {
  return (
    <>
      <MusicProvider>
        <Sidebar />
        <Main/>
        <MusicPlayer/>
      </MusicProvider>
    </>
  )
}

export default App;