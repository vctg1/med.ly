import { Routes, Route, BrowserRouter } from "react-router";
import Dashboard from "./dashboard";
import DashboardPaciente from "./dashboard-paciente";
import Site from "./site";

export default function Pages() {
    return (
        <Routes>
            {/* Rotas do Site */}
            <Route path="/*" element={<Site />} />
            
            {/* Rotas do Dashboard do Médico */}
            <Route path="/dashboard*" element={<Dashboard />} />
            
            {/* Rotas do Dashboard do Paciente */}
            <Route path="/dashboard-paciente*" element={<DashboardPaciente />} />
            {/* Rota 404 */}
            <Route path="*" element={<div>404 - Página não encontrada</div>} />
        </Routes>
    )
}