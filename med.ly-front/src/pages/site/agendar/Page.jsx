import React from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  Paper,
} from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import BiotechIcon from "@mui/icons-material/Biotech";

export default function AgendarPage() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <Container maxWidth="lg">
      <Box>
        <Paper elevation={0} sx={{ p: 4, mb: 6, borderRadius: 2, bgcolor: "background.default" }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" fontWeight="bold">
            Agende seu Atendimento
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            Selecione o tipo de serviço que você precisa e comece seu agendamento agora mesmo.
          </Typography>
        </Paper>

        <Grid container spacing={4} justifyContent="center" display={'grid'} gridTemplateColumns={'1fr 1fr'} >
          <Grid item xs={12} md={6} >
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)'
                }
              }}
            >
              <CardMedia
                component="img"
                height="280"
                image="https://brailecardio.com.br/wp-content/uploads/2019/03/SMT4uK8.jpg"
                alt="Consulta médica"
                style={{ objectPosition: 'center', objectFit: 'fill' }}
              />
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <MedicalServicesIcon color="primary" sx={{ fontSize: 30, mr: 1 }} />
                  <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                    Consultas Médicas
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  Agende consultas com os melhores especialistas da nossa rede. Atendemos diversas especialidades médicas com profissionais qualificados.
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth
                  size="large"
                  onClick={() => handleNavigate('/consulta')}
                  sx={{ mt: 2 }}
                >
                  Agendar Consulta
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} >
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)'
                }
              }}
            >
              <CardMedia
                component="img"
                height="280"
                image="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
                alt="Exame laboratorial"
                style={{ objectPosition: 'center', objectFit: 'fill' }}
              />
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <BiotechIcon color="primary" sx={{ fontSize: 30, mr: 1 }} />
                  <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                    Exames Diagnósticos
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  Realize seus exames com tecnologia avançada e resultados precisos. Oferecemos uma ampla variedade de exames laboratoriais e de imagem.
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth
                  size="large"
                  onClick={() => handleNavigate('/exame')}
                  sx={{ mt: 2 }}
                >
                  Agendar Exame
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box mt={8} textAlign="center">
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Precisa de ajuda?
          </Typography>
          <Typography variant="body1">
            Entre em contato com nossa central de atendimento pelo telefone <strong>(11) 1234-5678</strong> ou pelo e-mail <strong>atendimento@med.ly</strong>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}