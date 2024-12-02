import Axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import EventsAction from '@/components/EventsAction';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MenuEvents from '@/components/MenuEvents';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Events() {

  const API_URL = "http://localhost:8080/api/events";
  
  const [events, setEvents] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); // Para armazenar o valor do campo de pesquisa
  const [searchType, setSearchType] = useState("id"); // Tipo de pesquisa: id, descrição ou data
  const [startDate, setStartDate] = useState(""); // Data inicial para pesquisa
  const [endDate, setEndDate] = useState(""); // Data final para pesquisa
  const [errorMessage, setErrorMessage] = useState(""); // Para armazenar a mensagem de erro

  const searchEvents = async () => {
    setErrorMessage(""); // Limpar mensagens de erro ao iniciar a pesquisa
  
    // Verificar se os campos de pesquisa estão preenchidos
    if (!searchTerm && searchType === "id") {
      setErrorMessage('Por favor, digite um ID para pesquisar.');
      return;
    }
  
    if (!searchTerm && searchType === "description") {
      setErrorMessage('Por favor, digite uma descrição para pesquisar.');
      return;
    }
  
    if (searchType === "date" && (!startDate || !endDate)) {
      setErrorMessage('Por favor, preencha ambos os campos de data.');
      return;
    }
  
    try {
      let response;
  
      if (searchType === "id") {
        // Pesquisa por ID
        response = await Axios.get(`${API_URL}/${searchTerm}`);
        setEvents([response.data]); // Transformar em array para renderizar corretamente
      } else {
        // Pesquisa com query params
        const params = {
          searchType,
          searchTerm: searchType === "date" ? undefined : searchTerm,
          startDate: searchType === "date" ? startDate : undefined,
          endDate: searchType === "date" ? endDate : undefined,
        };
  
        response = await Axios.get(API_URL, { params });
        setEvents(response.data); // Atualizar os eventos retornados
      }
    } catch (error) {
      const backendMessage = error.response?.data?.message || 'Erro ao buscar os eventos.';
      setErrorMessage(backendMessage); // Define a mensagem de erro
    }
  };

  // Função para buscar todos os eventos ao carregar a página
  useEffect(() => {
    const getAllEvents = async () => {
      try {
        const response = await Axios.get(API_URL);
        setEvents(response.data);
      } catch (error) {
        console.error('Erro ao buscar os eventos:', error);
      }
    };

    getAllEvents();
  }, []);

  // Função para limpar a pesquisa
  const clearSearch = async () => {
    setSearchTerm("");  // Limpar o termo de pesquisa
    setStartDate("");   // Limpar data inicial
    setEndDate("");     // Limpar data final
    setErrorMessage(""); // Limpar a mensagem de erro
  
    try {
      const response = await Axios.get(API_URL); // Buscar todos os eventos novamente
      setEvents(response.data); // Atualiza os resultados
    } catch (error) {
      console.error('Erro ao buscar os eventos:', error);
    }
  };

  return (
    <>
      <Head>
        <title>APP-BC - Eventos</title>
        <meta name="description" content="Lista de eventos no painel de administração" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div>
        <NavAdmin />
        <MenuEvents />
      </div>

      <div className="d-flex justify-content-center p-4">
        <div className="container">
          <div className="row mb-4">
            <h3 className="text-center text-primary">Lista de Eventos</h3>
          </div>

          {/* Indicador Dinâmico de Tipo de Pesquisa */}
          <div className="row mb-4">
            <div className="col-12 d-flex justify-content-center">
              {/* Indicador de Tipo de Pesquisa */}
              <div className="d-flex align-items-center">
                <span className="me-2 text-muted">{searchType === "id" ? "Pesquisando por ID" : searchType === "description" ? "Pesquisando por Descrição" : "Pesquisando por Data"}</span>
                <button
                  className="btn btn-secondary"
                  onClick={() => setSearchType(searchType === "id" ? "description" : searchType === "description" ? "date" : "id")}
                >
                  {searchType === "id" ? "Mudar para Descrição" : searchType === "description" ? "Mudar para Data" : "Mudar para ID"}
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
                  className={`btn btn-outline-success ${searchType === "description" ? "active" : ""}`}
                  onClick={() => setSearchType("description")}
                >
                  <i className="bi bi-info-circle" /> Descrição
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
                    placeholder={searchType === "id" ? "Digite o ID do evento" : "Digite a descrição do evento"}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado conforme o usuário digita
                  />
                )}
              </div>
              
              {/* Botões de Ação */}
              <button
                className="btn btn-primary ms-3"
                onClick={searchEvents} // Chama a função de pesquisa
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
                    <th scope="col">Descrição</th>
                    <th scope="col">Comentários</th>
                    <th scope="col">Data</th>
                    <th scope="col">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length > 0 ? (
                    events.map(event => (
                      <tr key={event._id}>
                        <th scope="row">{event._id}</th>
                        <td>{event.description}</td>
                        <td>{event.comments}</td>
                        <td>{new Date(event.date).toLocaleString()}</td>
                        <td>
                          <EventsAction pid={event._id} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        Não há eventos para exibir.
                      </td>
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
