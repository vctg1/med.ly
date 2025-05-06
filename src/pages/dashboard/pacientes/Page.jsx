import React from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ListaPacientes from "./ListaPacientes";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Pacientes(){
    return(
        <Grid>
            <Box display={'flex'} justifyContent={'end'} gap='1rem' marginBottom={'1rem'}>
            <Button color="success" variant="outlined" size="small"><AddIcon/>Novo paciente</Button>
            <Button color="info" variant="outlined" size="small"><SaveIcon/>Salvar alterações</Button>
            <Button color="error" variant="outlined" size="small"><DeleteIcon/>Excluir</Button>
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