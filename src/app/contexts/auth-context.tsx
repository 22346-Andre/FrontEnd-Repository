import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, LoginRequest, RegistroEmpresaDTO } from '../services/auth.service';

interface User {
  id: string;
  nome: string;
  email: string;
  nomeFantasia: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  cadastrar: (data: CadastroData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

interface CadastroData {
  nomeDono: string;
  email: string;
  senha: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  celular: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 Recupera a sessão ao atualizar a página (F5)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // 🔐 Função de Login (AGORA 100% REAL)
  const login = async (email: string, senha: string) => {
    setIsLoading(true);
    try {
      const loginRequest: LoginRequest = { email, senha };
      
      // 1. Pega o Token
      const response = await authService.login(loginRequest);
      const token = response.token || response.accessToken; 
      localStorage.setItem('token', token);
      
      // 🚨 2. ADEUS MOCK USER! Busca os dados reais de quem acabou de logar
      const dadosReais = await authService.getMe();
      
      // 3. Monta o usuário com os dados do banco de dados
      const userReal: User = {
        id: String(dadosReais.id),
        nome: dadosReais.nome,
        email: dadosReais.email,
        // Pega o nomeFantasia da empresa vinculada ao usuário
        nomeFantasia: dadosReais.empresa?.nomeFantasia || 'Minha Empresa' 
      };
      
      setUser(userReal);
      localStorage.setItem('user', JSON.stringify(userReal));
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 🏢 Função de Registo de Nova Empresa
  const cadastrar = async (data: CadastroData) => {
    setIsLoading(true);
    try {
      // Traduz do formato da tela para o formato do Java
      const registroData: RegistroEmpresaDTO = {
        nomeAdmin: data.nomeDono,          
        emailAdmin: data.email,            
        senhaAdmin: data.senha,            
        cnpj: data.cnpj,                   
        nomeEmpresa: data.razaoSocial,     
        emailContato: data.email,          
        telefoneAdmin: data.celular,
        nomeFantasia: data.nomeFantasia,
        telefoneEmpresa: data.celular
      };
      
      await authService.registrarEmpresa(registroData);
      
      // Faz login automático após sucesso no cadastro
      await login(data.email, data.senha);
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 🚪 Função de Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      cadastrar, 
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}