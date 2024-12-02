import NavAdmin from '@/components/NavAdmin';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { useRouter } from 'next/router';

export default function ReadTeacher() {
  const API_URL = "http://localhost:8080/api/teachers/";

  const [teacher, setTeacher] = useState({
    name: "",
    contact: "",
    phone_number: "",
    school_disciplines: "",
    status: "",
    created_at: ""
  });

  const router = useRouter();
  const [pid, setPid] = useState("");

  const [message, setMessage] = useState({ message: "", status: "" });

  const optionsStatus = [
    { value: '', text: '-- Selecione um estado --' },
    { value: 'active', text: 'Ativo' },
    { value: 'inactive', text: 'Inativo' },
  ];

  useEffect(() => {
    // Atualiza o PID a partir da URL
    if (router.query.pid) {
      setPid(router.query.pid);
    }
  }, [router.query.pid]);

  useEffect(() => {
    const getTeacher = async () => {
      if (!pid) return; // Aguarda até que o PID esteja definido
      try {
        const response = await Axios.get(`${API_URL}${pid}`);
        console.log('Response:', response); // Verifique a resposta da API
        
        // Alteração aqui: Agora estamos acessando os dados diretamente do response.data
        if (response.data) {
          setTeacher(response.data);  // Atribua diretamente os dados do professor
          setMessage({ message: "Dados carregados com sucesso!", status: "ok" });
        } else {
          setMessage({ message: "Professor não encontrado.", status: "error" });
        }
      } catch (error) {
        console.error('Erro ao buscar o professor:', error);
        setMessage({ message: "Erro ao buscar os dados do professor!", status: "error" });
      }
    };

    getTeacher();
  }, [pid]);

  return (
    <>
      <Head>
        <title>APP-BC - Detalhes do Professor</title>
        <meta name="description" content="Detalhes do professor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <NavAdmin />
        {
          message.status === "" ? "" :
          message.status === "ok" ? "" :
          <div className='alert alert-danger' role='alert'>
            {message.message} <Link className='alert-link' href='/admin/teachers'>Voltar</Link>
          </div>
        }
      </div>

      <div className="d-flex justify-content-center p-2">
        <div className="container">
          <div className="row border-bottom">
            <h3>Detalhes do Professor</h3>
            <form>
              <div className="form-group">
                <label className="form-label" htmlFor="teacher_name">Nome</label>
                <input
                  type="text"
                  id="teacher_name"
                  name="teacher_name"
                  className="form-control"
                  value={teacher.name || ""}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="teacher_email">E-mail</label>
                <input
                  type="text"
                  id="teacher_email"
                  name="teacher_email"
                  className="form-control"
                  value={teacher.contact || ""}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="teacher_phone">Telefone</label>
                <input
                  type="text"
                  id="teacher_phone"
                  name="teacher_phone"
                  className="form-control"
                  value={teacher.phone_number || ""}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="teacher_specialty">Especialidade</label>
                <input
                  type="text"
                  id="teacher_specialty"
                  name="teacher_specialty"
                  className="form-control"
                  value={teacher.school_disciplines || ""}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="teacher_status">Status</label>
                <select
                  className="form-select"
                  id="teacher_status"
                  name="teacher_status"
                  value={teacher.status === "true" ? "active" : "inactive"}  // Ajuste aqui para 'active' ou 'inactive'
                  readOnly
                >
                  {optionsStatus.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="teacher_create_date">Data de Criação</label>
                <input
                  type="text"
                  id="teacher_create_date"
                  name="teacher_create_date"
                  className="form-control"
                  value={teacher.created_at ? new Date(teacher.created_at).toLocaleDateString() : ""}
                  readOnly
                />
              </div>
              <div className="form-group p-2">
                <Link className="btn btn-secondary ms-2" href="/admin/teacher">Voltar</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}