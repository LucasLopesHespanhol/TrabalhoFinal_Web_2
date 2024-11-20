import MenuAdmin from '@/components/MenuAdmin'
import NavAdmin from '@/components/NavAdmin'
import Head from 'next/head'
import Link from 'next/link'

export default function Admin() {
  return (
    <>
      <Head>
        <title>APP-BC - Painel de Administração</title>
        <meta name="description" content="Painel de administração do aplicativo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div>
        <NavAdmin />
      </div>

      <div className="container py-5">
        {/* Título Principal */}
        <div className="row mb-4">
          <div className="col text-center">
            <h3 className="display-4 text-primary">Bem-vindo ao Painel de Administração</h3>
            <p className="lead text-muted">Escolha uma das opções abaixo para gerenciar os dados</p>
          </div>
        </div>

        {/* Seção de Links para Cadastro */}
        <div className="row g-4">
          <div className="col-12 mb-3">
            <Link 
              href="/admin/teacher" 
              className="btn btn-lg w-100 rounded-3 shadow-lg text-info bg-transparent border-2 border-info hover:bg-info hover:text-white transition duration-300">
              Professores
            </Link>
          </div>
          <div className="col-12 mb-3">
            <Link 
              href="/cadastro-alunos" 
              className="btn btn-lg w-100 rounded-3 shadow-lg text-success bg-transparent border-2 border-success hover:bg-success hover:text-white transition duration-300">
              Alunos
            </Link>
          </div>
          <div className="col-12 mb-3">
            <Link 
              href="/cadastro-eventos" 
              className="btn btn-lg w-100 rounded-3 shadow-lg text-primary bg-transparent border-2 border-primary hover:bg-primary hover:text-white transition duration-300">
              Eventos
            </Link>
          </div>
          <div className="col-12 mb-3">
            <Link 
              href="/admin/users" 
              className="btn btn-lg w-100 rounded-3 shadow-lg text-warning bg-transparent border-2 border-warning hover:bg-warning hover:text-white transition duration-300">
              Usuários
            </Link>
          </div>
          <div className="col-12 mb-3">
            <Link 
              href="/cadastro-agendamentos" 
              className="btn btn-lg w-100 rounded-3 shadow-lg text-info bg-transparent border-2 border-info hover:bg-info hover:text-white transition duration-300">
              Agendamentos em Saúde
            </Link>
          </div>
          <div className="col-12 mb-3">
            <Link 
              href="/cadastro-profissionais" 
              className="btn btn-lg w-100 rounded-3 shadow-lg text-secondary bg-transparent border-2 border-secondary hover:bg-secondary hover:text-white transition duration-300">
              Profissionais em Saúde
            </Link>
          </div>
        </div>
      </div>  
    </>
  )
}
