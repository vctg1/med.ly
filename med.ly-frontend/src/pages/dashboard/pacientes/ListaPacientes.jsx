import React, { useState, useEffect } from "react";
import { 
  Grid, 
  Box, 
  Alert, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Tooltip
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import {
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LocalHospital as ExamIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { getAppointments } from '../../../../api/appointments';

export default function ListaPacientes({ searchTerm }) {
  const [pacientes, setPacientes] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPatientAppointments, setSelectedPatientAppointments] = useState([]);
  const [selectedPatientName, setSelectedPatientName] = useState('');

  useEffect(() => {
    const loadPacientes = async () => {
      try {
        setLoading(true);
        
        // Buscar agendamentos para extrair dados dos pacientes
        const appointments = await getAppointments();
        setAllAppointments(appointments);
        
        // Criar lista única de pacientes a partir dos agendamentos
        const pacientesMap = new Map();
        
        appointments.forEach(appointment => {
          if (!pacientesMap.has(appointment.patient_name)) {
            // Buscar todas as consultas deste paciente
            const patientAppointments = appointments.filter(a => a.patient_name === appointment.patient_name);
            
            // Última consulta (mais recente no passado)
            const hoje = new Date().toISOString().split('T')[0];
            const consultasPassadas = patientAppointments
              .filter(a => a.date < hoje)
              .sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Próxima consulta (mais próxima no futuro)
            const consultasFuturas = patientAppointments
              .filter(a => a.date >= hoje)
              .sort((a, b) => new Date(a.date) - new Date(b.date));

            pacientesMap.set(appointment.patient_name, {
              id: appointment.patient_id || pacientesMap.size + 1,
              nome: appointment.patient_name,
              totalConsultas: patientAppointments.length,
              ultimaConsulta: consultasPassadas.length > 0 ? consultasPassadas[0].date : null,
              proximaConsulta: consultasFuturas.length > 0 ? consultasFuturas[0].date : null,
              // Adicionar dados do paciente se disponíveis na resposta da API
              email: appointment.patient_email || 'Não informado',
              telefone: appointment.patient_phone || 'Não informado'
            });
          }
        });

        const pacientesList = Array.from(pacientesMap.values());
        setPacientes(pacientesList);
        
      } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
        setError('Erro ao carregar lista de pacientes.');
      } finally {
        setLoading(false);
      }
    };

    loadPacientes();
  }, []);

  // Filtrar pacientes baseado no termo de busca
  const pacientesFiltrados = pacientes.filter(paciente =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para abrir o dialog com detalhes do paciente
  const handleViewPatient = (patientName) => {
    // Buscar todos os agendamentos do paciente
    const patientAppointments = allAppointments
      .filter(appointment => appointment.patient_name === patientName)
      .sort((a, b) => {
        // Ordenar por data, com datas futuras primeiro, depois passadas
        const hoje = new Date().toISOString().split('T')[0];
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        // Se ambas são futuras ou ambas são passadas, ordenar por proximidade
        if ((a.date >= hoje && b.date >= hoje) || (a.date < hoje && b.date < hoje)) {
          return dateA - dateB;
        }
        
        // Futuras vêm primeiro
        if (a.date >= hoje && b.date < hoje) return -1;
        if (a.date < hoje && b.date >= hoje) return 1;
        
        return 0;
      });

    setSelectedPatientName(patientName);
    setSelectedPatientAppointments(patientAppointments);
    setDialogOpen(true);
  };

  const columns = [
    {
      field: 'nome',
      headerName: 'Nome',
      width: 200,
      editable: false,
    },
    {
      field: 'totalConsultas',
      headerName: 'Total Consultas',
      width: 130,
      editable: false,
      type: 'number',
    },
    {
      field: 'ultimaConsulta',
      headerName: 'Última Consulta',
      width: 150,
      editable: false,
      valueGetter: (value, row) => {
        if (!row.ultimaConsulta) return 'Nunca';
        // adicionar 1 dia para a data para corrigir o fuso horário
        const dateObj = new Date(row.ultimaConsulta);
        dateObj.setDate(dateObj.getDate() + 1);
        return dateObj.toLocaleDateString('pt-BR');
      },
    },
    {
      field: 'proximaConsulta',
      headerName: 'Próxima Consulta',
      width: 150,
      editable: false,
      valueGetter: (value, row) => {
        if (!row.proximaConsulta) return 'Não agendada';
        return formatDate(row.proximaConsulta);
      },
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 100,
      editable: false,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="Ver detalhes do paciente">
          <IconButton
            color="primary"
            onClick={() => handleViewPatient(params.row.nome)}
            size="small"
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
    console.log('Pacientes selecionados:', newSelection);
  };

  const formatDate = (date) => {
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + 1);
    const formattedDate = dateObj.toLocaleDateString('pt-BR');
    return formattedDate
  };
  const formatTime = (timeString) => {
    const time = timeString.slice(0, 5); // Pega apenas HH:mm
    if(timeString.length === 4) {
      return `0${time}`; // Adiciona segundos se necessário
    }
    return time; // Retorna o tempo formatado
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmado':
        return 'success';
      case 'cancelado':
        return 'error';
      case 'pendente':
        return 'warning';
      default:
        return 'default';
    }
  };

  const isUpcoming = (date, time) => {
    const dateTime = new Date(`${date}T${time}`);
    if (isNaN(dateTime.getTime())) return false;
    const now = new Date();
    return dateTime >= now;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  return (
    <>
      <Box sx={{ maxHeight: '70vh', width: '100%' }}>
        <DataGrid
          rows={pacientesFiltrados}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={handleSelectionChange}
          localeText={{
            // Tradução para português
            noRowsLabel: 'Nenhum paciente encontrado',
            footerRowSelected: (count) =>
              count !== 1
                ? `${count.toLocaleString()} linhas selecionadas`
                : `${count.toLocaleString()} linha selecionada`,
            footerPaginationRowsPerPage: 'Linhas por página:',
            footerPaginationOf: 'de',
          }}
        />      
      </Box>

      {/* Dialog com detalhes do paciente */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { minHeight: '600px' }
        }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.light', py: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <PersonIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Histórico de Consultas - {selectedPatientName}
              </Typography>
            </Box>
            <IconButton onClick={() => setDialogOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ p: 0 }}>
          {selectedPatientAppointments.length === 0 ? (
            <Box p={3} textAlign="center">
              <Typography variant="body1" color="text.secondary">
                Nenhuma consulta encontrada para este paciente.
              </Typography>
            </Box>
          ) : (
            <>
              {/* Resumo */}
              <Box p={3} bgcolor="grey.50">
                <Typography variant="h6" gutterBottom>
                  Resumo
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Total de Consultas
                    </Typography>
                    <Typography variant="h5" color="primary">
                      {selectedPatientAppointments.length}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Próximas Consultas
                    </Typography>
                    <Typography variant="h5" color="success.main">
                      {selectedPatientAppointments.filter(a => isUpcoming(a.date, a.start_time)).length}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Consultas Realizadas
                    </Typography>
                    <Typography variant="h5" color="text.secondary">
                      {selectedPatientAppointments.filter(a => !isUpcoming(a.date, a.start_time)).length}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              {/* Lista de consultas */}
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {selectedPatientAppointments.map((appointment, index) => (
                  <React.Fragment key={appointment.id}>
                    <ListItem 
                      sx={{ 
                        py: 2,
                        bgcolor: isUpcoming(appointment.date, appointment.start_time) ? 'rgba(25, 118, 210, 0.05)' : 'transparent'
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: isUpcoming(appointment.date, appointment.start_time) ? 'primary.main' : 'grey.400' 
                        }}>
                          <ExamIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {appointment.exam_name}
                            </Typography>
                            <Chip 
                              label={appointment.status} 
                              size="small" 
                              color={getStatusColor(appointment.status)}
                            />
                            {isUpcoming(appointment.date, appointment.start_time) && (
                              <Chip 
                                label="Próxima" 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                              <CalendarIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {formatDate(appointment.date)} - {formatTime(appointment.start_time)} às {formatTime(appointment.end_time)}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                              <TimeIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                Duração: {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                              </Typography>
                            </Box>
                            {appointment.notes && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                <strong>Observações:</strong> {appointment.notes}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < selectedPatientAppointments.length - 1 && <Divider variant="inset" />}
                  </React.Fragment>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}