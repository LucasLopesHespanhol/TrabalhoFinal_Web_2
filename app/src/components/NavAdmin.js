import Link from "next/link";

export default function NavAdmin() {
  const handleLogout = () => {
    // Aqui você pode adicionar lógica adicional, como limpar tokens ou estados locais
    console.log("Usuário deslogado"); // Apenas para teste
    window.location.href = "/"; // Redireciona para a página inicial
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary shadow-sm p-3">
      <div className="container-fluid">
        {/* Logo ou título da aplicação */}
        <Link href="/admin" className="navbar-brand text-white">
          <h3>GEE - Gestão de Ensino Especial</h3>
        </Link>

        {/* Botão de "Sair" */}
        <div className="d-flex">
          <button 
            onClick={handleLogout} 
            className="btn btn-outline-light btn-lg rounded-pill px-4 py-2"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}