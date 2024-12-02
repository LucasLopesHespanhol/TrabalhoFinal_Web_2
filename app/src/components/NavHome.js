import Link from "next/link";

export default function NavHome() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Título */}
        <Link className="navbar-brand fw-bold text-dark" href="/">
          <h2>GEE - Gestão de Ensino Especial</h2>
        </Link>

        {/* Botão de Login */}
        <div>
          <Link
            className="btn btn-light btn-lg px-4 rounded-pill fw-bold text-primary shadow-sm"
            href="/login"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
