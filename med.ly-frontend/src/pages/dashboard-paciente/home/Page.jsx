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

// Dados do paciente logado (simulando dados do localStorage)
const pacienteLogado = {
  id: 1,
  nome: "João Silva",
  email: "joao.silva@email.com",
  telefone: "(11) 99999-9999",
  dataNascimento: "1985-03-15",
  cpf: "123.456.789-00",
  convenio: "Unimed",
  numeroConvenio: "123456789"
};

// Mock de agendamentos do paciente
const mockAgendamentos = [
  { 
    id: 1, 
    paciente: pacienteLogado.nome, 
    tipo: "Consulta", 
    especialidade: "Cardiologia", 
    medico: "Dr. Ana Souza",
    data: "2025-06-10", 
    horario: "09:00", 
    status: "confirmado",
    lido: false,
    observacoes: "Consulta de rotina para avaliação cardíaca."
  },
  { 
    id: 2, 
    paciente: pacienteLogado.nome, 
    tipo: "Exame", 
    especialidade: "Radiologia", 
    medico: "Dr. Paulo Amaral",
    data: "2025-06-12", 
    horario: "14:00", 
    status: "confirmado",
    lido: false,
    observacoes: "Raio-X de tórax solicitado pelo cardiologista."
  },
  { 
    id: 3, 
    paciente: pacienteLogado.nome, 
    tipo: "Consulta", 
    especialidade: "Dermatologia", 
    medico: "Dr. Bruno Lima",
    data: "2025-06-15", 
    horario: "10:30", 
    status: "confirmado",
    lido: true,
    observacoes: "Avaliação de lesão na pele."
  },
  { 
    id: 4, 
    paciente: pacienteLogado.nome, 
    tipo: "Consulta", 
    especialidade: "Oftalmologia", 
    medico: "Dr. Felipe Torres",
    data: "2025-06-18", 
    horario: "15:00", 
    status: "confirmado",
    lido: true,
    observacoes: "Check-up oftalmológico anual."
  },
  { 
    id: 5, 
    paciente: pacienteLogado.nome, 
    tipo: "Exame", 
    especialidade: "Laboratório", 
    medico: "Dra. Renata Lopes",
    data: "2025-06-20", 
    horario: "08:00", 
    status: "confirmado",
    lido: true,
    observacoes: "Hemograma completo e perfil lipídico."
  },
  { 
    id: 6, 
    paciente: pacienteLogado.nome, 
    tipo: "Consulta", 
    especialidade: "Neurologia", 
    medico: "Dra. Gabriela Silva",
    data: "2025-06-25", 
    horario: "11:00", 
    status: "confirmado",
    lido: true,
    observacoes: "Consulta para investigação de dores de cabeça frequentes."
  }
];

export default function HomePage() {
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

  // ...existing code...

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      {/* Cabeçalho */}
      <Grid item xs={12}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: "#f8f9fa" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Olá, {pacienteLogado.nome}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Aqui estão seus agendamentos e informações de saúde
              </Typography>
            </Box>
            <Badge badgeContent={notificacoesNaoLidas} color="error">
              <NotificationsIcon color="action" fontSize="large" />
            </Badge>
          </Box>
        </Paper>
      </Grid>

      {/* Informações Pessoais */}
      <Grid item sx={{ minWidth: {xs:'50px', md:'200px'} }}>
        <Card sx={{ boxShadow: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <PersonIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                Meus Dados
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <EmailIcon color="action" fontSize="small" />
                <Typography variant="body2">{pacienteLogado.email}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <PhoneIcon color="action" fontSize="small" />
                <Typography variant="body2">{pacienteLogado.telefone}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <CakeIcon color="action" fontSize="small" />
                <Typography variant="body2">
                  {new Date(pacienteLogado.dataNascimento).toLocaleDateString('pt-BR')} 
                  ({calcularIdade(pacienteLogado.dataNascimento)} anos)
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <LocalHospitalIcon color="action" fontSize="small" />
                <Typography variant="body2">
                  {pacienteLogado.convenio} - {pacienteLogado.numeroConvenio}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Resumo de Agendamentos */}
      <Grid item sx={{ minWidth: {xs:'50px', md:'200px'} }}>
        <Card sx={{ boxShadow: 2 }}>
          <CardContent>
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

      <Grid item sx={{ minWidth: {xs:'50px', md:'200px'} }}>
        <Card sx={{ boxShadow: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={1}>
              <CalendarTodayIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                Hoje
              </Typography>
            </Box>
            <Typography variant="h3" color="success" fontWeight="bold">
              {agendamentosOrdenados.filter(a => a.data === hoje).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              para hoje
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Notificações de Agendamentos */}
      <Grid item>
        <Paper sx={{ p: 3, borderRadius: 2, minWidth: {xs:'50px', md:'200px'} }}>
          <Box display="grid" justifyContent="space-between" alignItems="center" mb={2}>
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
                      <Avatar sx={{ bgcolor: agendamento.tipo === 'Consulta' ? 'primary.main' : 'secondary.main' }}>
                        {agendamento.tipo === 'Consulta' ? <PersonIcon /> : <MedicalServicesIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle1" fontWeight="bold" component="span">
                            {agendamento.tipo}: {agendamento.especialidade}
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
                        <Box component="div">
                          <Typography component="span" variant="body2" color="text.primary">
                            Com {agendamento.medico}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            {(() => {
                              const [year, month, day] = agendamento.data.split('-');
                              const formattedDate = new Date(year, month - 1, day);
                              return formattedDate.toLocaleDateString('pt-BR');
                            })()} às {agendamento.horario}
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
                  {selectedAgendamento.tipo} - {selectedAgendamento.especialidade}
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
                      <strong>Médico:</strong> {selectedAgendamento.medico}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MedicalServicesIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Tipo:</strong> {selectedAgendamento.tipo}
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
                  Observações:
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