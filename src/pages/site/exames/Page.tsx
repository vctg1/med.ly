import React, { useState } from "react";
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
  TextField,
} from "@mui/material";

// Médicos mockados para exames
const medicosExames = [
  { nome: "Dr. Paulo Amaral", area: "Radiologia", horarios: ["08:00", "10:00", "14:00"] },
  { nome: "Dra. Renata Lopes", area: "Laboratório", horarios: ["09:00", "11:00", "15:00"] },
  { nome: "Dr. Sérgio Tavares", area: "Ultrassonografia", horarios: ["08:30", "13:00", "16:00"] },
  { nome: "Dra. Tânia Borges", area: "Endoscopia", horarios: ["09:30", "12:00", "17:00"] },
  { nome: "Dr. Vinícius Prado", area: "Cardiologia Diagnóstica", horarios: ["10:00", "13:00", "15:30"] },
  { nome: "Dra. Wanda Silva", area: "Neurologia Diagnóstica", horarios: ["08:00", "11:00", "16:00"] },
  { nome: "Dr. Xavier Ramos", area: "Oftalmologia Diagnóstica", horarios: ["09:00", "12:00", "18:00"] },
  { nome: "Dra. Yara Fernandes", area: "Ginecologia Diagnóstica", horarios: ["08:30", "14:00", "17:30"] },
  { nome: "Dr. Zeca Moura", area: "Urologia Diagnóstica", horarios: ["10:00", "13:30", "16:30"] },
  { nome: "Dra. Beatriz Cunha", area: "Dermatologia Diagnóstica", horarios: ["09:30", "12:30", "15:30"] },
];

// Exames mockados com imagem em cada objeto
const exames = [
  {
    id: 1,
    nome: "Raio-X de Tórax",
    descricao: "Exame de imagem para avaliação dos pulmões e coração.",
    area: "Radiologia",
    imagem: "https://images.unsplash.com/photo-1513224502586-d1e602410265?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    nome: "Hemograma Completo",
    descricao: "Exame de sangue para avaliação geral da saúde.",
    area: "Laboratório",
    imagem: "https://lirp.cdn-website.com/57372278/dms3rep/multi/opt/blog047-640w.jpg",
  },
  {
    id: 3,
    nome: "Ultrassonografia Abdominal",
    descricao: "Exame de imagem para órgãos abdominais.",
    area: "Ultrassonografia",
    imagem: "https://hubconteudo.dasa.com.br/wp-content/uploads/2023/06/ultrassom-abdome-total.jpg",
  },
  {
    id: 4,
    nome: "Endoscopia Digestiva",
    descricao: "Exame para avaliação do trato digestivo superior.",
    area: "Endoscopia",
    imagem: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 5,
    nome: "Eletrocardiograma",
    descricao: "Exame para avaliação da atividade elétrica do coração.",
    area: "Cardiologia Diagnóstica",
    imagem: "https://hubconteudo.dasa.com.br/wp-content/uploads/2023/06/ultrassom-abdome-total.jpg",
  },
  {
    id: 6,
    nome: "Ressonância Magnética Cerebral",
    descricao: "Exame de imagem detalhado do cérebro.",
    area: "Neurologia Diagnóstica",
    imagem: "https://i0.wp.com/teslaimagem.com.br/wp-content/uploads/2017/10/ressonancia-magnetica-de-cranio.jpg?fit=4928%2C3264&ssl=1",
  },
  {
    id: 7,
    nome: "Mapeamento de Retina",
    descricao: "Exame para avaliação detalhada da retina.",
    area: "Oftalmologia Diagnóstica",
    imagem: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 8,
    nome: "Colposcopia",
    descricao: "Exame para avaliação do colo do útero.",
    area: "Ginecologia Diagnóstica",
    imagem: "https://cedusp.com.br/wp-content/uploads/2024/11/colposcopia-scaled.jpg",
  },
  {
    id: 9,
    nome: "Urofluxometria",
    descricao: "Exame para avaliação do fluxo urinário.",
    area: "Urologia Diagnóstica",
    imagem: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 10,
    nome: "Biópsia de Pele",
    descricao: "Exame para análise de lesões cutâneas.",
    area: "Dermatologia Diagnóstica",
    imagem: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80",
  },
].map((exame) => ({
  ...exame,
  medicos: medicosExames.filter((m) => m.area === exame.area),
}));

export default function ExamesPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExame, setSelectedExame] = useState<{
    id: number;
    nome: string;
    descricao: string;
    area: string;
    medicos: { nome: string; area: string; horarios: string[] }[];
    imagem: string;
  } | null>(null);
  const [selectedMedico, setSelectedMedico] = useState<{
    nome: string;
    area: string;
    horarios: string[];
  } | null>(null);
  const [selectedHorario, setSelectedHorario] = useState("");
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    dataNascimento: "",
  });

  const handleOpenDialog = (exame) => {
    setSelectedExame(exame);
    setSelectedMedico(null);
    setSelectedHorario("");
    setShowForm(false);
    setForm({
      nome: "",
      email: "",
      telefone: "",
      dataNascimento: "",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMedico(null);
    setSelectedHorario("");
    setShowForm(false);
  };

  const handleMedicoChange = (event) => {
    setSelectedMedico(
      selectedExame?.medicos.find((m) => m.nome === event.target.value) || null
    );
    setSelectedHorario("");
    setShowForm(false);
  };

  const handleHorarioChange = (event) => {
    setSelectedHorario(event.target.value);
    setShowForm(false);
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNext = () => {
    setShowForm(true);
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    setOpenDialog(false);
    setSuccess(true);
    setShowForm(false);
  };

  return (
    <Box px={4}>
      <Typography variant="h4" gutterBottom>
        Exames
      </Typography>
      <Grid container display={{xs:'block', md:'grid'}}  gridTemplateColumns={'1fr 1fr 1fr'} gap={10}>
        {exames.map((exame) => (
          <Grid key={exame.id}>
            <Card sx={{ display: "flex", flexDirection: "column", ":hover": { boxShadow: 5 } }}>
              <CardMedia
                component="img"
                height="200"
                image={exame.imagem}
                alt={exame.nome}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {exame.nome}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exame.descricao}
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedExame?.nome}</DialogTitle>
        <DialogContent>
          {!showForm ? (
            <>
              <Typography variant="subtitle1" gutterBottom>
                {selectedExame?.descricao}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Escolha um médico:
              </Typography>
              <RadioGroup
                value={selectedMedico?.nome || ""}
                onChange={handleMedicoChange}
              >
                {selectedExame?.medicos.map((medico) => (
                  <FormControlLabel
                    key={medico.nome}
                    value={medico.nome}
                    control={<Radio />}
                    label={medico.nome}
                  />
                ))}
              </RadioGroup>

              {selectedMedico && (
                <>
                  <Typography variant="subtitle2" mt={2}>
                    Horários disponíveis para {selectedMedico.nome}:
                  </Typography>
                  <RadioGroup
                    value={selectedHorario}
                    onChange={handleHorarioChange}
                  >
                    {selectedMedico.horarios.map((horario) => (
                      <FormControlLabel
                        key={horario}
                        value={horario}
                        control={<Radio />}
                        label={horario}
                      />
                    ))}
                  </RadioGroup>
                </>
              )}
            </>
          ) : (
            <Box component="form" onSubmit={handleConfirm} mt={2}>
              <Typography variant="subtitle1" gutterBottom>
                Preencha suas informações para confirmar o agendamento:
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Nome completo"
                name="nome"
                value={form.nome}
                onChange={handleFormChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="E-mail"
                name="email"
                type="email"
                value={form.email}
                onChange={handleFormChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Telefone"
                name="telefone"
                value={form.telefone}
                onChange={handleFormChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Data de nascimento"
                name="dataNascimento"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.dataNascimento}
                onChange={handleFormChange}
              />
              <DialogActions sx={{ px: 0 }}>
                <Button onClick={handleCloseDialog}>Cancelar</Button>
                <Button type="submit" variant="contained">
                  Confirmar Agendamento
                </Button>
              </DialogActions>
            </Box>
          )}
        </DialogContent>
        {!showForm && (
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={!selectedMedico || !selectedHorario}
            >
              Avançar
            </Button>
          </DialogActions>
        )}
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
    </Box>
  );
}