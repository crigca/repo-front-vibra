import Header from "./components/header";
import { Footer } from "./components/footer";
<<<<<<< HEAD


function App() {
  return (
      <>
      <Header></Header>
        <main>
        </main>
      <Footer></Footer>    
      </>
=======
import { BrowserRouter } from "react-router-dom";
import { Waves } from "./components/waves";
import { Main } from "./components/Main";

function App() {
  return (
      <BrowserRouter>
        <Waves/>
        <Header></Header>
        <Main/>
        <Footer></Footer>    
      </BrowserRouter>
>>>>>>> 1aefb28 (Migración de componentes sin node_modules)
  );
}

export default App;
