import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'
import Home from './pages/Home';
import Pagina404 from "./pages/Pagina404";

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Pagina404 />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
