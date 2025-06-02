import { Box, Grid, Typography } from '@mui/material';
import React, { use, useState } from 'react'
import medImg from "../../images/med-logo.png"
import { Menu } from '@mui/icons-material';
import { useNavigate } from 'react-router';


export default function Header() {
    const navigate = useNavigate();
    const leftMenu = [
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
    const [isOpen, setIsOpen] = useState(false);
    const handleToggle = () => {
        setIsOpen(!isOpen);
    }
    const [selectedMenu, setSelectedMenu] = useState(null);
    const handleMenuClick = (menuId) => {
        if (selectedMenu === menuId) {
            setSelectedMenu(null);
        } else {
            setSelectedMenu(menuId);
        }
    }

    const localUrl = window.location.href;
    const isDashboardPage = localUrl.includes('/dashboard');
    if (isDashboardPage) {
        return null; // Do not render the header if on the dashboard page
    }
    return (
        <Box sx={{ flexGrow: 1, position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
            <Grid container spacing={2} display={{xs:'grid', md:'flex'}} justifyContent={{md:"space-between"}} alignItems="center" sx={{ padding: '1rem', backgroundColor: '#fff', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <Grid item xs={6} md={6} display={{ xs: 'none', md: 'flex' }} justifyContent="flex-start">
                    <img src={medImg} alt="Logo" style={{ height: '50px', cursor:'pointer' }} onClick={()=>{window.location.href = "/"}} />
                </Grid>
                <Grid item xs={6} md={6} display={{ xs: 'flex', md: 'none' }} justifyContent="flex-end">
                    <Menu onClick={handleToggle} />
                </Grid>
                <Grid item xs={12} md={6} display={{ xs: 'none', md: 'flex' }} justifyContent="center">
                    {leftMenu.map((menu) => (
                        <Box key={menu.id} 
                            sx={{ marginRight: '2rem', position: 'relative' }}
                            onMouseEnter={() => handleMenuClick(menu.id)}  
                            onMouseLeave={() => handleMenuClick(null)} 
                            >
                            <Typography variant="h6" 
                                onClick={() => {
                                    if (menu.path) {
                                        window.location.href = menu.path;
                                    } else {
                                        handleMenuClick(menu.id);
                                    }
                                }}
                                sx={{ cursor: 'pointer',
                                    ":hover": {
                                        backgroundColor: '#f0f0f0',
                                        borderRadius: '4px'
                                    },
                                    padding: '0.5rem',
                                 }}>
                                {menu.name}
                            </Typography>
                            {menu.subMenu && (
                                <Box sx={{
                                    position: 'absolute',
                                    top: '100%',
                                    backgroundColor: '#fff',
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                    zIndex: 100,
                                    padding: '10%',
                                    borderRadius: '4px',
                                    width: '80%',
                                    opacity: selectedMenu === menu.id ? 1 : 0,
                                    transition: 'all 0.3s ease',
                                    overflow: 'hidden',
                                }}>
                                    {menu.subMenu.map((subMenu) => (
                                        <Typography key={subMenu.name} variant="body1" 
                                            onClick={() => navigate(subMenu.path)} 
                                            sx={{ cursor: 'pointer', paddingY: '5px', ":hover":{
                                                backgroundColor: '#f0f0f0',
                                                borderRadius: '4px',
                                                },
                                                textAlign: 'center',
                                            }}>
                                            {subMenu.name}
                                        </Typography>
                                    ))}
                                </Box>
                            )}
                        </Box>
                    ))}
                </Grid>
                <Grid item xs={12} md={6} display={{ xs: 'none', md: 'flex' }} justifyContent="flex-end">
                    {rightMenu.map((menu) => (
                        <Box key={menu.id} sx={{ marginLeft: '2rem' }}>
                            <Typography variant="h6" onClick={() => navigate(menu.path)} 
                                sx={{ cursor: 'pointer',
                                    ":hover": {
                                        backgroundColor: '#f0f0f0',
                                        borderRadius: '4px'
                                    },
                                    padding: '0.5rem',
                                 }}>
                                {menu.name}
                            </Typography>
                        </Box>
                    ))}
                </Grid>
                {isOpen && (
                    <Grid item xs={12} display={{ xs: 'grid', md: 'none' }} alignSelf="center" sx={{ backgroundColor: '#fff', paddingX: '1rem' }}>
                        <Grid item xs={6} md={6} display={{ xs: 'none', md: 'flex' }} justifyContent="flex-start">
                            <img src={medImg} alt="Logo" style={{ height: '50px', cursor:'pointer' }} onClick={()=>{window.location.href = "/"}} />
                        </Grid>
                        {leftMenu.map((menu) => (
                            <Box key={menu.id} >
                                <Typography variant="h6" 
                                    onClick={() =>
                                        menu.path ? window.location.href = menu.path : 
                                        handleMenuClick(menu.id)
                                    } 
                                    sx={{ cursor: 'pointer', ":hover":{backgroundColor: '#f0f0f0', borderRadius: '4px'} }}>
                                    {menu.name}
                                </Typography>
                                {selectedMenu === menu.id && menu.subMenu && (
                                    <Box sx={{
                                        top: '100%',
                                        left: 0,
                                        backgroundColor: '#fff',
                                        zIndex: 100,
                                        padding: '1rem',
                                        borderRadius: '4px',
                                    }}>
                                        {menu.subMenu.map((subMenu) => (
                                            <Typography key={subMenu.name} variant="body1" 
                                                onClick={() => navigate(subMenu.path)} 
                                                sx={{ 
                                                    cursor: 'pointer', 
                                                    paddingBottom: '0.5rem', 
                                                    ":hover": {
                                                        backgroundColor: '#f0f0f0',
                                                        borderRadius: '4px'
                                                    }}
                                                    }>
                                                {subMenu.name}
                                            </Typography>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        ))}
                        {rightMenu.map((menu) => (
                            <Box key={menu.id}>
                                <Typography variant="h6" onClick={() => navigate(menu.path)} sx={{ cursor: 'pointer' }}>
                                    {menu.name}
                                </Typography>
                            </Box>
                        ))}
                    </Grid>
                )}
            </Grid>
        </Box>
    )
    
}

