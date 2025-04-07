import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'
import Home from './pages/Home';
import Pagina404 from "./pages/Pagina404";
import Pacientes from "./pages/Pacientes";
import Header from "./components/Header";

function App() {

  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Pagina404 />} />
      <Route path="/pacientes" element={<Pacientes />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
