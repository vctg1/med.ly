import { Box, Grid, Typography } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';

export default function Statistics() {
    const statistics = [
        { value: 20, label: 'anos de experiência' },
        { value: 1000, label: 'atendimentos realizados' },
        { value: 5000, label: 'exames realizados' },
    ];
    return (
        <Grid>
            <Grid display={'grid'} gridTemplateColumns={'1fr 1fr'} marginBottom={2} padding={'2rem'}>
                <Typography width={'50%'} justifySelf={'center'} textAlign={'start'} variant="h4" fontWeight={'bold'} marginLeft={1}>
                    Pague quando usar, sem mensalidades ou taxas de adesão.
                </Typography>
                <Box display={'flex'} >
                    {statistics.map((stat, index) => (
                        <Grid key={index} justifyContent={'center'} alignItems={'center'} marginTop={2}>
                            <Typography display={'flex'} borderBottom={1} borderColor={'black'} alignItems={'center'} justifyContent={'center'} color='green' variant="h4" marginLeft={1}>
                                <AddIcon fontSize='large' color='success' />
                                    de {stat.value}
                                </Typography>
                            <Typography variant="h6" marginLeft={1}>
                                {stat.label}
                            </Typography>
                        </Grid>
                    ))    
                    }
                </Box>
            </Grid>
        </Grid>
    )
}