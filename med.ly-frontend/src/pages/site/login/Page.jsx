import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Box, 
  FormControl, 
  Grid, 
  TextField, 
  Button, 
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
  Paper,
  Divider,
  Link
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { useAuth } from '../../../services/authContext';

export default function Login() {
    const navigate = useNavigate();
    const { login, loading, isAuthenticated, isPatient, isDoctor } = useAuth();
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    });
    const [userType, setUserType] = useState('patient');
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Verificar se o usuário já está logado e redirecionar
    useEffect(() => {
        if (isAuthenticated) {
            if (isPatient()) {
                navigate('/dashboard-paciente', { replace: true });
            } else if (isDoctor()) {
                navigate('/dashboard', { replace: true });
            }
        }
    }, [isAuthenticated, isPatient, isDoctor, navigate]);

    const handleUserTypeChange = (event, newUserType) => {
        if (newUserType !== null) {
            setUserType(newUserType);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { email, password } = userData;
        
        if (!email || !password) {
            setErrorMessage('Por favor, preencha todos os campos!');
            setOpenError(true);
            return;
        }

        try {
            await login(email, password);
            setOpenSuccess(true);
            // O redirecionamento será feito automaticamente pelo useEffect quando isAuthenticated mudar
        } catch (error) {
            setErrorMessage(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
            setOpenError(true);
        }
    };

    const handleInputChange = (field) => (event) => {
        setUserData({ ...userData, [field]: event.target.value });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
        setOpenError(false);
    };

    // Mostrar loading enquanto verifica autenticação
    if (loading) {
        return (
            <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '80vh' }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ ml: 2 }}>
                    Verificando autenticação...
                </Typography>
            </Grid>
        );
    }

    return (
        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '80vh' }}>
            <Grid item sx={{ width: { xs: '90%', sm: "30rem" } }}>
                <Paper elevation={6} sx={{ borderRadius: 3 }}>
                    <Box
                        sx={{
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {/* Header */}
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
                            <LoginIcon fontSize="large" />
                        </Avatar>
                        
                        <Typography component='h1' variant='h4' fontWeight={'bold'} gutterBottom>
                            Bem-vindo!
                        </Typography>
                        
                        <Typography variant="body1" color="text.secondary" textAlign="center" mb={3}>
                            Faça login para acessar sua área
                        </Typography>

                        {/* Formulário de Login */}
                        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                            <FormControl variant="outlined" fullWidth>
                                <Box display={'flex'} flexDirection={'column'} gap={2}>
                                    <TextField
                                        id="email"
                                        label="E-mail"
                                        variant="outlined"
                                        type="email"
                                        value={userData.email}
                                        onChange={handleInputChange('email')}
                                        autoComplete="email"
                                        required
                                        fullWidth
                                        disabled={loading}
                                        placeholder={`Digite seu e-mail ${userType === 'patient' ? 'de paciente' : 'profissional'}`}
                                    />
                                    <TextField
                                        id="password"
                                        label="Senha"
                                        variant="outlined"
                                        type="password"
                                        value={userData.password}
                                        onChange={handleInputChange('password')}
                                        autoComplete="current-password"
                                        required
                                        fullWidth
                                        disabled={loading}
                                    />
                                </Box>
                                
                                <Button 
                                    variant="contained" 
                                    type="submit" 
                                    sx={{ mt: 3, height: 48, borderRadius: 2 }}
                                    fullWidth
                                    size="large"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        "Entrar"
                                    )}
                                </Button>

                                {/* Link esqueci minha senha */}
                                <Box textAlign="center" mt={2}>
                                    <Link 
                                        href="#" 
                                        color="primary" 
                                        sx={{ textDecoration: 'none' }}
                                        disabled={loading}
                                    >
                                        Esqueci minha senha
                                    </Link>
                                </Box>

                                <Divider sx={{ my: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        ou
                                    </Typography>
                                </Divider>

                                {/* Links de cadastro */}
                                <Box display="flex" flexDirection="column" gap={1}>
                                    <Typography variant="body2" color="text.secondary" textAlign="center">
                                        Não possui uma conta?
                                    </Typography>
                                    
                                    <Button 
                                        variant="outlined" 
                                        href="/register-paciente"
                                        sx={{ textTransform: 'none', borderRadius: 2 }}
                                        disabled={loading}
                                        startIcon={<PersonIcon />}
                                    >
                                        Cadastrar como Paciente
                                    </Button>
                                    
                                    <Button 
                                        variant="outlined" 
                                        href="/register"
                                        sx={{ textTransform: 'none', borderRadius: 2 }}
                                        disabled={loading}
                                        startIcon={<LocalHospitalIcon />}
                                    >
                                        Cadastrar como Profissional
                                    </Button>
                                </Box>

                                {/* Informações de demonstração */}
                                <Box mt={3} p={2} bgcolor="grey.50" borderRadius={2}>
                                    <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
                                        <strong>Dados para demonstração:</strong>
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
                                        Paciente: paciente@gmail.com / 123123
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
                                        Profissional: dra.renata.lopes@medlydoctors.com / 123456
                                    </Typography>
                                </Box>
                            </FormControl>
                        </Box>
                    </Box>
                </Paper>
            </Grid>

            {/* Alerts com Snackbar */}
            <Snackbar 
                open={openSuccess} 
                autoHideDuration={3000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity="success" 
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Login realizado com sucesso! Redirecionando...
                </Alert>
            </Snackbar>

            <Snackbar 
                open={openError} 
                autoHideDuration={4000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity="error" 
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Grid>
    );
}