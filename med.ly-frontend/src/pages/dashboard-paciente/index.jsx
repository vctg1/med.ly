import { Routes, Route } from "react-router";
import Header from "../../components/dashboard-paciente/Header";
import Pagina404 from "../../components/dashboard-paciente/Pagina404";
import HomePage from "./home/Page";
import AgendamentosPage from "./agendamentos/Page";
import { Box } from "@mui/material";
import { useAuth } from "../../services/authContext";
import { CircularProgress, Alert } from "@mui/material";

export default function DashboardPaciente() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Alert severity="warning" sx={{ m: 3 }}>
        Você precisa estar logado para acessar esta área.
      </Alert>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header />
      <Box sx={{ pt: 2 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/agendamentos" element={<AgendamentosPage />} />
          <Route path="/perfil" element={<HomePage />} />
          <Route path="*" element={<Pagina404 />} />
        </Routes>
      </Box>
    </Box>
  );
}