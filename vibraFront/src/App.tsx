import Header from "./components/header";
import { Footer } from "./components/footer";
import { BrowserRouter } from "react-router-dom";
import { Main } from "./components/main";
import { Waves } from "./components/waves";

function App() {
  return (
      <BrowserRouter>
        <Waves/>
        <Header></Header>
        <Main/>
        <Footer></Footer>    
      </BrowserRouter>
  );
}

export default App;
