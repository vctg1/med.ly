import { Grid } from "@mui/material";
import React from "react";

export default function Footer() {
    const localUrl = window.location.href;
    const isDashboardPage = localUrl.includes('/dashboard');
    if (isDashboardPage) {
        return null; // Do not render the header if on the dashboard page
    }
    return (
        <footer style={{ backgroundColor: '#f8f9fa', textAlign: 'center' }}>
            <p>&copy; {new Date().getFullYear()} Med.ly. Todos os direitos reservados.</p>
            <p>Desenvolvido por Victor Moura</p>
            <Grid id={'contato'} item xs={12} sm={4}>
                <h3>Contato</h3>
                <p>Email: <a href="mailto:teste@gmail.com">teste@gmail.com</a>
                </p>
                <p>Telefone:
                    <a href="tel:+5561999999999">+55 61 99999-9999</a>
                </p>
                <p>Endereço: <a href="https://maps.app.goo.gl/GUZBg9nBxYXk59T46">SEPN 707/907 - Asa Norte, Brasília - DF, 70790-075</a>
                </p>
                <p>Horário de Atendimento: Segunda a Sexta, das 9h às 18h</p>
            </Grid>
        </footer>
    );
}