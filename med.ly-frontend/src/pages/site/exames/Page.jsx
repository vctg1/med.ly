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

export default function ExamesPage() {
  const { isAuthenticated } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMedico, setSelectedMedico] = useState(null);
  const [selectedHorario, setSelectedHorario] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [exames, setExames] = useState([]);
  const [selectedExame, setSelectedExame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Carregar exames da API
  useEffect(() => {
    const loadExames = async () => {
      try {
        setLoading(true);
        const data = await getExamsAvailable();
        // Filtrar apenas exames (exam_type !== "consulta")
        const examesFiltrados = data.filter(item => 
          item.exam_type && item.exam_type.toLowerCase() !== 'consulta'
        );
        setExames(examesFiltrados);
      } catch (error) {
        console.error('Erro ao carregar exames:', error);
        setError('Erro ao carregar exames. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadExames();
  }, []);

  const handleOpenDialog = (exame) => {
    // Verificar se o usuário está logado usando AuthContext
    if (!isAuthenticated) {
      setError('Você precisa estar logado para agendar um exame. Faça login ou cadastre-se.');
      return;
    }

    setSelectedExame(exame);
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
    const medicoSelecionado = selectedExame?.doctors_available.find(
      (m) => m.doctor_name === event.target.value
    ) || null;

    if (!medicoSelecionado) {
      setError('Médico não encontrado. Por favor, selecione novamente.');
      return;
    }
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
      setError(error.message || 'Erro ao agendar exame. Tente novamente.');
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
  const getExamImage = (exame) => {
    if (exame.image_url) {
      return exame.image_url;
    }
    
    // Fallback baseado no tipo de exame
    const imageMap = {
      'radiologia': 'https://images.unsplash.com/photo-1513224502586-d1e602410265?auto=format&fit=crop&w=400&q=80',
      'laboratorio': 'https://lirp.cdn-website.com/57372278/dms3rep/multi/opt/blog047-640w.jpg',
      'ultrassonografia': 'https://hubconteudo.dasa.com.br/wp-content/uploads/2023/06/ultrassom-abdome-total.jpg',
      'endoscopia': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      'cardiologia': 'https://hubconteudo.dasa.com.br/wp-content/uploads/2023/06/ultrassom-abdome-total.jpg',
      'default': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=400&q=80'
    };
    
    const key = exame.exam_type?.toLowerCase() || exame.specialty?.toLowerCase() || 'default';
    return imageMap[key] || imageMap['default'];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box px={4}>
      <Typography variant="h4" gutterBottom>
        Exames
      </Typography>
      
      {exames.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Nenhum exame disponível no momento.
        </Alert>
      ) : (
        <Grid container display={{xs:'block', md:'grid'}} gridTemplateColumns={'1fr 1fr 1fr'} gap={10}>
          {exames.map((exame) => (
            <Grid key={exame.id}>
              <Card sx={{ display: "flex", flexDirection: "column", ":hover": { boxShadow: 5 } }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={getExamImage(exame)}
                  alt={exame.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {exame.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {exame.description}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    Tipo: {exame.exam_type}
                  </Typography>
                  {exame.specialty && (
                    <Typography variant="body2" color="text.secondary">
                      Especialidade: {exame.specialty}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Duração: {exame.duration_minutes} minutos
                  </Typography>
                </CardContent>
                <Box p={2} pt={0}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleOpenDialog(exame)}
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
        <DialogTitle>{selectedExame?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            {selectedExame?.description}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Duração: {selectedExame?.duration_minutes} minutos
          </Typography>
          {selectedExame?.specialty && (
            <Typography variant="body2" color="primary" gutterBottom>
              Especialidade: {selectedExame.specialty}
            </Typography>
          )}
          
          <Typography variant="subtitle2" gutterBottom mt={2}>
            Escolha um médico:
          </Typography>
          <RadioGroup
            value={selectedMedico?.doctor_name || ""}
            onChange={handleMedicoChange}
          >
            {selectedExame?.doctors_available?.map((medico) => (
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
              placeholder="Adicione observações sobre seu exame..."
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
          Exame agendado com sucesso!
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