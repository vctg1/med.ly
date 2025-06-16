import Home from "./home/Page";
import Pagina404 from "../../components/dashboard/Pagina404";
import { BrowserRouter, Routes, Route } from "react-router";
import Header from "../../components/site/Header";
import Footer from "../../components/site/Footer";
import { Grid } from "@mui/material";
import Login from "./login/Page";
import Register from "./register/Page";
import RegisterPaciente from "./register-paciente/Page";
import Consulta from "./consulta/Page";
import ExamesPage from "./exames/Page";
import AgendarPage from "./agendar/Page";

export default function Site() {
    return (
        <BrowserRouter basename="/">
            <Header />
            <Grid minHeight={'100vh'} marginTop={'6rem'} >
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path='/register-paciente' element={<RegisterPaciente />} />
                    <Route path="/consulta" element={<Consulta />} />
                    <Route path="/exame" element={<ExamesPage />} />
                    <Route path="/agendar" element={<AgendarPage />} />
                </Routes>
            </Grid>
            <Footer />
        </BrowserRouter>
    )
}