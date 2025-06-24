import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  InputAdornment,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import ListaPacientes from './ListaPacientes';

export default function PacientesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box mb={3}>
        <Box display="flex" alignItems="center" mb={2}>
          <PeopleIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Meus Pacientes
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Gerencie e visualize o histórico dos seus pacientes
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        {/* Campo de Pesquisa */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Pesquisar paciente por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" height="100%">
              <Typography variant="body2" color="text.secondary">
                {searchTerm ? `Pesquisando por: "${searchTerm}"` : 'Digite o nome do paciente para filtrar'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Lista de Pacientes */}
        <ListaPacientes searchTerm={searchTerm} />
      </Paper>
    </Container>
  );
}