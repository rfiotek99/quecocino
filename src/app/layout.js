import './globals.css'
import ThemeToggle from '@/components/ThemeToggle'

export const metadata = {
  title: 'QuéCocino - Recetas con lo que tenés',
  description: 'Descubrí qué podés cocinar con los ingredientes que tenés en casa. Encontrá recetas fáciles y rápidas.',
  keywords: ['recetas', 'cocina', 'ingredientes', 'comida', 'que cocinar'],
  authors: [{ name: 'QuéCocino' }],
  creator: 'QuéCocino',
  publisher: 'QuéCocino',
  metadataBase: new URL('https://quecocino.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'QuéCocino - Recetas con lo que tenés',
    description: 'Descubrí qué podés cocinar con los ingredientes que tenés en casa',
    url: 'https://quecocino.com',
    siteName: 'QuéCocino',
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuéCocino - Recetas con lo que tenés',
    description: 'Descubrí qué podés cocinar con los ingredientes que tenés en casa',
  },
  manifest: '/manifest.json',
  themeColor: '#10B981',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'QuéCocino',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport = {
  themeColor: '#10B981',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('quecocino-theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-screen transition-colors duration-300">
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.svg" 
                  alt="QuéCocino Logo" 
                  className="w-10 h-10 rounded-xl"
                />
                <div>
                  <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    QuéCocino
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    Recetas con lo que tenés en casa
                  </p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>
        
        <main className="max-w-6xl mx-auto px-4 py-8 min-h-[calc(100vh-200px)]">
          {children}
        </main>
        
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-12">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                <img 
                  src="/logo.svg" 
                  alt="QuéCocino" 
                  className="w-6 h-6 rounded-lg"
                />
                <span>© 2024 QuéCocino</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Hecho con ❤️ para mamá
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
