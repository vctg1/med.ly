import Home from "./home/Page";
import Pagina404 from "../../components/dashboard/Pagina404";
import { BrowserRouter, Routes, Route } from "react-router";
import Header from "../../components/site/Header";
import Footer from "../../components/site/Footer";
import { Grid } from "@mui/material";
import Login from "./login/Page";
import Register from "./register/Page";
import Consulta from "./consulta/Page";
import ExamesPage from "./exames/Page";

export default function Site() {
    return (
        <BrowserRouter basename="/">
            <Header />
            <Grid minHeight={'100vh'} marginTop={'8rem'} >
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/consulta" element={<Consulta/>}/ >
                        <Route path="/exame" element={<ExamesPage/>}/ >

                    </Routes>
            </Grid>
            <Footer/>
        </BrowserRouter>
    )
}