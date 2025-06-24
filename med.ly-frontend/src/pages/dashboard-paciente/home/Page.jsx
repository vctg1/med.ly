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
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';

import { useAuth } from '../../../services/authContext';
import { getMe } from '../../../../api/patients';
import { getAppointments } from '../../../../api/appointments';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const [patientData, setPatientData] = useState(null);
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
  const STORAGE_KEY = `unread_notifications_patient_${user?.id || 'default'}`;

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

  // Carregar dados do paciente e agendamentos
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Carregar dados do paciente
        const patientInfo = await getMe();
        setPatientData(patientInfo);

        // Carregar agendamentos do paciente
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
      exam_name: agendamento.exam_name,
      doctor_name: agendamento.doctor_name,
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

  // Calcular idade do paciente
  const calcularIdade = (dataNascimento) => {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  // Formatação de data e hora
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Adiciona um dia para corrigir o offset
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString) => {
    // remove seconds if present
    const time = timeString.slice(0, 5);
    // format to HH:mm
    if (time.length === 4) {
      return `0${time}`; // pad with zero if needed
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

  if (!isAuthenticated || !patientData) {
    return (
      <Alert severity="warning" sx={{ m: 3 }}>
        Você precisa estar logado para ver esta página.
      </Alert>
    );
  }

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      {/* Cabeçalho */}
      <Grid item xs={12}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: "#f8f9fa" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Olá, {patientData.full_name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Aqui estão seus agendamentos e informações de saúde
              </Typography>
            </Box>
            <Badge badgeContent={notificacoesNaoLidas.length} color="error">
              <NotificationsIcon color="action" fontSize="large" />
            </Badge>
          </Box>
        </Paper>
      </Grid>

      {/* Informações Pessoais */}
      <Grid item xs={12} md={6}>
        <Card sx={{ minHeight:"12.5rem", minWidth:"10rem", boxShadow: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <PersonIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                Meus Dados
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <EmailIcon color="action" fontSize="small" />
                <Typography variant="body2">{patientData.email}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <PhoneIcon color="action" fontSize="small" />
                <Typography variant="body2">{patientData.phone}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <CakeIcon color="action" fontSize="small" />
                <Typography variant="body2">
                  {formatDate(patientData.date_of_birth)} 
                  ({calcularIdade(patientData.date_of_birth)} anos)
                </Typography>
              </Box>
              {patientData.health_insurance_name && (
                <Box display="flex" alignItems="center" gap={1}>
                  <LocalHospitalIcon color="action" fontSize="small" />
                  <Typography variant="body2">
                    {patientData.health_insurance_name} - {patientData.health_insurance_number}
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Resumo de Agendamentos */}
      <Grid item xs={12} md={3}>
        <Card sx={{ minHeight:"12.5rem", minWidth:"10rem", boxShadow: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <EventIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                Próximos
              </Typography>
            </Box>
            <Typography variant="h3" color="primary" fontWeight="bold">
              {agendamentosAtuaisEFuturos.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              agendamentos
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card sx={{ minHeight:"12.5rem", minWidth:"10rem", boxShadow: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <CalendarTodayIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                Hoje
              </Typography>
            </Box>
            <Typography variant="h3" color="success" fontWeight="bold">
              {agendamentosOrdenados.filter(a => a.date === hoje).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              para hoje
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
                fullWidth
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
                        <MedicalServicesIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle1" fontWeight="bold" component="span">
                            {notification.exam_name}
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
                            Com {notification.doctor_name}
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

      {/* Meus Agendamentos */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight="bold">
              Meus Agendamentos
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
              Você não possui agendamentos para os próximos dias.
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
        <MenuItem onClick={handleOpenDetails}>Ver detalhes</MenuItem>
        <MenuItem onClick={handleMenuClose}>Remarcar</MenuItem>
        <MenuItem onClick={handleMenuClose}>Cancelar</MenuItem>
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
                Detalhes do Agendamento
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {selectedAgendamento.exam_name}
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
                    Observações:
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
              <Button variant="outlined" color="warning">
                Remarcar
              </Button>
              <Button variant="contained" color="primary">
                Confirmar Presença
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Grid>
  );
}