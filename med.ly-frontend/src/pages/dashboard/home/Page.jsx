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
  InputLabel,
  CircularProgress
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
import EmailIcon from '@mui/icons-material/Email';

import { useAuth } from '../../../services/authContext';
import { getMeDoctor } from '../../../../api/doctors';
import { getAppointments } from '../../../../api/appointments';

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [doctorData, setDoctorData] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState([]);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [currentAgendamentoId, setCurrentAgendamentoId] = useState(null);
  
  // Estados para paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  // Chaves para localStorage
  const STORAGE_KEY = `unread_notifications_doctor_${user?.id || 'default'}`;

  // Carregar notificações do localStorage
  const loadNotificationsFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao carregar notificações do localStorage:', error);
      return [];
    }
  };

  // Salvar notificações no localStorage
  const saveNotificationsToStorage = (notifications) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Erro ao salvar notificações no localStorage:', error);
    }
  };

  // Carregar dados do médico e agendamentos
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Carregar dados do médico
        const doctorInfo = await getMeDoctor();
        setDoctorData(doctorInfo);

        // Carregar agendamentos do médico
        const appointments = await getAppointments();
        setAgendamentos(appointments);

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setError('Erro ao carregar informações. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  // Gerenciar notificações não lidas
  useEffect(() => {
    if (agendamentos.length === 0) return;

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    // Buscar agendamentos recentes (potenciais notificações)
    const recentAppointments = agendamentos.filter(agendamento => {
      const createdAt = new Date(agendamento.created_at);
      return createdAt > oneDayAgo;
    });

    // Carregar notificações já armazenadas
    const storedNotifications = loadNotificationsFromStorage();
    
    // Criar lista de notificações atuais
    const currentNotifications = recentAppointments.map(agendamento => ({
      id: agendamento.id,
      appointmentId: agendamento.id,
      patient_name: agendamento.patient_name,
      exam_name: agendamento.exam_name,
      date: agendamento.date,
      start_time: agendamento.start_time,
      created_at: agendamento.created_at,
      isRead: false
    }));

    // Filtrar apenas notificações que não foram lidas
    const unreadNotifications = currentNotifications.filter(notification => {
      const wasRead = storedNotifications.some(stored => 
        stored.appointmentId === notification.appointmentId && stored.isRead
      );
      return !wasRead;
    });

    // Atualizar estado e localStorage
    setNotificacoesNaoLidas(unreadNotifications);
    
    // Atualizar localStorage com notificações atuais (preservando status de lida)
    const updatedStoredNotifications = currentNotifications.map(notification => {
      const existingNotification = storedNotifications.find(stored => 
        stored.appointmentId === notification.appointmentId
      );
      return existingNotification || notification;
    });
    
    saveNotificationsToStorage(updatedStoredNotifications);
  }, [agendamentos, STORAGE_KEY]);

  // Função para marcar notificação como lida
  const marcarComoLida = (appointmentId) => {
    // Atualizar localStorage
    const storedNotifications = loadNotificationsFromStorage();
    const updatedNotifications = storedNotifications.map(notification => 
      notification.appointmentId === appointmentId 
        ? { ...notification, isRead: true }
        : notification
    );
    saveNotificationsToStorage(updatedNotifications);

    // Remover da lista de não lidas
    setNotificacoesNaoLidas(prev => 
      prev.filter(notification => notification.appointmentId !== appointmentId)
    );
  };

  // Função para marcar todas as notificações como lidas
  const marcarTodasComoLidas = () => {
    // Atualizar localStorage
    const storedNotifications = loadNotificationsFromStorage();
    const updatedNotifications = storedNotifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    saveNotificationsToStorage(updatedNotifications);

    // Limpar lista de não lidas
    setNotificacoesNaoLidas([]);
  };

  // Organizar agendamentos por data
  const agendamentosOrdenados = [...agendamentos].sort((a, b) => {
    const dataA = new Date(a.date);
    const dataB = new Date(b.date);
    return dataA - dataB;
  });

  // Separar agendamentos para hoje e futuros
  const hoje = new Date().toISOString().split('T')[0];
  const agendamentosAtuaisEFuturos = agendamentosOrdenados.filter(a => a.date >= hoje);

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

  // Formatação de data e hora
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Adiciona um dia para corrigir o offset
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString) => {
    const time = timeString.slice(0, 5); // Pega apenas a parte de hora:minuto
    if (timeString.length ===4) {
      return `0${time}`; // Adiciona zero à esquerda se necessário
    }
    return time
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

  if (!isAuthenticated || !doctorData) {
    return (
      <Alert severity="warning" sx={{ m: 3 }}>
        Você precisa estar logado para ver esta página.
      </Alert>
    );
  }

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
                Olá, {doctorData.full_name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {doctorData.specialty} - CRM: {doctorData.crm_number}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {doctorData.city}, {doctorData.state} - {doctorData.email}
              </Typography>
            </Box>
            <Badge badgeContent={notificacoesNaoLidas.length} color="error">
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
              {agendamentosOrdenados.filter(a => a.date === hoje).length}
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
              {agendamentosAtuaisEFuturos.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              consultas nos próximos 7 dias
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', boxShadow: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <AssignmentIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                Score Atual
              </Typography>
            </Box>
            <Typography variant="h3" color="warning" fontWeight="bold">
              {doctorData.current_score || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              pontos na plataforma
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
          </Box>
          {notificacoesNaoLidas.length > 0 && (
            <>
              <Alert severity="info" sx={{ mb: 2 }}>
                Você tem {notificacoesNaoLidas.length} notificações não lidas
              </Alert>
              <Button 
                variant="outlined" 
                color="primary" 
                size="small"
                onClick={marcarTodasComoLidas}
              >
                Marcar todas como lidas
              </Button>
            </>
          )}

          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {notificacoesNaoLidas.length > 0 ? (
              notificacoesNaoLidas.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" onClick={() => marcarComoLida(notification.appointmentId)}>
                        <CheckCircleIcon color="success" />
                      </IconButton>
                    }
                    sx={{ 
                      bgcolor: 'rgba(25, 118, 210, 0.08)',
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
                            Nova consulta: {notification.patient_name}
                          </Typography>
                          <Chip 
                            label="Novo" 
                            color="primary" 
                            size="small" 
                          />
                        </Box>
                      }
                      secondary={
                        <Box component="div">
                          <Typography component="span" variant="body2" color="text.primary">
                            {notification.exam_name}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            {formatDate(notification.date)} às {formatTime(notification.start_time)}
                          </Typography>
                        </Box>
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
                        bgcolor: isAgendamentoHoje(agendamento.date) ? 'rgba(25, 118, 210, 0.05)' : 'transparent',
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: isAgendamentoHoje(agendamento.date) ? 'primary.main' : 'default' }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography component="span" variant="subtitle1" fontWeight="bold">
                              {agendamento.patient_name}
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
                              {agendamento.exam_name}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2">
                              {isAgendamentoHoje(agendamento.date) 
                                ? `Hoje às ${formatTime(agendamento.start_time)}`
                                : `${formatDate(agendamento.date)} às ${formatTime(agendamento.start_time)}`}
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
                  {selectedAgendamento.patient_name}
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
                      <strong>Exame/Consulta:</strong> {selectedAgendamento.exam_name}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocalHospitalIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Médico:</strong> {selectedAgendamento.doctor_name}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Data:</strong> {formatDate(selectedAgendamento.date)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Horário:</strong> {formatTime(selectedAgendamento.start_time)} às {formatTime(selectedAgendamento.end_time)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {selectedAgendamento.notes && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Observações clínicas:
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="body2">
                      {selectedAgendamento.notes}
                    </Typography>
                  </Paper>
                </Box>
              )}
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