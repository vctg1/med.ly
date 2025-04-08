import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'
import Home from './pages/Home';
import Pagina404 from "./pages/Pagina404";
import Pacientes from "./pages/Pacientes";
import Header from "./components/Header";
import Agenda from "./pages/Agenda";

function App() {

  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/agenda" element={<Agenda />} />
      <Route path="/pacientes" element={<Pacientes />} />
      <Route path="*" element={<Pagina404 />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
