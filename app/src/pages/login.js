import Head from 'next/head';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
  
    console.log('Tentando login com:', { username, password }); // Log de entrada
  
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const result = await response.json();
      console.log('Resposta do servidor:', result);
  
      if (!response.ok) {
        alert(result.message);
        return;
      }
  
      alert(`Bem-vindo, ${result.user.username}!`);
      window.location.href = '/admin';
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro ao tentar fazer login.');
    }
  };
  

  return (
    <>
      <Head>
        <title>Educação Especial - Login</title>
        <meta name="description" content="Página de login do sistema de Educação Especial" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#00C4FF' }}>
        <form onSubmit={handleLogin} className="p-4 bg-white rounded shadow" style={{ width: '350px' }}>
          <div className="text-center mb-3">
            <img
              src="/img/login.jpg"
              alt="Educação Especial"
              style={{ width: '100px' }}
            />
            <h5 className="mt-2">Educação Especial</h5>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="username" className="form-label">Usuário</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              placeholder="Digite seu usuário"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password" className="form-label">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Digite sua senha"
              required
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">Entrar</button>
          </div>
          <div className="text-center mt-3">
            <Link href="/forgot-password" className="text-decoration-none">Esqueceu a senha?</Link>
          </div>
          <div className="text-center mt-2">
            <Link href="/register" className="text-decoration-none">Não tem uma conta? Cadastre-se aqui</Link>
          </div>
        </form>
      </div>
    </>
  );
}