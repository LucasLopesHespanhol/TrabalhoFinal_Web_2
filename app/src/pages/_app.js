import "bootstrap/dist/css/bootstrap.min.css"; // Importando o Bootstrap
import Head from "next/head"; // Importando Head para configurações de SEO/meta tags
import '../styles/globals.css'; // CSS global
import '../styles/Users.css'; // Seu arquivo CSS global de usuários

// Função principal App
function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Responsividade */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} /> {/* Renderizando o componente da página */}
    </>
  );
}

export default App; // Exportando o componente App corretamente
