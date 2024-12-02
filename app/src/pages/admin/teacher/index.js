import Axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import TeacherAction from '@/components/TeacherAction'; // Reutilizado para ações dos professores
import Head from 'next/head';
import { useEffect, useState } from 'react';
import MenuTeacher from '@/components/MenuTeacher';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Teachers() {
  const API_URL = "http://localhost:8080/api/teachers"; // Alterado para professores
  
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("id");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Indicador de carregamento

  const searchTeachers = async () => {
    setErrorMessage("");
    setLoading(true); // Ativa o estado de carregamento

    if (!searchTerm && searchType === "id") {
      setErrorMessage('Por favor, digite um ID para pesquisar.');
      setLoading(false);
      return;
    }

    if (!searchTerm && searchType === "name") {
      setErrorMessage('Por favor, digite um nome para pesquisar.');
      setLoading(false);
      return;
    }

    if (searchType === "date" && (!startDate || !endDate)) {
      setErrorMessage('Por favor, preencha ambos os campos de data.');
      setLoading(false);
      return;
    }

    try {
      let response;
      if (searchType === "id") {
        // Verifica se o ID está no formato correto (ObjectId do MongoDB)
        if (!/^[a-fA-F0-9]{24}$/.test(searchTerm)) {
          setErrorMessage('O ID inválido.');
          setLoading(false);
          return;
        }

        response = await Axios.get(`${API_URL}/${searchTerm}`);
        setTeachers([response.data.foundedTeacher || response.data]); // Ajustar conforme o nome da chave no retorno
      } else if (searchType === "name") {
        response = await Axios.get(`${API_URL}/name/${searchTerm}`);
        setTeachers(response.data.foundTeachers || []);
      } else if (searchType === "date") {
        const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
        const formattedEndDate = new Date(endDate).toISOString().split('T')[0];
        response = await Axios.get(`${API_URL}/date?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
        setTeachers(response.data.foundTeachers || []);
      }
    } catch (error) {
      const backendMessage = error.response?.data?.message || 'Erro ao buscar os professores.';
      setErrorMessage(backendMessage);
    } finally {
      setLoading(false); // Desativa o estado de carregamento
    }
  };

  useEffect(() => {
    const getAllTeachers = async () => {
      setLoading(true);
      try {
        const response = await Axios.get(API_URL);
        setTeachers(response.data || []);
      } catch (error) {
        console.error('Erro ao buscar os professores:', error);
      } finally {
        setLoading(false);
      }
    };

    getAllTeachers();
  }, []);

  const clearSearch = async () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await Axios.get(API_URL);
      setTeachers(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar os professores:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>APP-BC - Professores</title>
        <meta name="description" content="Lista de professores no painel de administração" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div>
        <NavAdmin />
        <MenuTeacher />
      </div>

      <div className="d-flex justify-content-center p-4">
        <div className="container">
          <div className="row mb-4">
            <h3 className="text-center text-primary">Lista de Professores</h3>
          </div>

          <div className="row mb-4">
            <div className="col-12 d-flex justify-content-center align-items-center">
              {/* Tipo de Pesquisa */}
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn btn-outline-primary ${searchType === "id" ? "active" : ""}`}
                  onClick={() => setSearchType("id")}
                >
                  ID
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-success ${searchType === "name" ? "active" : ""}`}
                  onClick={() => setSearchType("name")}
                >
                  Nome
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-warning ${searchType === "date" ? "active" : ""}`}
                  onClick={() => setSearchType("date")}
                >
                  Data
                </button>
              </div>

              {/* Campo de Pesquisa */}
              <div className="ms-3">
                {searchType === "date" ? (
                  <>
                    <input
                      type="date"
                      className="form-control w-100 me-2"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                      type="date"
                      className="form-control w-100 me-2"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </>
                ) : (
                  <input
                    type="text"
                    className="form-control w-100"
                    placeholder={searchType === "id" ? "Digite o ID" : "Digite o nome"}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                )}
              </div>

              <button className="btn btn-primary ms-3" onClick={searchTeachers}>
                Pesquisar
              </button>
              <button className="btn btn-danger ms-2" onClick={clearSearch}>
                Limpar
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              </div>
            </div>
          )}

          {/* Tabela de Professores */}
          <div className="row">
            <div className="col-12">
              {loading ? (
                <div className="text-center">Carregando...</div>
              ) : (
                <table className="table table-striped table-bordered shadow-lg">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Nome</th>
                      <th>Contato</th>
                      <th>Telefone</th>
                      <th>Data de Criação</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.length > 0 ? (
                      teachers.map((teacher) => (
                        teacher && (
                          <tr key={teacher._id}>
                            <th>{teacher._id}</th>
                            <td>{teacher.name}</td>
                            <td>{teacher.contact}</td>
                            <td>{teacher.phone_number}</td>
                            <td>{teacher.created_at ? new Date(teacher.created_at).toLocaleDateString() : "N/A"}</td>
                            <td>
                              <TeacherAction pid={teacher._id} />
                            </td>
                          </tr>
                        )
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">Nenhum professor encontrado</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}