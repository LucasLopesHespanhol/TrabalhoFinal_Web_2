import Axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import UserAction from '@/components/UserAction';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MenuUsers from '@/components/MenuUsers';

export default function Users() {

  const API_URL = "http://localhost:8080/api/users";
  
  const [users, setUsers] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); // Para armazenar o valor do campo de pesquisa
  const [searchType, setSearchType] = useState("id"); // Tipo de pesquisa: id, nome ou data
  const [startDate, setStartDate] = useState(""); // Data inicial para pesquisa
  const [endDate, setEndDate] = useState(""); // Data final para pesquisa
  const [errorMessage, setErrorMessage] = useState(""); // Para armazenar a mensagem de erro

  const searchUsers = async () => {
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
  
      setUsers(response.data.foundUsers || [response.data.foundedUser]);
    } catch (error) {
      const backendMessage = error.response?.data?.message || 'Erro ao buscar os usuários.';
      setErrorMessage(backendMessage); // Define a mensagem de erro
    }
  };
  

  // Função para buscar todos os usuários ao carregar a página
  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await Axios.get(API_URL);
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao buscar os usuários:', error);
      }
    };

    getAllUsers();
  }, []);

  // Função para limpar a pesquisa
  const clearSearch = async () => {
    setSearchTerm("");  // Limpar o termo de pesquisa
    setStartDate("");   // Limpar data inicial
    setEndDate("");     // Limpar data final
    setErrorMessage(""); // Limpar a mensagem de erro
  
    try {
      const response = await Axios.get(API_URL); // Buscar todos os usuários novamente
      setUsers(response.data); // Atualiza os resultados
    } catch (error) {
      console.error('Erro ao buscar os usuários:', error);
    }
  };

  return (
    <>
      <Head>
        <title>APP-BC - Usuários</title>
        <meta name="description" content="Lista de usuários no painel de administração" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div>
        <NavAdmin />
        <MenuUsers />
      </div>

      <div className="d-flex justify-content-center p-4">
        <div className="container">
          <div className="row mb-4">
            <h3 className="text-center text-primary">Lista de Usuários</h3>
          </div>

          {/* Indicador Dinâmico de Tipo de Pesquisa */}
          <div className="row mb-4">
            <div className="col-12 d-flex justify-content-center">
              {/* Indicador de Tipo de Pesquisa */}
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
              {/* Botões de Pesquisa Lado a Lado */}
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
                    placeholder={searchType === "id" ? "Digite o ID do usuário" : "Digite o nome do usuário"}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado conforme o usuário digita
                  />
                )}
              </div>
              
              {/* Botões de Ação */}
              <button
                className="btn btn-primary ms-3"
                onClick={searchUsers} // Chama a função de pesquisa
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
          <div className="row">
            <div className="col-12">
              <table className="table table-striped table-bordered shadow-lg">
                <thead className="table-light">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nome</th>
                    <th scope="col">E-mail</th>
                    <th scope="col">Data de Criação</th>
                    <th scope="col">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map(user => (
                      <tr key={user._id}>
                        <th scope="row">{user._id}</th>
                        <td>{user.author_name}</td>
                        <td>{user.author_email}</td>
                        <td>{new Date(user.author_create_date).toLocaleDateString()}</td>
                        <td>
                          <UserAction pid={user._id} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">Nenhum usuário encontrado</td>
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
