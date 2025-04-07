import { Grid, Box } from "@mui/material";
import React from "react";
import { DataGrid } from '@mui/x-data-grid';
/* "date_of_birth": "2025-04-07",
    "gender": "string",
    "weight": 0,
    "height": 0,
    "id": 0 */
export default function ListaPacientes(){
    const columns = [
        {
          field: 'nome',
          headerName: 'Nome',
          width: 150,
          editable: true,
        },
        {
          field: 'sobrenome',
          headerName: 'Sobrenome',
          width: 150,
          editable: true,
        },
        {
          field: 'idade',
          headerName: 'Idade',
          type: 'number',
          width: 110,
          editable: true,
        },
        {
          field: 'weight',
          headerName: 'Peso',
          type: 'string',
          width: 110,
          editable: true,
          valueGetter: (value, row) => `${row.weight || ''} ${'Kg'}`,
        },
        {
          field: 'heigth',
          headerName: 'Altura',
          width: 110,
          editable: true,
          valueGetter: (value, row) => `${row.height || ''} ${'metros'}`,
        },
      ];
      const rows = [
        { id: 1, gender: 'Russo', weight:60 , height:1.61,nome: 'Renato', idade: 14 },
        { id: 2, gender: 'Ribeiro',weight:50, height:1.72, nome: 'Andre', idade: 31 },
        { id: 3, gender: 'Carreiro',weight:70, height:1.51, nome: 'Luisa', idade: 31 },
        { id: 4, gender: 'Moura',weight:65, height:1.73, nome: 'Victor', idade: 11 },
        { id: 5, gender: 'Junior',weight:59, height:1.71, nome: 'Neymar', idade: 32 },
        { id: 6, gender: 'Garnacho',weight:81, height:1.79, nome: "Alejandro", idade: 45 },
        { id: 7, gender: 'Alberto',weight:68, height:1.88, nome: 'Carlos', idade: 44 },
        { id: 8, gender: 'Lima',weight:72, height:1.70, nome: 'Pedro', idade: 36 },
        { id: 9, gender: 'Pereira',weight:61, height:1.69, nome: 'Leandro', idade: 65 },
      ];
            
    
    return(
        <Box sx={{ maxHeight: '65vh', width: '100%' }}>
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
      />
    </Box>
    )
}