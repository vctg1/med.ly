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
} from "@mui/material";
import TextField from "@mui/material/TextField";

// Médicos mockados
const medicos = [
  { nome: "Dr. Ana Souza", area: "Cardiologia", horarios: ["09:00", "10:00", "11:00"] },
  { nome: "Dr. Bruno Lima", area: "Dermatologia", horarios: ["13:00", "14:00", "15:00"] },
  { nome: "Dra. Carla Mendes", area: "Pediatria", horarios: ["08:00", "09:30", "11:30"] },
  { nome: "Dr. Daniel Rocha", area: "Ortopedia", horarios: ["10:00", "12:00", "16:00"] },
  { nome: "Dra. Elisa Martins", area: "Ginecologia", horarios: ["09:00", "13:00", "17:00"] },
  { nome: "Dr. Felipe Torres", area: "Oftalmologia", horarios: ["08:30", "10:30", "14:30"] },
  { nome: "Dra. Gabriela Silva", area: "Neurologia", horarios: ["09:00", "11:00", "15:00"] },
  { nome: "Dr. Henrique Alves", area: "Psiquiatria", horarios: ["10:00", "13:00", "16:00"] },
  { nome: "Dra. Isabela Castro", area: "Endocrinologia", horarios: ["08:00", "12:00", "15:30"] },
  { nome: "Dr. João Pereira", area: "Urologia", horarios: ["09:30", "11:30", "14:30"] },
  { nome: "Dra. Karina Duarte", area: "Reumatologia", horarios: ["10:00", "12:30", "16:30"] },
  { nome: "Dr. Lucas Barros", area: "Otorrinolaringologia", horarios: ["08:30", "13:30", "17:30"] },
  { nome: "Dra. Mariana Figueiredo", area: "Gastroenterologia", horarios: ["09:00", "11:30", "15:30"] },
  { nome: "Dr. Nelson Prado", area: "Oncologia", horarios: ["10:00", "14:00", "16:00"] },
  { nome: "Dra. Olivia Ramos", area: "Nefrologia", horarios: ["08:00", "12:00", "18:00"] },
];

// Consultas mockadas com imagem em cada objeto
const consultas = [
  {
    id: 1,
    nome: "Consulta Cardiológica",
    descricao: "Avaliação e acompanhamento de doenças do coração.",
    area: "Cardiologia",
    imagem: "https://brailecardio.com.br/wp-content/uploads/2019/03/SMT4uK8.jpg",
  },
  {
    id: 2,
    nome: "Consulta Dermatológica",
    descricao: "Diagnóstico e tratamento de doenças da pele.",
    area: "Dermatologia",
    imagem: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    nome: "Consulta Pediátrica",
    descricao: "Atendimento médico para crianças e adolescentes.",
    area: "Pediatria",
    imagem: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    nome: "Consulta Ortopédica",
    descricao: "Avaliação de ossos, músculos e articulações.",
    area: "Ortopedia",
    imagem: "https://assets-sitesdigitais.dasa.com.br/strapi/especialid_696c8b10a0/especialid_696c8b10a0.png",
  },
  {
    id: 5,
    nome: "Consulta Ginecológica",
    descricao: "Saúde da mulher e acompanhamento ginecológico.",
    area: "Ginecologia",
    imagem: "https://drapatriciavarella.com.br/wp-content/uploads/2021/04/O-que-falar-em-uma-consulta-com-ginecologista-min.jpg",
  },
  {
    id: 6,
    nome: "Consulta Oftalmológica",
    descricao: "Exames e tratamentos para a visão.",
    area: "Oftalmologia",
    imagem: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 7,
    nome: "Consulta Neurológica",
    descricao: "Avaliação de doenças do sistema nervoso.",
    area: "Neurologia",
    imagem: "https://www.dorflex.com.br/dam/jcr:87c4d230-2e52-469a-b52b-204fc219460e/consulta_com_neurologista.webp",
  },
  {
    id: 8,
    nome: "Consulta Psiquiátrica",
    descricao: "Atendimento para saúde mental e emocional.",
    area: "Psiquiatria",
    imagem: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 9,
    nome: "Consulta Endocrinológica",
    descricao: "Tratamento de distúrbios hormonais.",
    area: "Endocrinologia",
    imagem: "https://telemedicinamorsch.com.br/wp-content/uploads/2021/09/consulta-endocrinologista-telemedicina-morsch.jpg",
  },
  {
    id: 10,
    nome: "Consulta Urológica",
    descricao: "Avaliação do trato urinário e sistema reprodutor masculino.",
    area: "Urologia",
    imagem: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 11,
    nome: "Consulta Reumatológica",
    descricao: "Diagnóstico de doenças reumáticas e autoimunes.",
    area: "Reumatologia",
    imagem: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 12,
    nome: "Consulta Otorrinolaringológica",
    descricao: "Tratamento de ouvidos, nariz e garganta.",
    area: "Otorrinolaringologia",
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuFfOjpYorfxb7DXnlwEvxg5ooMRuiT8o-aQ&s",
  },
  {
    id: 13,
    nome: "Consulta Gastroenterológica",
    descricao: "Avaliação do sistema digestivo.",
    area: "Gastroenterologia",
    imagem: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 14,
    nome: "Consulta Oncológica",
    descricao: "Acompanhamento e tratamento de câncer.",
    area: "Oncologia",
    imagem: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 15,
    nome: "Consulta Nefrológica",
    descricao: "Avaliação e tratamento dos rins.",
    area: "Nefrologia",
    imagem: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 16,
    nome: "Consulta Nutricional",
    descricao: "Orientação sobre alimentação e nutrição.",
    area: "Nutrição",
    imagem: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 17,
    nome: "Consulta Fisioterapêutica",
    descricao: "Tratamento de reabilitação física.",
    area: "Fisioterapia",
    imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRir2hhfeKTLD7D6FTpHbxhm6c_x6ylHhE5KQ&s",
  },
  {
    id: 18,
    nome: "Consulta Geriátrica",
    descricao: "Atendimento especializado para idosos.",
    area: "Geriatria",
    imagem: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 19,
    nome: "Consulta Infectológica",
    descricao: "Diagnóstico e tratamento de doenças infecciosas.",
    area: "Infectologia",
    imagem: "https://i0.wp.com/marcellojardim.com.br/wp-content/uploads/2024/02/consulta-com-infectologista.jpg",
  },
  {
    id: 20,
    nome: "Consulta Hematológica",
    descricao: "Avaliação de doenças do sangue.",
    area: "Hematologia",
    imagem: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=400&q=80",
  },
].map((consulta) => ({
  ...consulta,
  medicos: medicos.filter((m) => m.area === consulta.area),
}));

export default function ConsultasPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedConsulta, setSelectedConsulta] = useState(null);
  const [selectedMedico, setSelectedMedico] = useState(null);
  const [selectedHorario, setSelectedHorario] = useState("");
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    dataNascimento: "",
  });

  const handleOpenDialog = (consulta) => {
    setSelectedConsulta(consulta);
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
      selectedConsulta.medicos.find((m) => m.nome === event.target.value)
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
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Consultas
      </Typography>
      <Grid container display={'grid'}  gridTemplateColumns={'1fr 1fr 1fr'} gap={10}>
        {consultas.map((consulta) => (
          <Grid key={consulta.id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column", ":hover": { boxShadow: 5 }  }}>
              <CardMedia
                component="img"
                height="200"
                image={consulta.imagem}
                alt={consulta.nome}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {consulta.nome}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {consulta.descricao}
                </Typography>
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedConsulta?.nome}</DialogTitle>
        <DialogContent>
          {!showForm ? (
            <>
              <Typography variant="subtitle1" gutterBottom>
                {selectedConsulta?.descricao}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Escolha um médico:
              </Typography>
              <RadioGroup
                value={selectedMedico?.nome || ""}
                onChange={handleMedicoChange}
              >
                {selectedConsulta?.medicos.map((medico) => (
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
          Consulta marcada com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
}