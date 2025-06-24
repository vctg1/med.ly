import React, { useState, useEffect } from "react";
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  List, 
  ListItemText, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  IconButton, 
  Divider, 
  Chip, 
  Alert, 
  TablePagination, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

import { useAuth } from '../../../services/authContext';
import { getAppointments } from '../../../../api/appointments';

export default function AgendamentosPage() {
  const { isAuthenticated } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Carregar agendamentos do paciente
  useEffect(() => {
    const loadAppointments = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const appointments = await getAppointments();
        setAgendamentos(appointments);
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
        setError('Erro ao carregar agendamentos. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [isAuthenticated]);

  const hoje = new Date().toISOString().split('T')[0];
  
  // Filtrar agendamentos atuais e futuros
  const agendamentosAtuaisEFuturos = agendamentos.filter(agendamento => 
    agendamento.date >= hoje
  );

  const agendamentosPaginados = agendamentosAtuaisEFuturos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleMenuOpen = (event, agendamentoId) => {
    // Implementar menu de opções
    console.log('Menu opened for appointment:', agendamentoId);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Verificar se o agendamento é para hoje
  const isAgendamentoHoje = (data) => {
    return data === hoje;
  };

  // Formatação de data e hora
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Adiciona um dia para corrigir o offset
    return date.toLocaleDateString('pt-BR');
  };
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!isAuthenticated) {
    return (
      <Alert severity="warning" sx={{ m: 3 }}>
        Você precisa estar logado para ver esta página.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 2, backgroundColor: '#fff', borderRadius: 1, boxShadow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Meus Agendamentos
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Gerencie todos os seus agendamentos de consultas e exames
      </Typography>

      {/* Meus Agendamentos */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight="bold">
              Agendamentos Futuros
            </Typography>
            
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="rows-per-page-label">Mostrar</InputLabel>
              <Select
                labelId="rows-per-page-label"
                id="rows-per-page"
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                label="Mostrar"
              >
                <MenuItem value={3}>3 por página</MenuItem>
                <MenuItem value={5}>5 por página</MenuItem>
                <MenuItem value={10}>10 por página</MenuItem>
                <MenuItem value={25}>25 por página</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          {agendamentosAtuaisEFuturos.length > 0 ? (
            <>
              <List>
                {agendamentosPaginados.map((agendamento) => (
                  <React.Fragment key={agendamento.id}>
                    <ListItem
                      secondaryAction={
                        <IconButton 
                          edge="end"
                          onClick={(e) => handleMenuOpen(e, agendamento.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      }
                      sx={{ 
                        bgcolor: isAgendamentoHoje(agendamento.date) ? 'rgba(25, 118, 210, 0.05)' : 'transparent',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: isAgendamentoHoje(agendamento.date) ? 'primary.main' : 'primary.light'
                        }}>
                          <MedicalServicesIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography component="span" variant="subtitle1" fontWeight="bold">
                              {agendamento.exam_name}
                            </Typography>
                            {isAgendamentoHoje(agendamento.date) && (
                              <Chip 
                                label="Hoje" 
                                color="primary" 
                                size="small"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box component="div">
                            <Typography component="span" variant="body2" color="text.primary">
                              Com {agendamento.doctor_name}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2">
                              {isAgendamentoHoje(agendamento.date) 
                                ? `Hoje às ${agendamento.start_time.toLocaleString()}`
                                : `${formatDate(agendamento.date)} às ${agendamento.start_time.toLocaleString()}`}
                            </Typography>
                          </Box>
                        }
                      />
                      <Chip 
                        label={agendamento.status} 
                        color={agendamento.status === 'confirmado' ? 'success' : 'warning'} 
                        size="small" 
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
              
              {/* Paginação */}
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <TablePagination
                  component="div"
                  count={agendamentosAtuaisEFuturos.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[]}
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                />
              </Box>
            </>
          ) : (
            <Alert severity="info">
              Você não possui agendamentos para os próximos dias.
            </Alert>
          )}
        </Paper>
      </Grid>
    </Box>
  );
}