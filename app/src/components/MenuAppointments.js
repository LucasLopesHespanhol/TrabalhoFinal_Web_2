import Link from "next/link";

export default function MenuEvents() {
  return (
    <div className="d-flex justify-content-start">
      <div className="p-2">
        {/* Botão para a criação de novos professores */}
        <Link 
          className="btn btn-lg btn-primary rounded-3 shadow-lg text-white hover-custom" 
          href="/admin/appointments/create">
          Cadastrar Novo Compromisso
        </Link>
      </div>
    </div>
  );
}
