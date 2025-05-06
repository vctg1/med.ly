import { Button, FormControl, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import {createDoctor} from "../../../../api/doctors/crud"
import Alert from '@mui/material/Alert';

export default function Register() {
    const user = {
        username: "",
        name: "",
        email:"",
        specialty: "",
        crm: "",
        estado: "",
        password: "",
        confirmPassword: "",
        cidade: "",
        cep: "",
        numero: "",
        complemento: "",
        bairro: "",
    }
    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        console.log(userPost);
        const res = await createDoctor(userPost);
        if (res?.detail){
            alert(`Erro: ${res?.detail}`);
        }
        else{
            alert("Cadastrado com sucesso!");
            window.location.href = "/login";
        }
    }
    const handleReset = () => {
        setUserData(user);
    }
    const handleChange = (e:any) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }
    const [userData, setUserData] = React.useState(user);
    const userPost = {
        username: userData.username,
        name: userData.name,
        specialty: userData.specialty,
        crm: userData.crm,
        estado: userData.estado,
        password: userData.password,
    }
    return(
        <Grid>
            <Typography variant="h4" component="h1" gutterBottom style={{textAlign:'center', marginTop:'2rem'}}>
                Cadastro do profissional
            </Typography>
            <form onSubmit={e=>handleSubmit(e)}>
                <FormControl style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', width:'50%', alignItems:'center', gap:'2rem', justifySelf:'center'}} variant="outlined" sx={{ mb: 2 }}>
                    <TextField
                        required
                        name="name"
                        label="Nome"
                        variant="outlined"
                        value={userData?.name}
                        onChange={(e) => handleChange(e)}
                    />
                    <TextField
                        required
                        name="username"
                        label="Usuário"
                        variant="outlined"
                        value={userData?.username}
                        onChange={(e) => handleChange(e)}
                    />
                    <TextField
                        required
                        name="email"
                        label="Email"
                        variant="outlined"
                        value={userData?.email}
                        onChange={(e) => handleChange(e)}
                    />
                    <TextField
                        required
                        name="crm"
                        label="CRM"
                        variant="outlined"
                        value={userData?.crm}
                        onChange={(e) => handleChange(e)}
                    />
                    <TextField
                        required
                        name="specialty"
                        label="Especialidade"
                        variant="outlined"
                        value={userData?.specialty}
                        onChange={(e) => handleChange(e)}
                    />
                    <TextField
                        required
                        name="estado"
                        label="Estado"
                        variant="outlined"
                        value={userData?.estado}
                        onChange={(e) => handleChange(e)}
                    />
                    <TextField
                        required
                        name="password"
                        label="Senha"
                        type="password"
                        variant="outlined"
                        value={userData?.password}
                        onChange={(e) => handleChange(e)}
                    />
                    <TextField
                        required
                        name="confirmPassword"
                        label="Confirmar Senha"
                        type="password"
                        variant="outlined"
                        value={userData?.confirmPassword}
                        onChange={(e) => handleChange(e)}
                    />
                    <TextField
                        required
                        name="cidade"
                        label="Cidade"
                        variant="outlined"
                        value={userData?.cidade}
                        onChange={(e) => handleChange(e)}
                    />
                    <TextField
                        required
                        name="cep"
                        label="CEP"
                        variant="outlined"
                        value={userData?.cep}
                        onChange={(e) => handleChange(e)}
                    />
                    <TextField
                        required
                        name="numero"
                        label="Número"
                        variant="outlined"
                        value={userData?.numero}
                        onChange={(e) => handleChange(e)}
                    />
                    <TextField
                        required
                        name="complemento"
                        label="Complemento"
                        variant="outlined"
                        value={userData?.complemento}
                        onChange={(e) => handleChange(e)}
                    />
                    <TextField
                        required
                        name="bairro"
                        label="Bairro"
                        variant="outlined"
                        value={userData?.bairro}
                        onChange={(e) => handleChange(e)}
                    />
                    <Button variant="contained" color="primary" type="submit" style={{ gridColumn: 'span 2' }}>
                        Cadastrar
                    </Button>
                    <Button variant="outlined" color="secondary" type="reset" style={{ gridColumn: 'span 2' }} onClick={() => setUserData(user)}>
                        Limpar
                    </Button>
                </FormControl>
            </form>

        </Grid>
    )
}