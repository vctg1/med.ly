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
  CircularProgress
} from '@mui/material';

export default function Login() {
    const [userData, setUserData] = useState({});
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const email = userData.email;
        const password = userData.password;
        console.log({ email, password });
        
        setLoading(true);
        
        // Simulando um tempo de processamento
        setTimeout(() => {
            if(email === user.email && password === user.password) {
                setOpenSuccess(true);
                // Redirecionamento após exibir a mensagem
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 500);
            } else {
                setOpenError(true);
                setLoading(false);
            }
        }, 500);
    }

    const user = {
        email: 'admin@gmail.com',
        password: '123123'
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
        setOpenError(false);
    };

    return (
        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: '80vh' }}>
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <Box
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        boxShadow: 3,
                        borderRadius: 2,
                        bgcolor: 'background.paper'
                    }}
                >
                    <Typography component='h1' variant='h4' fontWeight={'bold'} gutterBottom>
                        Área do profissional
                    </Typography>
                    
                    <form onSubmit={(e) => handleSubmit(e)} style={{ width: '100%' }}>
                        <FormControl variant="outlined" fullWidth>
                            <Box display={'grid'} gridTemplateRows={'repeat(2, 1fr)'} gap={2}>
                                <TextField
                                    id="email"
                                    label="Email"
                                    variant="outlined"
                                    type="email"
                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                    autoComplete="email"
                                    required
                                    fullWidth
                                    disabled={loading}
                                />
                                <TextField
                                    id="password"
                                    label="Senha"
                                    variant="outlined"
                                    type="password"
                                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                    autoComplete="current-password"
                                    required
                                    fullWidth
                                    disabled={loading}
                                />
                            </Box>
                            <Button 
                                variant="contained" 
                                type="submit" 
                                sx={{ mt: 3, height: 48 }}
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
                            <Box mt={2} display="flex" justifyContent="space-between">
                                <Button 
                                    variant="text" 
                                    href="/register" 
                                    sx={{ textTransform: 'none' }}
                                    disabled={loading}
                                >
                                    Criar conta
                                </Button>
                                <Button 
                                    variant="text" 
                                    href="/forgot-password" 
                                    sx={{ textTransform: 'none' }}
                                    disabled={loading}
                                >
                                    Esqueci minha senha
                                </Button>
                            </Box>
                        </FormControl>
                    </form>
                </Box>
            </Grid>

            {/* Alerts com Snackbar */}
            <Snackbar 
                open={openSuccess} 
                autoHideDuration={2000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity="success" 
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Login realizado com sucesso!
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
                    Email ou senha incorretos!
                </Alert>
            </Snackbar>
        </Grid>
    );
}