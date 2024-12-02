import NavAdmin from '@/components/NavAdmin';
import TeacherAction from '@/components/TeacherAction'; // Reutilizado para ações dos professores
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { useRouter } from 'next/router';

export default function UpdateTeacher() {
  const API_URL = "http://localhost:8080/api/teachers/";

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
    { value: 'active', text: 'Ativo' },
    { value: 'inactive', text: 'Inativo' },
  ];

  useEffect(() => {
    const getTeacher = async () => {
      try {
        const response = await Axios.get(API_URL + pid);
        if (response.data) {
          setTeacher(response.data);  // Atribui os dados do professor
          setMessage({ message: "Professor carregado com sucesso!", status: "ok" });
        } else {
          setMessage({ message: "Professor não encontrado.", status: "error" });
        }
      } catch (error) {
        console.error('Erro ao buscar o professor:', error);
        setMessage({ message: "Erro ao buscar o professor!", status: "error" });
      }
    };

    if (pid) {
      getTeacher();
    }
  }, [pid]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTeacher({
      ...teacher,
      [name]: value
    });
  };

  const handleUpdateTeacher = async () => {
    try {
      const response = await Axios.put(API_URL + pid, teacher);
      setMessage({ message: response.data.message || "Professor atualizado com sucesso!", status: "ok" });
    } catch (error) {
      console.error('Erro ao atualizar o Professor:', error);
      setMessage({ message: "Erro ao atualizar o Professor!", status: "error" });
    }
  };

  return (
    <>
      <Head>
        <title>APP-BC - Editar Professor</title>
        <meta name="description" content="Edição de professor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <NavAdmin />
        {
          message.status === "" ? "" :
          message.status === "ok" ? <div className='alert alert-success' role='alert'> {message.message} <Link className='alert-link' href='/admin/teacher'>Voltar</Link></div> :
          <div className='alert alert-danger' role='alert'> {message.message} <Link className='alert-link' href='/admin/teacher'>Voltar</Link></div>
        }
      </div>

      <div className="d-flex justify-content-center p-2">
        <div className="container">
          <div className="row border-bottom">
            <h3> Edição de Professor </h3>

            <form method="POST">
              <div className="form-group">
                <label className="form-label" htmlFor="name">Nome</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={teacher.name || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="school_disciplines">Disciplinas</label>
                <input
                  type="text"
                  id="school_disciplines"
                  name="school_disciplines"
                  className="form-control"
                  value={teacher.school_disciplines || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact">Contato</label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  className="form-control"
                  value={teacher.contact || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="phone_number">Telefone</label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  className="form-control"
                  value={teacher.phone_number || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="status">Status</label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={teacher.status || ""}
                  onChange={handleChange}
                >
                  {optionsStatus.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="created_at">Data de Criação</label>
                <input
                  type="text"
                  id="created_at"
                  name="created_at"
                  className="form-control"
                  value={teacher.created_at ? new Date(teacher.created_at).toLocaleDateString() : ""}
                  readOnly
                />
              </div>
              <div className="form-group p-2">
                <button className="btn btn-outline-success" type="button" onClick={handleUpdateTeacher}>Salvar</button>
                <Link className="btn btn-secondary ms-2" href="/admin/teacher">Voltar</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}