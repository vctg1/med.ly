import { Box, Button, Grid, Typography } from "@mui/material";
import React from "react";
import BannerImage from "../../../images/home-doctors.png"; // Import your image here
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CallIcon from '@mui/icons-material/Call';


export default function Banner() {
    return (
        <Grid bgcolor={'lightgray'} display={'grid'} gridTemplateColumns={'1fr 1fr'} paddingX='5rem' >
            <Typography alignSelf={'center'} display={'flex'} flexDirection={'column'} width={'max-content'} variant="h5" align="center" gutterBottom>
                AGENDE CONSULTAS E EXAMES
                    <Typography component="a" href='/agendar'>
                <Button fullWidth variant="contained" color="primary" size="large">
                    <CalendarMonthIcon/>
                        <Typography variant="subtitle1" color="white" marginLeft={1}>
                        Agendar Agora
                        </Typography>
                </Button>
                    </Typography>
                <Typography marginTop='1rem' width='100%' component='a' href="#contato" variant="subtitle1" color="white">
                    <Button fullWidth variant="contained" color="success" size="large">
                        <CallIcon/>
                        <Typography variant="subtitle1" color="white" marginLeft={1}>
                        Fale conosco
                        </Typography>
                    </Button>
                </Typography>
            </Typography>
            <img src={BannerImage} alt="Banner" style={{ width: "100%", height: "auto" }} />
        </Grid>
    );
}