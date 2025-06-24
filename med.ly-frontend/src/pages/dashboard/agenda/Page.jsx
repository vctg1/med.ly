import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Fab,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  LocalHospital as ExamIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { getAppointments } from '../../../../api/appointments';
import { getExams } from '../../../../api/exams';
import { 
  createAvailabilitySlot, 
  getMyAvailabilitySlots, 
  deleteAvailabilitySlot 
} from '../../../../api/availability';
import { useAuth } from '../../../services/authContext';

export default function Agenda() {
  const { isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null);
  
  // Estados para novo slot de disponibilidade
  const [newSlot, setNewSlot] = useState({
    exam_id: '',
    date: '',
    start_time: '',
    end_time: '',
  });

  // Carregar dados iniciais
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadAppointments(),
        loadAvailabilitySlots(),
        loadExams(),
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados da agenda');
    } finally {
      setLoading(false);
    }
  };

  const loadAppointments = async () => {
    try {
      const data = await getAppointments();
      setAppointments(data || []);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    }
  };

  const loadAvailabilitySlots = async () => {
    try {
      const data = await getMyAvailabilitySlots();
      // filtrar slots que estão disponíveis (is_available = true)
      const availableSlots = data.filter(slot => slot.is_available);
      setAvailabilitySlots(availableSlots || []);
    } catch (error) {
      console.error('Erro ao carregar slots de disponibilidade:', error);
    }
  };

  const loadExams = async () => {
    try {
      const data = await getExams();
      setExams(data || []);
    } catch (error) {
      console.error('Erro ao carregar exames:', error);
    }
  };

  // Funções para gerenciar slots de disponibilidade
  const handleCreateSlot = async () => {
    try {
      if (!newSlot.exam_id || !newSlot.date || !newSlot.start_time || !newSlot.end_time) {
        setError('Todos os campos são obrigatórios');
        return;
      }

      // Converter horários para o formato ISO
      const startDateTime = `${newSlot.start_time}:00.000Z`;
      const endDateTime = `${newSlot.end_time}:00.000Z`;

      await createAvailabilitySlot(
        newSlot.exam_id,
        startDateTime,
        endDateTime,
        newSlot.date
      );

      // Resetar formulário e recarregar dados
      setNewSlot({ exam_id: '', date: '', start_time: '', end_time: '' });
      setDialogOpen(false);
      await loadAvailabilitySlots();
      setError(null);
    } catch (error) {
      console.error('Erro ao criar slot:', error);
      setError('Erro ao criar slot de disponibilidade');
    }
  };

  const handleDeleteSlot = async () => {
    try {
      if (slotToDelete) {
        await deleteAvailabilitySlot(slotToDelete.id);
        await loadAvailabilitySlots();
        setDeleteDialogOpen(false);
        setSlotToDelete(null);
        setError(null);
      }
    } catch (error) {
      console.error('Erro ao deletar slot:', error);
      setError('Erro ao deletar slot de disponibilidade');
    }
  };

  // Funções auxiliares
  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(appointment => appointment.date === dateStr);
  };

  const getSlotsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return availabilitySlots.filter(slot => slot.date === dateStr);
  };

  const formatTime = (timeString) => {
    const time = timeString.slice(0, 5); // Pega apenas HH:mm
    if(timeString.length === 4) {
      return `0${time}`; // Adiciona segundos se necessário
    }
    return time; // Retorna o tempo formatado
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Adiciona um dia para corrigir o offset
    return date.toLocaleDateString('pt-BR');
  };

  const getExamName = (examId) => {
    const exam = exams.find(e => e.id === examId);
    return exam ? exam.name : 'Exame não encontrado';
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dailyAppointments = getAppointmentsForDate(date);
      const dailySlots = getSlotsForDate(date);
      
      if (dailyAppointments.length > 0 || dailySlots.length > 0) {
        return (
          <Box display="flex" justifyContent="center" gap={0.5} mt={0.5}>
            {dailyAppointments.length > 0 && (
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                }}
              />
            )}
            {dailySlots.length > 0 && (
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                }}
              />
            )}
          </Box>
        );
      }
    }
    return null;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Agenda Médica
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Calendário */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <CalendarIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                Calendário
              </Typography>
            </Box>
            <Box display="flex" justifyContent="center">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
                locale="pt-BR"
              />
            </Box>
            <Box mt={2} display="flex" alignItems="center" gap={2}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                  }}
                />
                <Typography variant="caption">Consultas</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                  }}
                />
                <Typography variant="caption">Disponibilidades</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Eventos do Dia Selecionado */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="medium" gutterBottom>
              Agenda do dia {selectedDate.toLocaleDateString('pt-BR')}
            </Typography>

            {/* Consultas do dia */}
            <Box mb={3}>
              <Typography variant="subtitle1" fontWeight="medium" color="primary" gutterBottom>
                Consultas Agendadas ({getAppointmentsForDate(selectedDate).length})
              </Typography>
              {getAppointmentsForDate(selectedDate).length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma consulta agendada para este dia.
                </Typography>
              ) : (
                <List dense>
                  {getAppointmentsForDate(selectedDate).map((appointment) => (
                    <ListItem key={appointment.id} divider>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <PersonIcon fontSize="small" color="primary" />
                            <Typography variant="subtitle2">
                              {appointment.patient_name}
                            </Typography>
                            <Chip 
                              label={appointment.status} 
                              size="small" 
                              color={appointment.status === 'confirmado' ? 'success' : 'warning'}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              {appointment.exam_name}
                            </Typography>
                            <Typography variant="caption">
                              {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Slots disponíveis do dia */}
            <Box>
              <Typography variant="subtitle1" fontWeight="medium" color="success.main" gutterBottom>
                Horários Disponíveis ({getSlotsForDate(selectedDate).length})
              </Typography>
              {getSlotsForDate(selectedDate).length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Nenhum horário disponível para este dia.
                </Typography>
              ) : (
                <List dense>
                  {getSlotsForDate(selectedDate).map((slot) => (
                    <ListItem key={slot.id} divider>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <ExamIcon fontSize="small" color="success" />
                            <Typography variant="subtitle2">
                              {getExamName(slot.exam_id)}
                            </Typography>
                            {slot.is_available && (
                              <Chip label="Disponível" size="small" color="success" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption">
                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => {
                            setSlotToDelete(slot);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Lista de Exames */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <ExamIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                Exames Disponíveis
              </Typography>
            </Box>
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {exams.map((exam) => (
                <ListItem key={exam.id} divider>
                  <ListItemText
                    primary={exam.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {exam.specialty} • {exam.duration_minutes} min
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {exam.description}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Meus Slots de Disponibilidade */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" justify="space-between" mb={2}>
              <Box display="flex" alignItems="center">
                <ScheduleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="medium">
                  Meus Horários Disponíveis
                </Typography>
                <Badge badgeContent={availabilitySlots.length} color="primary" sx={{ ml: 2 }}>
                  <></>
                </Badge>
              </Box>
            </Box>
            <Button 
              variant='outlined'
              color="primary"
              startIcon={<AddIcon />}
              sx={{ ml: 2 }}
              onClick={() => setDialogOpen(true)}
            >
              Nova disponibilidade
            </Button>
            <List sx={{ maxHeight: 400, overflow: 'auto' }}>
              {availabilitySlots.map((slot) => (
                <ListItem key={slot.id} divider>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="subtitle2">
                          {getExamName(slot.exam_id)}
                        </Typography>
                        {slot.is_available && (
                          <Chip label="Disponível" size="small" color="success" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          {formatDate(slot.date)}
                        </Typography>
                        <Typography variant="caption">
                          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => {
                        setSlotToDelete(slot);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {availabilitySlots.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="Nenhum horário disponível"
                    secondary="Crie novos horários usando o botão +"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Botão Flutuante para Adicionar Disponibilidade */}
      <Tooltip title="Adicionar nova disponibilidade">
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setDialogOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Dialog para Criar Novo Slot */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <AddIcon color="primary" sx={{ mr: 1 }} />
            Nova Disponibilidade
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl sx={{minWidth:'8rem'}} fullWidth required>
                <InputLabel>Exame</InputLabel>
                <Select
                  value={newSlot.exam_id}
                  onChange={(e) => setNewSlot({ ...newSlot, exam_id: e.target.value })}
                  label="Exame"
                >
                  {exams.map((exam) => (
                    <MenuItem key={exam.id} value={exam.id}>
                      {exam.name} ({exam.specialty})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Data"
                type="date"
                value={newSlot.date}
                onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                label="Horário Inicial"
                type="time"
                value={newSlot.start_time}
                onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                required
                label="Horário Final"
                type="time"
                value={newSlot.end_time}
                onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreateSlot}
            variant="contained"
            disabled={!newSlot.exam_id || !newSlot.date || !newSlot.start_time || !newSlot.end_time}
          >
            Criar Disponibilidade
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para Confirmar Exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir esta disponibilidade?
          </Typography>
          {slotToDelete && (
            <Box mt={2} p={2} bgcolor="grey.100" borderRadius={1}>
              <Typography variant="subtitle2">
                {getExamName(slotToDelete.exam_id)}
              </Typography>
              <Typography variant="body2">
                {formatDate(slotToDelete.date)} - {formatTime(slotToDelete.start_time)} às {formatTime(slotToDelete.end_time)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteSlot}
            variant="contained"
            color="error"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}