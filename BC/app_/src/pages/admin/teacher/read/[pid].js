import NavAdmin from '@/components/NavAdmin'
import MenuUsers from '@/components/MenuTeacher';
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { useRouter } from 'next/router';

export default function readTeacher() {
  
  const API_URL = "http://localhost:8080/api/teachers/"  // Alterado para professores

  const [teacher, setTeacher] = useState({
    name: "",
    school_disciplines: "",
    contact: "",
    phone_number: "",
    status: "",
    created_at: ""
  });

  const router = useRouter();
  const [pid] = useState(router.query.pid);

  const [message, setMessage] = useState({ message: "", status: "" });

  const optionsStatus = [
    { value: '', text: '-- Selecione um estado --' },
    { value: 'active', text: 'Ativo' },  // Ajustado para "Ativo"
    { value: 'inactive', text: 'Inativo' },  // Ajustado para "Inativo"
  ];

  useEffect(() => {
    const getTeacher = async () => {
      try {
        const response = await Axios.get(API_URL + pid);
        setMessage({ message: response.data.message, status: "ok" });
        setTeacher(response.data.foundedTeacher);  // Alterado para professor
      } catch (error) {
        console.error('Erro ao buscar o professor:', error);
        setMessage({ message: "Erro ao buscar o professor!", status: "error" });
      }
    };

    if (pid) {
      getTeacher();
    }
  }, [pid]);

  return (
    <>
      <Head>
        <title>APP-BC</title>
        <meta name="description" content="Detalhes do professor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <NavAdmin />
        {message.status === "" ? "" :
          message.status === "ok" ? "" :
            <div className='alert alert-danger' role='alert'>
              {message.message} <Link className='alert-link' href='/admin/teachers'>Voltar</Link>
            </div>
        }
      </div>

      <div className="d-flex justify-content-center p-2">
        <div className="container">
          <div className="row border-bottom">
            <h3> Detalhes do Professor </h3> {/* Alterado para Professor */}
            <form>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Nome</label>
                <input type="text" id="name" name="name" className="form-control" value={teacher.name} readOnly />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="school_disciplines">Disciplinas</label>
                <input type="text" id="school_disciplines" name="school_disciplines" className="form-control" value={teacher.school_disciplines} readOnly />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact">Contato</label>
                <input type="text" id="contact" name="contact" className="form-control" value={teacher.contact} readOnly />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="phone_number">Telefone</label>
                <input type="text" id="phone_number" name="phone_number" className="form-control" value={teacher.phone_number} readOnly />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="status">Status</label>
                <select className="form-select" id="status" name="status" value={teacher.status} readOnly>
                  {optionsStatus.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="created_at">Data de Criação</label>
                <input type="text" id="created_at" name="created_at" className="form-control" value={new Date(teacher.created_at).toLocaleDateString()} readOnly />
              </div>
              <div className="form-group p-2">
                <Link className="btn btn-outline-info" href="/admin/teacher">Voltar</Link> {/* Alterado para Professores */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
