import { Grid, Box } from "@mui/material";
import React from "react";
import { DataGrid } from '@mui/x-data-grid';

export default function ListaPacientes(){
    const columns = [
        {
          field: 'nome',
          headerName: 'Nome',
          width: 150,
          editable: true,
        },
        {
          field: 'gender',
          headerName: 'Genero',
          width: 100,
          editable: true,
        },
        {
          field: 'idade',
          headerName: 'Idade',
          type: 'number',
          width: 100,
          editable: true,
        },
        {
          field: 'weight',
          headerName: 'Peso',
          type: 'string',
          width: 100,
          editable: true,
          valueGetter: (value, row) => `${row.weight || ''} ${'Kg'}`,
        },
        {
          field: 'heigth',
          headerName: 'Altura',
          width: 110,
          editable: true,
          valueGetter: (value, row) => `${row.height.toLocaleString() || ''} ${'m'}`,
        },
      ];
      const rows = [
        { id: 1, gender: 'M', weight:60 , height:1.61,nome: 'Renato Russo', idade: 14 },
        { id: 2, gender: 'M',weight:50, height:1.72, nome: 'Andre Ribeiro', idade: 31 },
        { id: 3, gender: 'F',weight:70, height:1.51, nome: 'Luisa Carreiro', idade: 31 },
        { id: 4, gender: 'M',weight:65, height:1.73, nome: 'Victor Moura', idade: 11 },
        { id: 5, gender: 'M',weight:59, height:1.71, nome: 'Neymar Junior', idade: 32 },
        { id: 6, gender: 'M',weight:81, height:1.79, nome: "Alejandro Garnacho", idade: 45 },
        { id: 7, gender: 'M',weight:68, height:1.88, nome: 'Carlos Alberto', idade: 44 },
        { id: 8, gender: 'M',weight:72, height:1.70, nome: 'Pedro Lima', idade: 36 },
        { id: 9, gender: 'M',weight:61, height:1.69, nome: 'Leandro Pereira', idade: 65 },
        { id: 10, gender: 'F',weight:61, height:1.69, nome: 'Julia Roberts', idade: 65 },
        { id: 11, gender: 'F',weight:61, height:1.69, nome: 'Emily Santos', idade: 65 },
        
      ];
            
    
    return(
        <Box sx={{ maxHeight: '70vh', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={console.log('aaa')}
      />      
    </Box>
    )
}