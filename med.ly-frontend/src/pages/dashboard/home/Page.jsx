import React, { useState, useEffect } from "react";
import { 
  Grid, 
  Typography, 
  Paper, 
  Box, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Chip,
  Card,
  CardContent,
  Alert,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Menu,
  MenuItem,
  TablePagination,
  FormControl,
  Select,
  InputLabel
} from "@mui/material";
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

// Dados do médico logado
const medicoLogado = {
  id: 1,
  nome: "Dr. Ana Souza",
  especialidade: "Cardiologia"
};

// Mock de agendamentos para o médico logado
const mockAgendamentos = [
  { 
    id: 1, 
    paciente: "Maria Silva", 
    tipo: "Consulta", 
    especialidade: "Cardiologia", 
    medico: medicoLogado.nome,
    data: "2025-06-02", 
    horario: "20:00", 
    status: "confirmado",
    lido: false,
    observacoes: "Paciente relata dor no peito e falta de ar."
  },
  { 
    id: 2, 
    paciente: "Carlos Oliveira", 
    tipo: "Consulta", 
    especialidade: "Cardiologia", 
    medico: medicoLogado.nome,
    data: "2025-06-02", 
    horario: "21:00", 
    status: "confirmado",
    lido: false,
    observacoes: "Retorno para avaliação de exames."
  },
  { 
    id: 3, 
    paciente: "Fernanda Santos", 
    tipo: "Consulta", 
    especialidade: "Cardiologia", 
    medico: medicoLogado.nome,
    data: "2025-06-03", 
    horario: "22:00", 
    status: "confirmado",
    lido: true,
    observacoes: "Paciente com histórico de hipertensão."
  },
  { 
    id: 4, 
    paciente: "Roberto Pereira", 
    tipo: "Consulta", 
    especialidade: "Cardiologia", 
    medico: medicoLogado.nome,
    data: "2025-06-04", 
    horario: "09:00", 
    status: "confirmado",
    lido: true,
    observacoes: "Avaliação pós-cirúrgica."
  },
  { 
    id: 5, 
    paciente: "Juliana Lima", 
    tipo: "Consulta", 
    especialidade: "Cardiologia", 
    medico: medicoLogado.nome,
    data: "2025-06-04", 
    horario: "10:30", 
    status: "confirmado",
    lido: true,
    observacoes: "Primeira consulta. Paciente encaminhada pelo clínico geral."
  },
  { 
    id: 6, 
    paciente: "Gabriel Martins", 
    tipo: "Consulta", 
    especialidade: "Cardiologia", 
    medico: medicoLogado.nome,
    data: "2025-06-05", 
    horario: "09:15", 
    status: "confirmado",
    lido: true,
    observacoes: "Acompanhamento de arritmia cardíaca."
  },
  { 
    id: 7, 
    paciente: "Carolina Vieira", 
    tipo: "Consulta", 
    especialidade: "Cardiologia", 
    medico: medicoLogado.nome,
    data: "2025-06-05", 
    horario: "11:00", 
    status: "confirmado",
    lido: true,
    observacoes: "Paciente com histórico familiar de problemas cardíacos."
  },
  { 
    id: 8, 
    paciente: "Lucas Mendonça", 
    tipo: "Consulta", 
    especialidade: "Cardiologia", 
    medico: medicoLogado.nome,
    data: "2025-06-06", 
    horario: "14:00", 
    status: "confirmado",
    lido: true,
    observacoes: "Check-up anual."
  }
];

export default function Home() {
  const [agendamentos, setAgendamentos] = useState(mockAgendamentos);
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [currentAgendamentoId, setCurrentAgendamentoId] = useState(null);
  
  // Estados para paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  // Contagem de notificações não lidas
  useEffect(() => {
    const count = agendamentos.filter(agendamento => !agendamento.lido).length;
    setNotificacoesNaoLidas(count);
  }, [agendamentos]);

  // Função para marcar notificação como lida
  const marcarComoLida = (id) => {
    setAgendamentos(prev => 
      prev.map(agendamento =>
        agendamento.id === id ? {...agendamento, lido: true} : agendamento
      )
    );
  };

  // Função para marcar todas as notificações como lidas
  const marcarTodasComoLidas = () => {
    setAgendamentos(prev => 
      prev.map(agendamento => ({...agendamento, lido: true}))
    );
  };

  // Organizar agendamentos por data
  const agendamentosOrdenados = [...agendamentos].sort((a, b) => {
    const dataA = new Date(`${a.data}T${a.horario}`);
    const dataB = new Date(`${b.data}T${b.horario}`);
    return dataA - dataB;
  });

  // Separar agendamentos para hoje e futuros
  const hoje = new Date().toISOString().split('T')[0];
  const agendamentosAtuaisEFuturos = agendamentosOrdenados.filter(a => a.data >= hoje);

  // Preparar os agendamentos paginados
  const agendamentosPaginados = agendamentosAtuaisEFuturos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Funções para o menu de opções de agendamento
  const handleMenuOpen = (event, agendamentoId) => {
    setMenuAnchorEl(event.currentTarget);
    setCurrentAgendamentoId(agendamentoId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setCurrentAgendamentoId(null);
  };

  // Função para abrir o diálogo de detalhes
  const handleOpenDetails = () => {
    const agendamento = agendamentos.find(a => a.id === currentAgendamentoId);
    setSelectedAgendamento(agendamento);
    setDialogOpen(true);
    handleMenuClose();
  };

  // Funções para o diálogo
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAgendamento(null);
  };

  // Formatar data para exibição
  const formatarData = (dataString) => {
    const [year, month, day] = dataString.split('-');
    const data = new Date(year, month - 1, day);
    return data.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Handlers para paginação
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

  return (
    <Grid container 
      sx={{ 
        display:{xs:'block', md:'grid'},
        p:3,
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)'}
      }}
      spacing={3}
    >
      {/* Cabeçalho */}
      <Grid item xs={12}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: "#f8f9fa" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Olá, {medicoLogado.nome}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {medicoLogado.especialidade} - Aqui estão seus agendamentos e notificações
              </Typography>
            </Box>
            <Badge badgeContent={notificacoesNaoLidas} color="error">
              <NotificationsIcon color="action" fontSize="large" />
            </Badge>
          </Box>
        </Paper>
      </Grid>

      {/* Resumo */}
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', boxShadow: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <EventIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                Hoje
              </Typography>
            </Box>
            <Typography variant="h3" color="primary" fontWeight="bold">
              {agendamentosOrdenados.filter(a => a.data === hoje).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              consultas para hoje
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', boxShadow: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <PersonIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                Total Semanal
              </Typography>
            </Box>
            <Typography variant="h3" color="success" fontWeight="bold">
              {agendamentos.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              consultas nos próximos 7 dias
            </Typography>
          </CardContent>
        </Card>
      </Grid>


      {/* Notificações de Agendamentos */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight="bold">
              Notificações de Agendamentos
            </Typography>
            {notificacoesNaoLidas > 0 && (
              <Button 
                variant="outlined" 
                color="primary" 
                size="small"
                onClick={marcarTodasComoLidas}
              >
                Marcar todas como lidas
              </Button>
            )}
          </Box>

          {notificacoesNaoLidas > 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Você tem {notificacoesNaoLidas} notificações não lidas
            </Alert>
          )}

          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {agendamentos.filter(a => !a.lido).length > 0 ? (
              agendamentos.filter(a => !a.lido).map((agendamento) => (
                <React.Fragment key={agendamento.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" onClick={() => marcarComoLida(agendamento.id)}>
                        <CheckCircleIcon color="success" />
                      </IconButton>
                    }
                    sx={{ 
                      bgcolor: !agendamento.lido ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Nova consulta: {agendamento.paciente}
                          </Typography>
                          <Chip 
                            label="Novo" 
                            color="primary" 
                            size="small" 
                            sx={{ display: agendamento.lido ? 'none' : 'inline-flex' }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {agendamento.especialidade}
                          </Typography>
                          <Typography variant="body2">
                            {(() => {
                              const [year, month, day] = agendamento.data.split('-');
                              const formattedDate = new Date(year, month - 1, day);
                              return formattedDate.toLocaleDateString('pt-BR');
                            })()} às {agendamento.horario}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                Não há notificações não lidas.
              </Typography>
            )}
          </List>
        </Paper>
      </Grid>

      {/* Agenda de Consultas */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight="bold">
              Agenda de Consultas
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
                        bgcolor: isAgendamentoHoje(agendamento.data) ? 'rgba(25, 118, 210, 0.05)' : 'transparent',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: isAgendamentoHoje(agendamento.data) ? 'primary.main' : 'default' }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            {agendamento.paciente}
                            {isAgendamentoHoje(agendamento.data) && (
                              <Chip 
                                label="Hoje" 
                                color="primary" 
                                size="small"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              Consulta em {agendamento.especialidade}
                            </Typography>
                            <Typography variant="body2">
                              {(() => {
                                const [year, month, day] = agendamento.data.split('-');
                                const formattedDate = new Date(year, month - 1, day);
                                return isAgendamentoHoje(agendamento.data) 
                                  ? `Hoje às ${agendamento.horario}`
                                  : `${formattedDate.toLocaleDateString('pt-BR')} às ${agendamento.horario}`;
                              })()}
                            </Typography>
                          </>
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
              Não há consultas agendadas para os próximos dias.
            </Alert>
          )}
        </Paper>
      </Grid>

      {/* Menu de Opções para Agendamentos */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenDetails}>Detalhes</MenuItem>
        <MenuItem onClick={handleMenuClose}>Registrar atendimento</MenuItem>
        <MenuItem onClick={handleMenuClose}>Remarcar consulta</MenuItem>
        <MenuItem onClick={handleMenuClose}>Cancelar consulta</MenuItem>
      </Menu>

      {/* Diálogo de Detalhes */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedAgendamento && (
          <>
            <DialogTitle sx={{ bgcolor: 'primary.light', py: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Detalhes do Paciente
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {selectedAgendamento.paciente}
                </Typography>
                <Chip 
                  label={selectedAgendamento.status} 
                  color={selectedAgendamento.status === 'confirmado' ? 'success' : 'warning'} 
                  size="small" 
                  sx={{ mb: 2 }}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MedicalServicesIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Especialidade:</strong> {selectedAgendamento.especialidade}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocalHospitalIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Médico:</strong> {selectedAgendamento.medico}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Data:</strong> {(() => {
                        const [year, month, day] = selectedAgendamento.data.split('-');
                        const data = new Date(year, month - 1, day);
                        return data.toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        });
                      })()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Horário:</strong> {selectedAgendamento.horario}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Observações clínicas:
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                  <Typography variant="body2">
                    {selectedAgendamento.observacoes || "Sem observações registradas."}
                  </Typography>
                </Paper>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Fechar</Button>
              <Button variant="contained" color="primary">
                Iniciar Atendimento
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Grid>
  );
}