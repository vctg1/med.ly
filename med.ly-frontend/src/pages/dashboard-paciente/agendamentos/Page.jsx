import React from "react";
import { Box } from "@mui/material";
import { useState } from "react";
import { Grid, Paper, Typography, List, ListItemText, ListItem, ListItemAvatar, Avatar, IconButton, Divider, Chip, Alert, TablePagination, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
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
export default function AgendamentosPage() {
    // Simular dados de agendamentos
      const [agendamentos, setAgendamentos] = useState(mockAgendamentos);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const agendamentosAtuaisEFuturos = agendamentos.filter(agendamento => new Date(agendamento.data) >= new Date());
    const agendamentosPaginados = agendamentosAtuaisEFuturos.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );
    const hoje = new Date().toISOString().split('T')[0];
    const handleMenuOpen = (event, agendamentoId) => {
        setMenuAnchorEl(event.currentTarget);
        setCurrentAgendamentoId(agendamentoId);
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

    return (
        <Box sx={{ p: 2, backgroundColor: '#fff', borderRadius: 1, boxShadow: 1 }}>
            <h1>Agendamentos</h1>
            <p>Esta é a página de agendamentos do paciente.</p>
            {/* Aqui você pode adicionar componentes para listar os agendamentos, criar novos, etc. */}
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
                            bgcolor: isAgendamentoHoje(agendamento.data) ? 'rgba(25, 118, 210, 0.05)' : 'transparent',
                        }}
                        >
                        <ListItemAvatar>
                            <Avatar sx={{ 
                            bgcolor: agendamento.tipo === 'Consulta' 
                                ? (isAgendamentoHoje(agendamento.data) ? 'primary.main' : 'primary.light')
                                : (isAgendamentoHoje(agendamento.data) ? 'secondary.main' : 'secondary.light')
                            }}>
                            {agendamento.tipo === 'Consulta' ? <PersonIcon /> : <MedicalServicesIcon />}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography component="span" variant="subtitle1" fontWeight="bold">
                                {agendamento.tipo} - {agendamento.especialidade}
                                </Typography>
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
                            <Box component="div">
                                <Typography component="span" variant="body2" color="text.primary">
                                Com {agendamento.medico}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2">
                                {(() => {
                                    const [year, month, day] = agendamento.data.split('-');
                                    const formattedDate = new Date(year, month - 1, day);
                                    return isAgendamentoHoje(agendamento.data) 
                                    ? `Hoje às ${agendamento.horario}`
                                    : `${formattedDate.toLocaleDateString('pt-BR')} às ${agendamento.horario}`;
                                })()}
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