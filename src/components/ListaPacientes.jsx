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
          field: 'nomeCompleto',
          headerName: 'Nome Completo',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 160,
          valueGetter: (value, row) => `${row.nome || ''} ${row.sobrenome || ''}`,
        },
      ];
      const rows = [
        { id: 1, sobrenome: 'Russo', nome: 'Renato', idade: 14 },
        { id: 2, sobrenome: 'Ribeiro', nome: 'Andre', idade: 31 },
        { id: 3, sobrenome: 'Carreiro', nome: 'Luisa', idade: 31 },
        { id: 4, sobrenome: 'Moura', nome: 'Victor', idade: 11 },
        { id: 5, sobrenome: 'Junior', nome: 'Neymar', idade: null },
        { id: 6, sobrenome: 'Garnacho', nome: "Alejandro", idade: 45 },
        { id: 7, sobrenome: 'Alberto', nome: 'Carlos', idade: 44 },
        { id: 8, sobrenome: 'Lima', nome: 'Pedro', idade: 36 },
        { id: 9, sobrenome: 'Pereira', nome: 'Leandro', idade: 65 },
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