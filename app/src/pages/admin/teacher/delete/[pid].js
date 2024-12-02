import NavAdmin from '@/components/NavAdmin';
import Head from 'next/head';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { useRouter } from 'next/router';

export default function DeleteTeacher() {
  const API_URL = "http://localhost:8080/api/teachers/";

  const [teacher, setTeacher] = useState({
    name: "",
    contact: "",
    phone_number: "",
    school_disciplines: "",
    status: "",
    created_at: ""
  });

  const [message, setMessage] = useState({ message: "", status: "" });
  const router = useRouter();
  const { pid } = router.query;

  // Função para buscar os dados do professor
  useEffect(() => {
    if (!pid) return;  // Verifica se o PID foi passado pela URL

    const getTeacher = async () => {
      try {
        const response = await Axios.get(`${API_URL}${pid}`);
        setTeacher(response.data);
      } catch (error) {
        console.error('Erro ao carregar os dados do professor:', error);
        setMessage({ message: "Erro ao carregar os dados do professor", status: "error" });
      }
    };

    getTeacher();
  }, [pid]);

  // Função para excluir o professor
  const handleDeleteTeacher = async () => {
    try {
      const response = await Axios.delete(`${API_URL}${pid}`);
      setMessage({ message: response.data.message, status: "ok" });

      // Redireciona para a lista de professores após a exclusão
      setTimeout(() => {
        router.push("/admin/teacher");
      }, 1500); // Aguarda 1.5 segundos antes de redirecionar
    } catch (error) {
      console.error('Erro ao deletar o professor:', error);
      setMessage({ message: "Erro ao deletar o professor", status: "error" });
    }
  };

  return (
    <>
      <Head>
        <title>APP-BC - Deletar Professor</title>
        <meta name="description" content="Deletar Professor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <NavAdmin />
        {
          message.status === "ok" ?
          <div className="alert alert-success" role="alert">
            {message.message}
          </div> : 
          message.status === "error" ?
          <div className="alert alert-danger" role="alert">
            {message.message}
          </div> : ""
        }
      </div>

      <div className="d-flex justify-content-center p-4">
        <div className="container">
          <div className="row mb-4">
            <h3 className="text-center">Deletar Professor</h3>
          </div>

          <div className="row">
            <div className="col-12">
              <table className="table table-striped table-bordered">
                <thead className="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Contato</th>
                    <th scope="col">Telefone</th>
                    <th scope="col">Data de Criação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">{teacher._id}</th>
                    <td>{teacher.name}</td>
                    <td>{teacher.contact}</td>
                    <td>{teacher.phone_number}</td>
                    <td>{new Date(teacher.created_at).toLocaleDateString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Confirmar ou cancelar exclusão */}
          <div className="row mt-4">
            <div className="col-12 text-center">
              <button
                      className="btn btn-danger"
                        onClick={handleDeleteTeacher}
                      >
                        Deletar
                      </button>
              <a href="/admin/teacher" className="btn btn-secondary ms-2">
                Voltar
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

//henrique isso é para saber estilo dos botoes xd falar com eu/ 
/* <button className="btn btn-outline-danger" type="button" onClick={handleDeleteUser} >Deletar</button>
<Link className="btn btn-outline-info" href="/admin/users">Voltar</Link>
*/