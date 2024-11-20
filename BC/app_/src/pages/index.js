import NavHome from '@/components/NavHome';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>APP-BC</title>
        <meta name="description" content="Sistema de Base de Conhecimentos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <NavHome />
      </div>

      {/* Fundo azul com conteúdo centralizado */}
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#00C4FF' }}>
        <div className="container text-center text-white py-5 rounded shadow" style={{ backgroundColor: '#ffffff80', maxWidth: '600px' }}>
          <div className="row">
            <h1 className="display-4 fw-bold">Sistema de Base de Conhecimentos</h1>
            <p className="lead mt-3">
              Bem-vindo ao APP-BC! Um sistema criado para gerenciar informações de maneira eficiente e intuitiva. Explore e utilize as ferramentas disponíveis.
            </p>
            <div className="d-flex justify-content-center mt-4">
              <a href="/login" className="btn btn-primary btn-lg mx-2 shadow-sm">
                Entrar
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos personalizados */}
      <style jsx>{`
        h1 {
          color: #ffffff;
        }
        p {
          font-size: 1.2rem;
        }
        a.btn {
          font-size: 1rem;
          padding: 0.8rem 2rem;
          text-transform: uppercase;
          border-radius: 50px;
          transition: transform 0.3s ease, background-color 0.3s ease;
        }
        a.btn:hover {
          transform: scale(1.05);
        }
        .btn-primary {
          background-color: #0062cc;
          border-color: #0056b3;
        }
        .btn-primary:hover {
          background-color: #0056b3;
        }
        .btn-outline-light {
          color: #ffffff;
          border-color: #ffffff;
        }
        .btn-outline-light:hover {
          background-color: #ffffff;
          color: #0062cc;
        }
      `}</style>
    </>
  );
}
