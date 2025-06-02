import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Pagina404 from "../../components/dashboard/Pagina404";
import Home from "./home/Page";
import Agenda from "./agenda/Page";
import Pacientes from "./pacientes/Page";
import Header from "../../components/dashboard/Header";
import { Grid } from "@mui/material";

export default function Dashboard() {
  return (
    <BrowserRouter basename="/dashboard">
    <Header/>
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="*" element={<Pagina404 />} />
      </Routes>
  </BrowserRouter>
  )
}