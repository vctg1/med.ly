import { Routes, Route } from "react-router";
import Pagina404 from "../../components/dashboard/Pagina404";
import Home from "./home/Page";
import Agenda from "./agenda/Page";
import Pacientes from "./pacientes/Page";
import Header from "../../components/dashboard/Header";
import { Box } from "@mui/material";

export default function Dashboard() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header />
      <Box sx={{ pt: 2 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="*" element={<Pagina404 />} />
        </Routes>
      </Box>
    </Box>
  )
}