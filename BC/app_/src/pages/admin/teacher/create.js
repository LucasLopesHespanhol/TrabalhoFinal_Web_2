import NavAdmin from '@/components/NavAdmin';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Axios from 'axios';
import MenuTeacher from '@/components/MenuTeacher';

export default function CreateTeacher() {
  const API_URL = "http://localhost:8080/api/teachers"; // URL para professores

  const [teacher, setTeacher] = useState({
    name: "",  // Alterado para 'name', conforme esperado no backend
    school_disciplines: "",  // Alterado para 'school_disciplines'
    contact: "",  // Alterado para 'contact'
    phone_number: "",  // Alterado para 'phone_number'
    status: "",  // Alterado para 'status'
  });

  const [message, setMessage] = useState({ message: "", status: "" });

  const optionsStatus = [
    { value: '', text: '-- Selecione um estado --' },
    { value: 'true', text: 'Ativo' },
    { value: 'false', text: 'Inativo' },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTeacher({
      ...teacher,
      [name]: value
    });
  };

  const handleCreateTeacher = async () => {
    try {
      // Verificar se todos os campos obrigatórios foram preenchidos
      if (!teacher.name || !teacher.school_disciplines || !teacher.contact || !teacher.phone_number || teacher.status === '') {
        setMessage({ message: "Por favor, preencha todos os campos obrigatórios.", status: "error" });
        return;
      }

      // Envia os dados no formato correto
      const response = await Axios.post(API_URL, teacher);
      setMessage({ message: response.data.message, status: "ok" });
    } catch (error) {
      console.error('Erro ao criar o Professor:', error.response || error.request);
      
      // Verifica se é um erro 404 e exibe uma mensagem apropriada
      if (error.response && error.response.status === 404) {
        setMessage({ message: "API não encontrada. Verifique se o servidor está em execução.", status: "error" });
      } else {
        setMessage({ message: "Erro ao criar o Professor!", status: "error" });
      }
    }
  };

  return (
    <>
      <Head>
        <title>APP-BC - Cadastro de Professor</title> {/* Alterado para Cadastro de Professor */}
        <meta name="description" content="Cadastro de um novo professor no sistema" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <NavAdmin />
        <MenuTeacher />
        {
          message.status === "" ? "" :
            message.status === "ok" ?
              <div className='alert alert-success' role='alert'>
                {message.message} <Link className='alert-link' href='/admin/teacher'>Voltar</Link>
              </div> :
              <div className='alert alert-danger' role='alert'>
                {message.message} <Link className='alert-link' href='/admin/teacher'>Voltar</Link>
              </div>
        }
      </div>

      <div className="d-flex justify-content-center p-2">
        <div className="container">
          <div className="row border-bottom">
            <h3> Cadastro de Professor </h3> {/* Alterado para Professor */}

            <form method="POST">
              <div className="form-group">
                <label className="form-label" htmlFor="teacher_name">Nome</label>
                <input type="text" id="teacher_name" name="name" className="form-control" value={teacher.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="teacher_school_disciplines">Disciplina</label>
                <input type="text" id="teacher_school_disciplines" name="school_disciplines" className="form-control" value={teacher.school_disciplines} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="teacher_contact">Contato</label>
                <input type="text" id="teacher_contact" name="contact" className="form-control" value={teacher.contact} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="teacher_phone_number">Telefone</label>
                <input type="text" id="teacher_phone_number" name="phone_number" className="form-control" value={teacher.phone_number} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="teacher_status">Status</label>
                <select className="form-select" id="teacher_status" name="status" value={teacher.status} onChange={handleChange}>
                  {optionsStatus.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group p-2">
                <button className="btn btn-outline-success" type="button" onClick={handleCreateTeacher}>Salvar</button>
                <Link className="btn btn-outline-info" href="/admin/teacher">Voltar</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
