import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router';

export default function Pagina404() {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
      textAlign="center"
    >
      <Typography variant="h1" color="primary" fontWeight="bold">
        404
      </Typography>
      <Typography variant="h4" gutterBottom>
        Página não encontrada
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        A página que você está procurando não existe.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/dashboard-paciente')}
      >
        Voltar ao Dashboard
      </Button>
    </Box>
  );
}