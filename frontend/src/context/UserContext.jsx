import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sacrario_token');
    if (token) {
      carregarUsuario();
    } else {
      setCarregando(false);
    }
  }, []);

  async function carregarUsuario() {
    try {
      const { data } = await api.get('/auth/me');
      setUsuario(data.usuario);
      // Registrar atividade diária silenciosamente
      api.post('/perfil/atividade').catch(() => {});
    } catch {
      localStorage.removeItem('sacrario_token');
      localStorage.removeItem('sacrario_usuario');
    } finally {
      setCarregando(false);
    }
  }

  async function login(email, senha) {
    const { data } = await api.post('/auth/login', { email, senha });
    localStorage.setItem('sacrario_token', data.token);
    setUsuario(data.usuario);
    // Registrar atividade diária
    api.post('/perfil/atividade').catch(() => {});
    return data.usuario;
  }

  async function definirSenha(token, senha) {
    const { data } = await api.post('/auth/definir-senha', { token, senha });
    localStorage.setItem('sacrario_token', data.token);
    setUsuario(data.usuario);
    return data.usuario;
  }

  function logout() {
    localStorage.removeItem('sacrario_token');
    localStorage.removeItem('sacrario_usuario');
    setUsuario(null);
  }

  async function atualizarUsuario(dados) {
    setUsuario(prev => ({ ...prev, ...dados }));
  }

  return (
    <UserContext.Provider value={{
      usuario,
      carregando,
      login,
      definirSenha,
      logout,
      atualizarUsuario,
      carregarUsuario
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser deve ser usado dentro de UserProvider');
  return ctx;
}
