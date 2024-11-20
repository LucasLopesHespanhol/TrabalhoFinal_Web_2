import Link from "next/link";

export default function MenuUsers() {
  return (
    <div className="d-flex justify-content-start">
      <div className="p-2">
        {/* Botão para a criação de novos usuários */}
        <Link 
          className="btn btn-lg btn-primary rounded-3 shadow-lg text-white hover-custom" 
          href="/admin/users/create">
          Cadastrar Novo Usuario
        </Link>
      </div>
    </div>
  );
}
