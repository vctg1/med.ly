import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar se há token válido no localStorage ao inicializar
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userType = localStorage.getItem('user_type');
    const userData = localStorage.getItem('user_data');

    if (token && userType && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setUser({
          ...parsedUserData,
          type: userType
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      // Armazenar dados no localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_type', data.user_type);
      localStorage.setItem('user_data', JSON.stringify(data.user_data));

      // Atualizar estado
      setUser({
        ...data.user_data,
        type: data.user_type
      });
      setIsAuthenticated(true);

      // Redirecionar baseado no tipo de usuário
      const redirectPath = data.user_type === 'patient' ? '/dashboard-paciente' : '/dashboard';
      navigate(redirectPath);

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Limpar localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_data');
    
    // Limpar estado
    setUser(null);
    setIsAuthenticated(false);
    
    // Redirecionar para home
    navigate('/');
  };
  const registerPatient = async (patientData) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register/patient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }
      const data = await response.json();
      console.log('Registration successful:', data);
      await login(patientData.email, patientData.password);
      navigate('/dashboard-paciente');
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const registerDoctor = async (doctorData) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register/doctor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }
      const data = await response.json();
      console.log('Registration successful:', data);
      await login(doctorData.email, doctorData.password);
      setIsAuthenticated(true);
      // Redirecionar para o dashboard do médico
      navigate('/dashboard');
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  


  const getToken = () => {
    return localStorage.getItem('access_token');
  };

  const getUserType = () => {
    return localStorage.getItem('user_type');
  };

  const isPatient = () => {
    return getUserType() === 'patient';
  };

  const isDoctor = () => {
    return getUserType() === 'doctor';
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    getToken,
    getUserType,
    isPatient,
    isDoctor,
    registerPatient,
    registerDoctor
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;