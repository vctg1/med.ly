import { Box, Button, ButtonGroup, Grid, TextField } from "@mui/material";
import React from "react";
import SearchIcon from '@mui/icons-material/Search';
import ListaPacientes from "../components/ListaPacientes";
import AddIcon from '@mui/icons-material/Add';

export default function Pacientes(){
    return(
        <Grid>
            <Box display={'flex'} justifyContent={'end'} gap='1rem' marginBottom={'1rem'}>
            <Button color="success" variant="outlined" size="small"><AddIcon/>Novo paciente</Button>
            <Box display={"flex"}>
                <TextField label="Buscar" size="small"/>
                <Button variant="text" size="small">
                    <SearchIcon color="info" fontSize="large" />
                </Button>
            </Box>
            </Box>
            <ListaPacientes/>
        </Grid>
    )
}