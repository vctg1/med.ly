import React from 'react'
import { Box, FormControl, Grid, TextField, Button, Typography } from '@mui/material'

export default function Login() {
    const handleSubmit = (event) => {
        event.preventDefault();
        const email = userData.email;
        const password = userData.password;
        console.log({ email, password });
        if(email === user.email && password === user.password) {
            alert('Login realizado com sucesso!');
            // Redirecionar para a página de dashboard
            window.location.href = '/dashboard';
        }
        if(email !== user.email || password !== user.password) {
            alert('Email ou senha incorretos!');
        }
    }
    const user = {
        email: 'teste@gmail.com',
        password: '123123'
    }

    const [userData, setUserData] = React.useState();
    return (
        <Grid>
            <form onSubmit={(e) => handleSubmit(e)}>
                <Typography component='h1' variant='h4' fontWeight={'bold'} >Área do profissional</Typography>
                <FormControl variant="outlined" sx={{ width: '20%' }}>
                    <Box display={'grid'} gridTemplateRows={'repeat(2, 1fr)'} gap={2}>
                    <TextField
                        id="email"
                        label="Email"
                        variant="outlined"
                        type="email"
                        
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        autoComplete="email"
                        required
                        />
                    <TextField
                        id="password"
                        label="Senha"
                        variant="outlined"
                        type="password"
                        
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        autoComplete="current-password"
                        required
                        />
                    </Box>
                    <Button variant="contained" type="submit" sx={{ mt: 2 }}>
                        Entrar
                    </Button>
                    <Button variant="outlined" sx={{ mt: 2 }} href="/register">
                        Criar conta
                    </Button>
                    <Button variant="outlined" sx={{ mt: 2 }} href="/forgot-password">
                        Esqueci minha senha
                    </Button>
                </FormControl>
            </form>
        </Grid>
    )
}