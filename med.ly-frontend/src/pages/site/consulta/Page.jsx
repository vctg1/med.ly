import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  RadioGroup,
  FormControlLabel,
  Radio,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  TextField,
} from "@mui/material";
import { getExamsAvailable } from "../../../../api/exams";
import { createAppointment } from "../../../../api/appointments";
import { useAuth } from '../../../services/authContext';
import { useNavigate } from "react-router";

export default function ConsultasPage() {
  const { isAuthenticated } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedConsulta, setSelectedConsulta] = useState(null);
  const [selectedMedico, setSelectedMedico] = useState(null);
  const [selectedHorario, setSelectedHorario] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Carregar consultas da API
  useEffect(() => {
    const loadConsultas = async () => {
      try {
        setLoading(true);
        const data = await getExamsAvailable();
        // Filtrar apenas consultas (exam_type === "consulta")
        const consultasFiltradas = data.filter(item => 
          item.exam_type && item.exam_type.toLowerCase() === 'consulta'
        );
        setConsultas(consultasFiltradas);
      } catch (error) {
        console.error('Erro ao carregar consultas:', error);
        setError('Erro ao carregar consultas. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    loadConsultas();
  }, []);

  const handleOpenDialog = (consulta) => {
    // Verificar se o usuário está logado usando AuthContext
    if (!isAuthenticated) {
      setError('Você precisa estar logado para agendar uma consulta. Faça login ou cadastre-se.');
      return;
    }

    setSelectedConsulta(consulta);
    setSelectedMedico(null);
    setSelectedHorario("");
    setNotes("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMedico(null);
    setSelectedHorario("");
    setNotes("");
  };

  const handleMedicoChange = (event) => {
    const medicoSelecionado = selectedConsulta?.doctors_available.find(
      (m) => m.doctor_name === event.target.value
    );
    setSelectedMedico(medicoSelecionado);
    setSelectedHorario("");
  };

  const handleHorarioChange = (event) => {
    setSelectedHorario(event.target.value);
  };

  const handleConfirm = async () => {
    if (!selectedHorario) {
      setError('Por favor, selecione um horário.');
      return;
    }

    try {
      setSubmitting(true);
      
      // Criar agendamento usando a API
      await createAppointment(parseInt(selectedHorario), notes);
      
      setOpenDialog(false);
      setSuccess(true);
      setSelectedMedico(null);
      setSelectedHorario("");
      setNotes("");
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      setError(error.message || 'Erro ao agendar consulta. Tente novamente.');
    } finally {
      setSubmitting(false);
      navigate('/login');
    }
  };

  // Função para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Adiciona um dia para corrigir o offset
    return date.toLocaleDateString('pt-BR');
  };
  const formatTime = (timeString) => {
    const time = timeString.slice(0, 5); // Pega apenas HH:mm
    if(timeString.length === 4) {
      return `0${time}`; // Adiciona zero à esquerda se necessário
    }
    return time;
  }

  // Função para obter imagem (usar image_url da API ou fallback)
  const getConsultaImage = (consulta) => {
    if (consulta.image_url) {
      return consulta.image_url;
    }
    
    // Fallback baseado na especialidade dos médicos disponíveis
    const imageMap = {
      'cardiologia': 'https://brailecardio.com.br/wp-content/uploads/2019/03/SMT4uK8.jpg',
      'dermatologia': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80',
      'pediatria': 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
      'ortopedia': 'https://assets-sitesdigitais.dasa.com.br/strapi/especialid_696c8b10a0/especialid_696c8b10a0.png',
      'ginecologia': 'https://drapatriciavarella.com.br/wp-content/uploads/2021/04/O-que-falar-em-uma-consulta-com-ginecologista-min.jpg',
      'oftalmologia': 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=400&q=80',
      'neurologia': 'https://www.dorflex.com.br/dam/jcr:87c4d230-2e52-469a-b52b-204fc219460e/consulta_com_neurologista.webp',
      'default': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=400&q=80'
    };
    
    // Pegar a primeira especialidade se houver médicos disponíveis
    const firstSpecialty = consulta.specialty?.toLowerCase() || 
                          consulta.doctors_available?.[0]?.specialty?.toLowerCase() || 
                          'default';
    return imageMap[firstSpecialty] || imageMap['default'];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Consultas
      </Typography>
      
      {consultas.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Nenhuma consulta disponível no momento.
        </Alert>
      ) : (
        <Grid container display={{xs:'block', md:'grid'}} gridTemplateColumns={'1fr 1fr 1fr'} gap={10}>
          {consultas.map((consulta) => (
            <Grid key={consulta.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column", ":hover": { boxShadow: 5 } }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={getConsultaImage(consulta)}
                  alt={consulta.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {consulta.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {consulta.description}
                  </Typography>
                  {consulta.specialty && (
                    <Typography variant="body2" color="primary">
                      Especialidade: {consulta.specialty}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Duração: {consulta.duration_minutes} minutos
                  </Typography>
                  {consulta.doctors_available?.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Médicos: {[...new Set(consulta.doctors_available.map(d => d.specialty))].join(', ')}
                    </Typography>
                  )}
                </CardContent>
                <Box p={2} pt={0}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleOpenDialog(consulta)}
                  >
                    Agendar
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedConsulta?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            {selectedConsulta?.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Duração: {selectedConsulta?.duration_minutes} minutos
          </Typography>
          {selectedConsulta?.specialty && (
            <Typography variant="body2" color="primary" gutterBottom>
              Especialidade: {selectedConsulta.specialty}
            </Typography>
          )}
          
          <Typography variant="subtitle2" gutterBottom mt={2}>
            Escolha um médico:
          </Typography>
          <RadioGroup
            value={selectedMedico?.doctor_name || ""}
            onChange={handleMedicoChange}
          >
            {selectedConsulta?.doctors_available?.map((medico) => (
              <FormControlLabel
                key={medico.doctor_id}
                value={medico.doctor_name}
                control={<Radio />}
                label={`${medico.doctor_name} - ${medico.specialty}`}
              />
            ))}
          </RadioGroup>

          {selectedMedico && selectedMedico.available_slots?.length > 0 && (
            <>
              <Typography variant="subtitle2" mt={2}>
                Horários disponíveis para {selectedMedico.doctor_name}:
              </Typography>
              <RadioGroup
                value={selectedHorario}
                onChange={handleHorarioChange}
              >
                {selectedMedico.available_slots
                  .filter(slot => slot.is_available)
                  .map((slot) => (
                    <FormControlLabel
                      key={slot.id}
                      value={slot.id.toString()}
                      control={<Radio />}
                      label={`${formatDate(slot.date)} - ${formatTime(slot.start_time)} às ${formatTime(slot.end_time)}`}
                    />
                  ))}
              </RadioGroup>
            </>
          )}

          {selectedMedico && selectedHorario && (
            <TextField
              fullWidth
              label="Observações (opcional)"
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione observações sobre sua consulta..."
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={!selectedMedico || !selectedHorario || submitting}
          >
            {submitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Confirmar Agendamento'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Consulta agendada com sucesso!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}