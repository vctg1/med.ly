import { Box, Grid, Typography } from '@mui/material';
import React, { useState } from 'react'
import medImg from "../../images/med-logo.png"


export default function Header() {
    const menu = [
        {
            id: 1,
            name: 'Sou Paciente',
            path: null,
            subMenu: [
                {
                    name: 'Consultas',
                    path: '/consulta',
                },
                {
                    name: 'Exames',
                    path: '/exame',
                }
            ]
        },
        {
            id: 2,
            name: 'Sou Profissional',
            path: null,
            subMenu: [
                {
                    name: 'Fazer Login',
                    path: '/login',
                },
                {
                    name: 'Quero ser Parceiro',
                    path: '/register',
                },
            ]
        },
        {
            id: 3,
            name: 'Sobre Nós',
            path: '/sobre',
            subMenu: null
        },
        {
            id: 4,
            name: 'Contato',
            path: '#contato',
        }
    ];
    const rightMenu = [
        {
            id: 5,
            name: 'Agende agora',
            subMenu: null,
            path: '/agendar'
        }
    ]
    const [selectedMenu, setSelectedMenu] = useState(null);
    const localUrl = window.location.href;
    const isDashboardPage = localUrl.includes('/dashboard');
    if (isDashboardPage) {
        return null; // Do not render the header if on the dashboard page
    }
    return (
        <Grid top='0' padding='1rem' paddingX='3rem' width={'100%'} display={'grid'} gridAutoFlow={'row'} gridTemplateColumns={'1fr 1fr'} position={'fixed'} zIndex={1} bgcolor={'white'} >
            <Box display={'inline-grid'} alignItems='center' gridTemplateColumns={'repeat(5, 1fr)'}>
                <Typography component='a' href='/'>
                <Typography component={'img'} src={medImg} maxWidth={'30%'} alt="Logo" marginTop={'1rem'} />
                </Typography>
                {menu.map((item, index) => (
                    <Grid item xs={12} sm={4} key={index} onMouseOver={() => setSelectedMenu(item.id)} onMouseOut={() => setSelectedMenu(null)}>
                        <h3><a href={item.path ?? item.path}>{item.name}</a></h3>
                        {item.subMenu && (selectedMenu === item.id) && (
                            <Typography margin='0 0 0 1rem' position={'absolute'} bgcolor={'white'} component="ul" borderRadius='0 0 1rem 1rem' style={{ listStyleType: 'none', textAlignLast: 'start',paddingRight:'1rem', paddingLeft:'1rem' }}>    
                                {item.subMenu.map((subItem, subIndex) => (
                                    <Typography component={'li'} key={subIndex}>
                                        <a href={subItem.path}>{subItem.name}</a>
                                    </Typography>
                                ))}
                            </Typography>
                        )}
                    </Grid>
                ))}
            </Box>
            <Box display={'flex'} width={'80%'} justifyContent={'end'}>
                {rightMenu.map((item, index) => (
                    <Grid item xs={12} sm={4} key={index} onMouseOver={() => setSelectedMenu(item.id)} onMouseOut={() => setSelectedMenu(null)}>
                        <h3><a href={item?.path}>{item.name}</a></h3>
                        {item.subMenu && (selectedMenu === item.id) && (
                            <Typography variant="body2" component="ul" style={{ listStyleType: 'none', padding: 0 }}>
                                {item.subMenu.map((subItem, subIndex) => (
                                    <li key={subIndex}>
                                        <a href={subItem.path}>{subItem.name}</a>
                                    </li>
                                ))}
                            </Typography>
                        )}
                    </Grid>
                ))}
            </Box>    

        </Grid>
    )
}