import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Alert,
  Snackbar,
  FormControlLabel,
  Checkbox,
  Link,
  Avatar,
  CircularProgress,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../services/authContext';

export default function RegisterDoctorPage() {
  const navigate = useNavigate();
  const { registerDoctor } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    crm_number: '',
    specialty: '',
    state: '',
    city: '',
    cep: '',
    number: '',
    complement: '',
    neighborhood: '',
    password: '',
    confirmarSenha: '',
    aceitaTermos: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    if (formData.password !== formData.confirmarSenha) {
      setErrorMessage('As senhas não coincidem');
      setShowError(true);
      return;
    }

    if (!formData.aceitaTermos) {
      setErrorMessage('Você deve aceitar os termos de uso');
      setShowError(true);
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres');
      setShowError(true);
      return;
    }

    // Preparar dados para o endpoint
    const doctorData = {
      full_name: formData.full_name,
      email: formData.email,
      crm_number: formData.crm_number,
      specialty: formData.specialty,
      state: formData.state,
      city: formData.city,
      cep: formData.cep,
      number: formData.number,
      complement: formData.complement,
      neighborhood: formData.neighborhood,
      password: formData.password
    };

    try {
      setLoading(true);
      await registerDoctor(doctorData);
      setShowSuccess(true);
    } catch (error) {
      setErrorMessage(error.message || 'Erro ao criar conta. Tente novamente.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const formatCEP = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <PersonAddIcon />
          </Avatar>
          <Typography variant="h4" component="h1" ml={2}>
            Cadastro de Médico
          </Typography>
        </Box>

        <Typography variant="body1" textAlign="center" color="text.secondary" mb={4}>
          Preencha os dados abaixo para criar sua conta profissional
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container display="flex" justifyContent="flex-start" flexWrap={'wrap'} spacing={2}>
            {/* Dados Profissionais */}
            <Grid sx={{ width: "100%" }}>
              <Typography variant="h6" textAlign={"left"} gutterBottom>
                Dados Profissionais
              </Typography>
            </Grid>

            <Grid sx={{ width: "15rem" }}>
              <TextField
                required
                fullWidth
                label="Nome Completo"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid sx={{ width: "15rem" }}>
              <TextField
                required
                fullWidth
                label="E-mail"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid sx={{ width: "15rem" }}>
              <TextField
                required
                fullWidth
                label="Número do CRM"
                name="crm_number"
                value={formData.crm_number}
                onChange={handleChange}
                helperText="Apenas números"
              />
            </Grid>

            <Grid sx={{ width: "15rem" }}>
              <TextField
                required
                fullWidth
                label="Especialidade"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="Ex: Cardiologia, Dermatologia"
              />
            </Grid>

            <Grid sx={{ width: "15rem" }}>
              <TextField
                required
                fullWidth
                label="Estado do CRM"
                name="state"
                value={formData.state}
                onChange={handleChange}
                inputProps={{ maxLength: 2 }}
                helperText="Ex: SP, RJ, MG"
              />
            </Grid>

            {/* Endereço */}
            <Grid sx={{ width: "100%" }}>
              <Typography variant="h6" textAlign={"left"} gutterBottom sx={{ mt: 3 }}>
                Endereço do Consultório
              </Typography>
            </Grid>

            <Grid sx={{ width: "15rem" }}>
              <TextField
                required
                fullWidth
                label="Cidade"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>

            <Grid sx={{ width: "15rem" }}>
              <TextField
                required
                fullWidth
                label="CEP"
                name="cep"
                value={formData.cep}
                onChange={(e) => {
                  const formatted = formatCEP(e.target.value);
                  setFormData(prev => ({ ...prev, cep: formatted }));
                }}
                inputProps={{ maxLength: 9 }}
              />
            </Grid>

            <Grid sx={{ width: "15rem" }}>
              <TextField
                required
                fullWidth
                label="Bairro"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
              />
            </Grid>

            <Grid sx={{ width: "15rem" }}>
              <TextField
                required
                fullWidth
                label="Número"
                name="number"
                value={formData.number}
                onChange={handleChange}
              />
            </Grid>

            <Grid sx={{ width: "15rem" }}>
              <TextField
                fullWidth
                label="Complemento"
                name="complement"
                value={formData.complement}
                onChange={handleChange}
                placeholder="Apartamento, sala, etc."
              />
            </Grid>

            {/* Senha */}
            <Grid sx={{ width: "100%" }}>
              <Typography variant="h6" textAlign={"left"} gutterBottom sx={{ mt: 3 }}>
                Acesso à Conta
              </Typography>
            </Grid>

            <Grid sx={{ width: "15rem" }}>
              <TextField
                required
                fullWidth
                label="Senha"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                helperText="Mínimo 6 caracteres"
              />
            </Grid>

            <Grid sx={{ width: "15rem" }}>
              <TextField
                required
                fullWidth
                label="Confirmar Senha"
                name="confirmarSenha"
                type="password"
                value={formData.confirmarSenha}
                onChange={handleChange}
              />
            </Grid>

            {/* Termos */}
            <Grid sx={{ width: "100%" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="aceitaTermos"
                    checked={formData.aceitaTermos}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    Eu aceito os{' '}
                    <Link href="#" color="primary">
                      termos de uso
                    </Link>{' '}
                    e a{' '}
                    <Link href="#" color="primary">
                      política de privacidade
                    </Link>
                  </Typography>
                }
              />
            </Grid>

            {/* Botões */}
            <Grid sx={{ width: "100%" }} display="grid" justifyContent="center">
              <Box display="flex" gap={2} justifyContent="center" mt={3}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={!formData.aceitaTermos || loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? 'Criando Conta...' : 'Criar Conta'}
                </Button>
              </Box>
            </Grid>

            <Grid sx={{ width: "100%" }}>
              <Typography variant="body2" textAlign="center" mt={2}>
                Já possui uma conta?{' '}
                <Link href="/login" color="primary">
                  Faça login aqui
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Snackbars de sucesso e erro */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Cadastro realizado com sucesso! Redirecionando...
        </Alert>
      </Snackbar>

      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}