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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Link,
  Avatar,
  CircularProgress,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../services/authContext';

export default function RegisterPatientPage() {
  const navigate = useNavigate();
  const { registerPatient } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    cpf: '',
    rg: '',
    city: '',
    state: '',
    cep: '',
    sex: '',
    emergency_contact_name: '',
    emergency_phone: '',
    health_insurance_name: '',
    health_insurance_number: '',
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
    const patientData = {
      full_name: formData.full_name,
      date_of_birth: formData.date_of_birth,
      cpf: formData.cpf,
      rg: formData.rg,
      sex: formData.sex,
      email: formData.email,
      phone: formData.phone,
      cep: formData.cep,
      city: formData.city,
      state: formData.state,
      emergency_phone: formData.emergency_phone,
      emergency_contact_name: formData.emergency_contact_name,
      health_insurance_name: formData.health_insurance_name,
      health_insurance_number: formData.health_insurance_number,
      password: formData.password
    };

    try {
      setLoading(true);
      await registerPatient(patientData);
      setShowSuccess(true);
    } catch (error) {
      setErrorMessage(error.message || 'Erro ao criar conta. Tente novamente.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
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
            Cadastro de Paciente
          </Typography>
        </Box>

        <Typography variant="body1" textAlign="center" color="text.secondary" mb={4}>
          Preencha os dados abaixo para criar sua conta e agendar consultas
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container display="flex" justifyContent="flex-start" flexWrap={'wrap'} spacing={2}>
            {/* Dados Pessoais */}
            <Grid sx={{ width: "100%" }}>
              <Typography variant="h6" textAlign={"left"} gutterBottom>
                Dados Pessoais
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
                label="Data de Nascimento"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid sx={{ width: "15rem" }}>
              <TextField
                required
                fullWidth
                label="CPF"
                name="cpf"
                value={formData.cpf}
                onChange={(e) => {
                  const formatted = formatCPF(e.target.value);
                  setFormData(prev => ({ ...prev, cpf: formatted }));
                }}
                inputProps={{ maxLength: 14 }}
              />
            </Grid>

            <Grid sx={{ width: "15rem" }}>
              <TextField
                required
                fullWidth
                label="RG"
                name="rg"
                value={formData.rg}
                onChange={handleChange}
              />
            </Grid>

            <Grid sx={{ width: "15rem" }}>
              <TextField
                fullWidth
                select
                label="Sexo"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                required
              >
                <MenuItem value="">Selecione</MenuItem>
                <MenuItem value="M">Masculino</MenuItem>
                <MenuItem value="F">Feminino</MenuItem>
                <MenuItem value="O">Outro</MenuItem>
              </TextField>
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
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  setFormData(prev => ({ ...prev, phone: formatted }));
                }}
                inputProps={{ maxLength: 15 }}
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
                label="Estado"
                name="state"
                value={formData.state}
                onChange={handleChange}
                inputProps={{ maxLength: 2 }}
              />
            </Grid>

            {/* Contato de Emergência */}
            <Grid sx={{ width: "100%" }}>
              <Typography variant="h6" textAlign={"left"} gutterBottom sx={{ mt: 3 }}>
                Contato de Emergência
              </Typography>
            </Grid>

            <Grid sx={{ width: "15rem" }}>
              <TextField
                fullWidth
                label="Nome do Contato"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid sx={{ width: "15rem" }}>
              <TextField
                fullWidth
                label="Telefone de Emergência"
                name="emergency_phone"
                value={formData.emergency_phone}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  setFormData(prev => ({ ...prev, emergency_phone: formatted }));
                }}
                inputProps={{ maxLength: 15 }}
              />
            </Grid>

            {/* Convênio */}
            <Grid sx={{ width: "100%" }}>
              <Typography variant="h6" textAlign={"left"} gutterBottom sx={{ mt: 3 }}>
                Convênio Médico
              </Typography>
            </Grid>

            <Grid sx={{ width: "15rem" }}>
              <TextField
                fullWidth
                label="Convênio Médico"
                name="health_insurance_name"
                value={formData.health_insurance_name}
                onChange={handleChange}
                placeholder="Ex: Unimed, Bradesco Saúde, etc."
              />
            </Grid>

            <Grid sx={{ width: "15rem" }}>
              <TextField
                fullWidth
                label="Número do Convênio"
                name="health_insurance_number"
                value={formData.health_insurance_number}
                onChange={handleChange}
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