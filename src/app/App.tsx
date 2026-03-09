import { RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/auth-context';
import { AccessibilityProvider } from './contexts/accessibility-context';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Carregar VLibras
    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Inicializar VLibras após o carregamento
      if ((window as any).VLibras) {
        new (window as any).VLibras.Widget('https://vlibras.gov.br/app');
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <AccessibilityProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
        {/* VLibras Widget Container */}
        <div vw="true" className="enabled">
          <div vw-access-button="true" className="active"></div>
          <div vw-plugin-wrapper="true">
            <div className="vw-plugin-top-wrapper"></div>
          </div>
        </div>
      </AuthProvider>
    </AccessibilityProvider>
  );
}