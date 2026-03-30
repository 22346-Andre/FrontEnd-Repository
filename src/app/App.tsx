import { RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/auth-context';
import { AccessibilityProvider } from './contexts/accessibility-context';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { useEffect } from 'react';
// 🚨 Importação do Provedor do Google
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App() {
  useEffect(() => {
    const scriptId = 'vlibras-script';
    const existingScript = document.getElementById(scriptId);

    // 🚨 1. Só cria o script se ele ainda não existir na página
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        // Inicializar VLibras após o carregamento
        if ((window as any).VLibras) {
          new (window as any).VLibras.Widget('https://vlibras.gov.br/app');
        }
      };
    }

    // 🚨 2. REMOVIDO o "removeChild". O script do VLibras deve permanecer na página!
  }, []);

  return (
    // 🚨 Client ID configurado na raiz do projeto
    <GoogleOAuthProvider clientId="276032801929-jtq3aoqitk13pve6kegqpl55ej8sh4mb.apps.googleusercontent.com">
      <AccessibilityProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
          
          {/* VLibras Widget Container */}
          {/* 🚨 3. Corrigido de 'data-vw' para 'vw' para o script do governo conseguir encontrar as divs */}
          {/* @ts-ignore - Ignorando o aviso do TypeScript sobre atributos customizados */}
          <div vw="true" className="enabled">
            {/* @ts-ignore */}
            <div vw-access-button="true" className="active"></div>
            {/* @ts-ignore */}
            <div vw-plugin-wrapper="true">
              <div className="vw-plugin-top-wrapper"></div>
            </div>
          </div>
          
        </AuthProvider>
      </AccessibilityProvider>
    </GoogleOAuthProvider>
  );
}