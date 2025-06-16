import React, { useState } from 'react';
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

export default function Login() {
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    });
    const [userType, setUserType] = useState('paciente'); // 'paciente' ou 'profissional'
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUserTypeChange = (event, newUserType) => {
        if (newUserType !== null) {
            setUserType(newUserType);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const { email, password } = userData;
        
        if (!email || !password) {
            setOpenError(true);
            return;
        }
        
        setLoading(true);
        
        // Simulando autenticação
        setTimeout(() => {
            // Dados mockados para demonstração
            const mockUsers = {
                paciente: {
                    email: 'paciente@gmail.com',
                    password: '123456',
                    redirect: '/dashboard-paciente'
                },
                profissional: {
                    email: 'medico@gmail.com',
                    password: '123456',
                    redirect: '/dashboard'
                }
            };

            const currentUserMock = mockUsers[userType];
            
            if (email === currentUserMock.email && password === currentUserMock.password) {
                // Salvar dados do usuário no localStorage
                const userData = {
                    id: userType === 'paciente' ? 1 : 2,
                    nome: userType === 'paciente' ? 'João Silva' : 'Dr. Ana Santos',
                    email: email,
                    tipo: userType
                };
                
                localStorage.setItem(`${userType}Logado`, JSON.stringify(userData));
                
                setOpenSuccess(true);
                setTimeout(() => {
                    window.location.href = currentUserMock.redirect;
                }, 1000);
            } else {
                setOpenError(true);
                setLoading(false);
            }
        }, 800);
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

    return (
        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '80vh' }}>
            <Grid item sx={{ width:{ xs:'15rem', sm:"30rem"}}} >
                <Paper elevation={6} sx={{ borderRadius: 3}}>
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

                        {/* Toggle para tipo de usuário */}
                        <Box mb={3}>
                            <Typography variant="body2" color="text.secondary" mb={1} textAlign="center">
                                Você é:
                            </Typography>
                            <ToggleButtonGroup
                                value={userType}
                                exclusive
                                onChange={handleUserTypeChange}
                                aria-label="tipo de usuário"
                                fullWidth
                                sx={{ width: '100%' }}
                            >
                                <ToggleButton 
                                    value="paciente" 
                                    aria-label="paciente"
                                    sx={{ 
                                        flex: 1,
                                        '&.Mui-selected': {
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            '&:hover': {
                                                bgcolor: 'primary.dark',
                                            }
                                        }
                                    }}
                                >
                                    <PersonIcon sx={{ mr: 1 }} />
                                    Paciente
                                </ToggleButton>
                                <ToggleButton 
                                    value="profissional" 
                                    aria-label="profissional"
                                    sx={{ 
                                        flex: 1,
                                        '&.Mui-selected': {
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            '&:hover': {
                                                bgcolor: 'primary.dark',
                                            }
                                        }
                                    }}
                                >
                                    <LocalHospitalIcon sx={{ mr: 1 }} />
                                    Profissional
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

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
                                        placeholder={`Digite seu e-mail ${userType === 'paciente' ? 'de paciente' : 'profissional'}`}
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
                                        `Entrar como ${userType === 'paciente' ? 'Paciente' : 'Profissional'}`
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
                                        Paciente: paciente@gmail.com / 123456
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
                                        Profissional: medico@gmail.com / 123456
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
                    {!userData.email || !userData.password 
                        ? 'Por favor, preencha todos os campos!' 
                        : 'E-mail ou senha incorretos!'
                    }
                </Alert>
            </Snackbar>
        </Grid>
    );
}