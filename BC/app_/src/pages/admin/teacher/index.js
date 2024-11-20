import Axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import TeacherAction from '@/components/TeacherAction'; 
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MenuTeacher from '@/components/MenuTeacher';

export default function Teachers() {
  const API_URL = "http://localhost:8080/api/teachers"; // Alterado para professores
  
  const [teachers, setTeachers] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); // Para armazenar o valor do campo de pesquisa
  const [searchType, setSearchType] = useState("id"); // Tipo de pesquisa: id, nome ou data
  const [startDate, setStartDate] = useState(""); // Data inicial para pesquisa
  const [endDate, setEndDate] = useState(""); // Data final para pesquisa
  const [errorMessage, setErrorMessage] = useState(""); // Para armazenar a mensagem de erro

  const searchTeachers = async () => {
    setErrorMessage(""); // Limpar mensagens de erro ao iniciar a pesquisa
  
    // Verificar se os campos de pesquisa estão preenchidos
    if (!searchTerm && searchType === "id") {
      setErrorMessage('Por favor, digite um ID para pesquisar.');
      return;
    }
  
    if (!searchTerm && searchType === "name") {
      setErrorMessage('Por favor, digite um nome para pesquisar.');
      return;
    }
  
    if (searchType === "date" && (!startDate || !endDate)) {
      setErrorMessage('Por favor, preencha ambos os campos de data.');
      return;
    }
  
    try {
      let response;
      if (searchType === "id") {
        response = await Axios.get(`${API_URL}/${searchTerm}`);
      } else if (searchType === "name") {
        response = await Axios.get(`${API_URL}/name/${searchTerm}`);
      } else if (searchType === "date") {
        // Formatar as datas para o formato YYYY-MM-DD
        const formattedStartDate = new Date(startDate).toISOString().split('T')[0];  // Garantir formato correto
        const formattedEndDate = new Date(endDate).toISOString().split('T')[0]; // Garantir formato correto
  
        // Enviar para o backend com os parâmetros de data corretamente formatados
        response = await Axios.get(`${API_URL}/date?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
      }
  
      setTeachers(response.data.foundTeachers || [response.data.foundedTeacher]);
    } catch (error) {
      const backendMessage = error.response?.data?.message || 'Erro ao buscar os professores.';
      setErrorMessage(backendMessage); // Define a mensagem de erro
    }
  };
  

  // Função para buscar todos os professores ao carregar a página
  useEffect(() => {
    const getAllTeachers = async () => {
      try {
        const response = await Axios.get(API_URL);
        setTeachers(response.data);
      } catch (error) {
        console.error('Erro ao buscar os professores:', error);
      }
    };

    getAllTeachers();
  }, []);

  // Função para limpar a pesquisa
  const clearSearch = async () => {
    setSearchTerm("");  // Limpar o termo de pesquisa
    setStartDate("");   // Limpar data inicial
    setEndDate("");     // Limpar data final
    setErrorMessage(""); // Limpar a mensagem de erro
  
    try {
      const response = await Axios.get(API_URL); // Buscar todos os professores novamente
      setTeachers(response.data); // Atualiza os resultados
    } catch (error) {
      console.error('Erro ao buscar os professores:', error);
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

          {/* Indicador Dinâmico de Tipo de Pesquisa */}
          <div className="row mb-4">
            <div className="col-12 d-flex justify-content-center">
              <div className="d-flex align-items-center">
                <span className="me-2 text-muted">{searchType === "id" ? "Pesquisando por ID" : searchType === "name" ? "Pesquisando por Nome" : "Pesquisando por Data"}</span>
                <button
                  className="btn btn-secondary"
                  onClick={() => setSearchType(searchType === "id" ? "name" : searchType === "name" ? "date" : "id")}
                >
                  {searchType === "id" ? "Mudar para Nome" : searchType === "name" ? "Mudar para Data" : "Mudar para ID"}
                </button>
              </div>
            </div>
          </div>

          {/* Barra de pesquisa */}
          <div className="row mb-4">
            <div className="col-12 d-flex justify-content-center align-items-center">
              <div className="btn-group" role="group" aria-label="Pesquisar por...">
                <button
                  type="button"
                  className={`btn btn-outline-primary ${searchType === "id" ? "active" : ""}`}
                  onClick={() => setSearchType("id")}
                >
                  <i className="bi bi-search" /> ID
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-success ${searchType === "name" ? "active" : ""}`}
                  onClick={() => setSearchType("name")}
                >
                  <i className="bi bi-person" /> Nome
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-warning ${searchType === "date" ? "active" : ""}`}
                  onClick={() => setSearchType("date")}
                >
                  <i className="bi bi-calendar" /> Data
                </button>
              </div>

              {/* Inputs para pesquisa */}
              <div className="ms-3">
                {searchType === "date" ? (
                  <>
                    <input
                      type="date"
                      className="form-control w-100 me-2"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)} // Atualiza a data inicial
                    />
                    <input
                      type="date"
                      className="form-control w-100 me-2"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)} // Atualiza a data final
                    />
                  </>
                ) : (
                  <input
                    type="text"
                    className="form-control w-100" // Aumenta o tamanho do campo de entrada
                    placeholder={searchType === "id" ? "Digite o ID do professor" : "Digite o nome do professor"} // Alterado para professor
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado conforme o usuário digita
                  />
                )}
              </div>
              
              {/* Botões de Ação */}
              <button
                className="btn btn-primary ms-3"
                onClick={searchTeachers} // Chama a função de pesquisa
              >
                Pesquisar
              </button>

              {/* Botão de Limpar Pesquisa */}
              <button
                className="btn btn-danger ms-2"
                onClick={clearSearch} // Chama a função para limpar a pesquisa
              >
                Limpar Pesquisa
              </button>
            </div>
            <div className="row mb-4">
              {errorMessage && (
                <div className="col-12">
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabela de Professores */}
          <div className="row">
            <div className="col-12">
              <table className="table table-striped table-bordered shadow-lg">
                <thead className="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Contato</th>
                    <th scope="col">Telefone</th>
                    <th scope="col">Data de Criação</th>
                    <th scope="col">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.length > 0 ? (
                    teachers.map((teacher) => (
                      <tr key={teacher._id}>
                        <th scope="row">{teacher._id}</th>
                        <td>{teacher.name}</td>
                        <td>{teacher.contact}</td>
                        <td>{teacher.phone_number}</td>
                        <td>{new Date(teacher.created_at).toLocaleDateString()}</td>
                        <td>
                          <TeacherAction pid={teacher._id} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">Nenhum professor encontrado</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>     
    </>
  );
}
