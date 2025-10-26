/* 
  App.tsx
 */
import './App.css'

/* Dependencies  */
import { useState } from "react";

/* Context */
import MusicProvider from './context/MusicProvider';


/* Components */
import Waves from './components/layouts/Canvas'
import Header from './components/layouts/Header'
import Main from './components/Main'
import {Sidebar} from './components/Sidebar'
import MusicPlayer from './components/MusicPlayer'

/* types */

function App() {
  return (
    <>
      <MusicProvider>
        <Waves/>
        <div className="page-container">
          <Header/>
          <Sidebar />
          <Main/>
          <MusicPlayer/>
        </div>  
      </MusicProvider>
    </>
  )
}

export default App;