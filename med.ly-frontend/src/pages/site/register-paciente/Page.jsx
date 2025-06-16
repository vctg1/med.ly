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
  Menu,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router';

export default function RegisterPatientPage() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    cpf: '',
    rg: '',
    endereco: '',
    cidade: '',
    estado: '',
    bairro: '',
    numero: '',
    complemento: '',
    cep: '',
    sexo: '',
    contatoEmergencia: '',
    telefoneEmergencia: '',
    convenio: '',
    numeroConvenio: '',
    senha: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validações
    if (formData.senha !== formData.confirmarSenha) {
      setErrorMessage('As senhas não coincidem');
      setShowError(true);
      return;
    }

    if (!formData.aceitaTermos) {
      setErrorMessage('Você deve aceitar os termos de uso');
      setShowError(true);
      return;
    }

    if (formData.senha.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres');
      setShowError(true);
      return;
    }

    // Simular cadastro
    console.log('Dados do paciente:', formData);
    setShowSuccess(true);
    
    // Redirecionar após sucesso
    setTimeout(() => {
      navigate('/login-paciente');
    }, 2000);
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
    <Container maxWidth="md">
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
            
            <Grid sx={{width:"100%"}}>
                <Typography variant="h6" textAlign={"left"}>
                    Dados Pessoais
                </Typography>
            </Grid>
            <Grid sx={{width:"15rem"}}>
              <TextField
                required
                fullWidth
                label="Nome Completo"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
              />
            </Grid>

            <Grid sx={{width:"15rem"}}>
              <TextField
                required
                fullWidth
                label="Data de Nascimento"
                name="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid sx={{width:"15rem"}}>
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

            <Grid sx={{width:"15rem"}}>
              <TextField
                required
                fullWidth
                label="RG"
                name="rg"
                value={formData.rg}
                onChange={handleChange}
              />
            </Grid>

            <Grid sx={{width:"15rem"}}>
              <FormControl fullWidth required>
                <TextField 
                fullWidth
                    select
                    label="Sexo"
                    placeholder='Selecione o Sexo'
                    variant="outlined"
                    name="sexo"
                    value={formData.sexo}
                    onChange={handleChange}
                >
                    <MenuItem value="masculino">Masculino</MenuItem>
                    <MenuItem value="feminino">Feminino</MenuItem>
                    <MenuItem value="outro">Outro</MenuItem>
                </TextField>
              </FormControl>
            </Grid>
            <Grid sx={{width:"15rem"}}>
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

            <Grid sx={{width:"15rem"}}>
              <TextField
                required
                fullWidth
                label="Telefone"
                name="telefone"
                value={formData.telefone}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  setFormData(prev => ({ ...prev, telefone: formatted }));
                }}
                inputProps={{ maxLength: 15 }}
              />
            </Grid>

            <Grid sx={{width:"15rem"}}>
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

            <Grid sx={{width:"15rem"}}>
              <TextField
                required
                fullWidth
                label="Cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
              />
            </Grid>

            <Grid sx={{width:"15rem"}}>
              <TextField
                required
                fullWidth
                label="Estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              />
            </Grid>
            <Grid sx={{width:"15rem"}}>
              <TextField
                fullWidth
                label="Bairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
              />
            </Grid>
            <Grid sx={{width:"15rem"}}>
              <TextField
                fullWidth
                label="Endereço"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
              />
            </Grid>
            <Grid sx={{width:"15rem"}}>
              <TextField
                fullWidth
                label="Número"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
              />
            </Grid>
            <Grid sx={{width:"15rem"}}>
              <TextField
                fullWidth
                label="Complemento"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
              />
            </Grid>

            {/* Contato de Emergência */}
            <Grid sx={{width:"100%"}}>
                <Typography variant="h6" textAlign={"left"}>
                    Contato de Emergência
                </Typography>
            </Grid>
            <Grid sx={{width:"15rem"}}>
              <TextField
                fullWidth
                label="Telefone de Emergência"
                name="telefoneEmergencia"
                value={formData.telefoneEmergencia}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  setFormData(prev => ({ ...prev, telefoneEmergencia: formatted }));
                }}
                inputProps={{ maxLength: 15 }}
              />
            </Grid>
            <Grid sx={{width:"15rem"}}>
              <TextField
                fullWidth
                label="Nome do Contato"
                name="contatoEmergencia"
                value={formData.contatoEmergencia}
                onChange={handleChange}
              />
            </Grid>

            {/* Convênio */}
            <Grid sx={{width:"100%"}}>
                <Typography variant="h6" textAlign={"left"}>
                    Convênio Médico
                </Typography>
            </Grid>
            <Grid sx={{width:"15rem"}}>
              <TextField
                fullWidth
                label="Convênio Médico"
                name="convenio"
                value={formData.convenio}
                onChange={handleChange}
                placeholder="Ex: Unimed, Bradesco Saúde, etc."
              />
            </Grid>

            <Grid sx={{width:"15rem"}}>
              <TextField
                fullWidth
                label="Número do Convênio"
                name="numeroConvenio"
                value={formData.numeroConvenio}
                onChange={handleChange}
              />
            </Grid>

            {/* Senha */}
            <Grid sx={{width:"100%"}}>
                <Typography variant="h6" textAlign={"left"}>
                    Acesso à Conta
                </Typography>
            </Grid>
            <Grid sx={{width:"15rem"}}>
              <TextField
                required
                fullWidth
                label="Senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleChange}
                helperText="Mínimo 6 caracteres"
              />
            </Grid>

            <Grid sx={{width:"15rem"}}>
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
            <Grid sx={{width:"15rem"}}>
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
            <Grid sx={{width:"100%"}} display="grid" justifyContent="center">
              <Box display="flex" gap={2} justifyContent="center" mt={3}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/')}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={!formData.aceitaTermos}
                >
                  Criar Conta
                </Button>
              </Box>
            </Grid>

            <Grid sx={{width:"100%"}} >
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
          Cadastro realizado com sucesso! Redirecionando para o login...
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