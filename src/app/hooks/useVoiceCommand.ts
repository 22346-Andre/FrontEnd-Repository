import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useRef, useState, useEffect } from 'react';

export const useVoiceCommand = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Verifica se o navegador suporta mal a página carrega
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const toggleListening = () => {
    if (!isSupported) {
      toast.error('Seu navegador não possui suporte nativo à voz. Recomendamos o uso do Google Chrome.');
      return;
    }

    // Se já estiver a escutar e o usuário clicar de novo, nós desligamos
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'pt-BR'; 
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        toast.dismiss(); 
        const text = event.results[0][0].transcript.toLowerCase();
        toast.success(`Entendido: "${text}"`);

        // Navegação Rápida
        if (text.includes('dashboard') || text.includes('painel')) navigate('/dashboard');
        else if (text.includes('relatório')) navigate('/relatorios');
        else if (text.includes('sugestões') || text.includes('compra')) navigate('/sugestoes-compra');
        else if (text.includes('importação')) navigate('/importacao');
        else if (text.includes('scanner') || text.includes('pdv')) navigate('/scanner');
        else if (text.includes('configurações')) navigate('/configuracoes');
        
        // Buscas de Fornecedor
        else if (text.includes('fornecedor') || text.includes('fornecedores')) {
          const termo = text.replace(/buscar|procurar|encontrar|fornecedores|fornecedor|ir para/gi, '').trim();
          navigate(`/fornecedores?q=${termo}`); 
        } 
        // Buscas de Produto
        else if (text.includes('buscar') || text.includes('procurar') || text.includes('produto')) {
          const termo = text.replace(/buscar|procurar|encontrar|produto|produtos|ir para/gi, '').trim();
          navigate(`/produtos?q=${termo}`); 
        } 
        else {
          toast.warning('Comando não reconhecido. Tente "Buscar Arroz".');
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        toast.dismiss();
        if (event.error === 'not-allowed') {
          toast.error('Microfone bloqueado! Libere o acesso no ícone de cadeado na barra de endereços.');
        } else if (event.error === 'no-speech') {
          toast.info('Nenhuma voz detectada. O assistente foi desligado.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();

    } catch (err) {
      setIsListening(false);
      toast.error('Ocorreu um erro interno. Atualize a página.');
    }
  };

  return { toggleListening, isListening, isSupported };
};