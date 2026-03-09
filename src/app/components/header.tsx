import { useState, useEffect } from 'react';
// 🚨 Importei o ícone "Store" aqui
import { Bell, Menu, LogOut, Mic, AlertTriangle, Store } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useAuth } from '../contexts/auth-context';
import { VoiceCommandsHelp } from './voice-commands-help';
import { useVoiceCommand } from '../hooks/useVoiceCommand';
import { produtoService, Produto } from '../services/produto.service';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { toggleListening, isListening, isSupported } = useVoiceCommand();
  
  const [alertas, setAlertas] = useState<Produto[]>([]);

  useEffect(() => {
    carregarAlertas();
  }, []);

  const carregarAlertas = async () => {
    try {
      const data = await produtoService.listarCriticos();
      setAlertas(data);
    } catch (error) {
      console.error("Erro ao carregar alertas de estoque", error);
    }
  };

  return (
    <header className="h-16 border-b bg-white px-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* 🚀 A SUA LOGO AQUI (OPÇÃO 2: ÍCONE VETORIAL À PROVA DE FALHAS) */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-sm flex items-center justify-center">
            <Store className="h-5 w-5 text-white" />
          </div>
          <div className="hidden md:block flex-col">
            <h2 className="font-extrabold text-xl text-gray-900 leading-none">
              {user?.nomeFantasia || 'EstoqueMax'}
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
              Gestão de Estoque
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* BOTÃO DE MICROFONE MODERNO NO HEADER */}
        {isSupported && (
          <button
            onClick={toggleListening}
            className={`relative hidden sm:flex items-center justify-center h-9 px-4 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 text-white ring-4 ring-red-500/30 shadow-red-500/50' 
                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300' 
            }`}
            title="Assistente Virtual J.A.R.V.I.S"
          >
            <Mic className={`h-4 w-4 mr-2 ${isListening ? 'animate-pulse' : ''}`} />
            {isListening ? 'Ouvindo...' : 'Falar'}
          </button>
        )}

        {/* Botão de Ajuda de Comandos de Voz */}
        <div className="hidden lg:block">
          <VoiceCommandsHelp />
        </div>

        {/* Linha Divisória */}
        <div className="h-6 w-px bg-gray-200 hidden sm:block mx-1"></div>

        {/* 🔔 SININHO DINÂMICO E REAL */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-full">
              <Bell className="h-5 w-5 text-gray-600" />
              {alertas.length > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-white animate-pulse" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações ({alertas.length})</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-y-auto">
              
              {alertas.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm font-medium text-green-600">Tudo em dia! ✅</p>
                  <p className="text-xs text-gray-500 mt-1">Nenhum produto com estoque crítico.</p>
                </div>
              ) : (
                alertas.map((produto) => (
                  <DropdownMenuItem key={produto.id} className="p-3 cursor-default">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-gray-800">Atenção: {produto.nome}</p>
                        <p className="text-xs text-gray-500">
                          Restam apenas <span className="font-bold text-red-600">{produto.quantidade}</span> no estoque!
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              )}

            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* MENU MINHA CONTA */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2 hover:bg-gray-100 rounded-full">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-inner">
                {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden md:inline font-medium text-gray-700">{user?.nome}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer font-medium hover:bg-red-50 focus:bg-red-50 focus:text-red-700">
              <LogOut className="mr-2 h-4 w-4" />
              Sair do Sistema
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}