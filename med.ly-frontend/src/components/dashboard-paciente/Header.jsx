import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon,
  AccountCircle as AccountIcon,
  Add,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useAuth } from '../../services/authContext';
import { getMe } from '../../../api/patients';
import { getAppointments } from '../../../api/appointments';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Chave para localStorage
  const STORAGE_KEY = `unread_notifications_patient_${user?.id || 'default'}`;

  // Carregar notificações do localStorage
  const loadNotificationsFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao carregar notificações do localStorage:', error);
      return [];
    }
  };

  // Salvar notificações no localStorage
  const saveNotificationsToStorage = (notifications) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Erro ao salvar notificações no localStorage:', error);
    }
  };

  // Carregar dados do paciente e notificações
  useEffect(() => {
    const loadPatientData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Carregar dados do paciente
        const patientInfo = await getMe();
        setPatientData(patientInfo);

        // Carregar agendamentos para atualizar notificações
        const appointments = await getAppointments();
        
        // Filtrar agendamentos recentes (últimas 24h)
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        
        const recentAppointments = appointments.filter(appointment => {
          const createdAt = new Date(appointment.created_at);
          return createdAt > oneDayAgo;
        });

        // Carregar notificações armazenadas
        const storedNotifications = loadNotificationsFromStorage();
        
        // Criar lista de notificações atuais
        const currentNotifications = recentAppointments.map(agendamento => ({
          id: agendamento.id,
          appointmentId: agendamento.id,
          exam_name: agendamento.exam_name,
          doctor_name: agendamento.doctor_name,
          date: agendamento.date,
          start_time: agendamento.start_time,
          created_at: agendamento.created_at,
          isRead: false
        }));

        // Filtrar apenas notificações que não foram lidas
        const unreadNotifications = currentNotifications.filter(notification => {
          const wasRead = storedNotifications.some(stored => 
            stored.appointmentId === notification.appointmentId && stored.isRead
          );
          return !wasRead;
        });

        // Atualizar contagem
        setNotificationsCount(unreadNotifications.length);
        
        // Atualizar localStorage com notificações atuais (preservando status de lida)
        const updatedStoredNotifications = currentNotifications.map(notification => {
          const existingNotification = storedNotifications.find(stored => 
            stored.appointmentId === notification.appointmentId
          );
          return existingNotification || notification;
        });
        
        saveNotificationsToStorage(updatedStoredNotifications);

      } catch (error) {
        console.error('Erro ao carregar dados do paciente:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPatientData();
  }, [isAuthenticated, STORAGE_KEY]);

  // Escutar mudanças no localStorage para atualizar o badge em tempo real
  useEffect(() => {
    const handleStorageChange = () => {
      const storedNotifications = loadNotificationsFromStorage();
      const unreadCount = storedNotifications.filter(notification => !notification.isRead).length;
      setNotificationsCount(unreadCount);
    };

    // Escutar mudanças no localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Escutar mudanças customizadas (para quando a mudança acontece na mesma aba)
    window.addEventListener('notificationsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('notificationsUpdated', handleStorageChange);
    };
  }, [STORAGE_KEY]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleNotificationsClick = () => {
    // Navegar para a home onde estão as notificações
    navigate('/dashboard-paciente');
  };

  const url = "/dashboard-paciente";

  // Função para obter as iniciais do nome
  const getInitials = (fullName) => {
    if (!fullName) return '?';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Função para obter o primeiro nome
  const getFirstName = (fullName) => {
    if (!fullName) return 'Usuário';
    return fullName.trim().split(' ')[0];
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        {/* Logo */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Med.ly - Área do Paciente
        </Typography>

        {/* Navegação */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>          
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            onClick={() => handleNavigation(url)}
          >
            Home
          </Button>
          <Button
            color="inherit"
            startIcon={<Add />}
            onClick={() => handleNavigation(`/agendar`)}
          >
            Novo Agendamento
          </Button>

          {/* Notificações */}
          <Tooltip title={`${notificationsCount} notificações não lidas`}>
            <IconButton color="inherit" onClick={handleNotificationsClick}>
              <Badge 
                badgeContent={notificationsCount} 
                color="error"
                max={99}
                showZero={false}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Saudação ao usuário */}
          {patientData && !loading && (
            <Typography variant="body2" sx={{ mx: 2, display: { xs: 'none', sm: 'block' } }}>
              Olá, {getFirstName(patientData.full_name)}!
            </Typography>
          )}

          {/* Menu do usuário */}
          <Tooltip title="Menu do usuário">
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              sx={{ ml: 1 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={32} color="inherit" />
              ) : (
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {patientData ? getInitials(patientData.full_name) : '?'}
                </Avatar>
              )}
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
              }
            }}
          >
            {/* Informações do usuário no menu */}
            {patientData && (
              <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {patientData.full_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {patientData.email}
                </Typography>
              </Box>
            )}
            
            <MenuItem onClick={() => { handleNavigation(`${url}/perfil`); handleMenuClose(); }}>
              <AccountIcon sx={{ mr: 1 }} />
              Meu Perfil
            </MenuItem>
            
            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <LogoutIcon sx={{ mr: 1 }} />
              Sair
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}