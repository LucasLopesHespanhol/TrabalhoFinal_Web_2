import Axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProfessionalsAction from '@/components/ProfessionalsAction';
import MenuProfessionals from '@/components/MenuProfessionals';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Professionals() {
    const API_URL = "http://localhost:8080/api/professionals";

    const [professionals, setProfessionals] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("id");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Função para buscar profissionais
    const fetchProfessionals = async () => {
        try {
            const response = await Axios.get(API_URL);
            setProfessionals(response.data);
        } catch (error) {
            console.error("Erro ao buscar profissionais:", error);
            setErrorMessage("Erro ao buscar profissionais.");
        }
    };

    useEffect(() => {
        fetchProfessionals();
    }, []);

    const searchProfessionals = async () => {
        setErrorMessage(""); // Limpar mensagem de erro
    
        // Validação de entrada
        if (!searchTerm && (searchType === "id" || searchType === "name")) {
            setErrorMessage(`Por favor, digite um ${searchType === "id" ? "ID" : "nome"} para pesquisar.`);
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
                setProfessionals(response.data ? [response.data] : []);
            } else if (searchType === "name") {
                // Pesquisa por Nome
                response = await Axios.get(`${API_URL}?name=${searchTerm}`);
                setProfessionals(response.data || []);
            } else if (searchType === "date") {
                // Formata as datas no formato adequado (YYYY-MM-DD)
                const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
                const formattedEndDate = new Date(endDate).toISOString().split('T')[0];
                response = await Axios.get(`${API_URL}/date?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
                setProfessionals(response.data.foundProfessionals || []);
            } else {
                setErrorMessage("Tipo de pesquisa inválido.");
            }
        } catch (error) {
            const backendMessage = error.response?.data?.message || "Erro ao buscar profissionais.";
            setErrorMessage(backendMessage);
        }
    };    

    const clearSearch = async () => {
        setSearchTerm("");
        setStartDate("");
        setEndDate("");
        setErrorMessage("");
        fetchProfessionals();
    };

    return (
        <>
            <Head>
                <title>Admin - Profissionais</title>
            </Head>
            <NavAdmin />
            <MenuProfessionals />
            <div className="d-flex justify-content-center p-4">
                <div className="container">
                    <h3 className="text-center text-primary">Lista de Profissionais</h3>

                    {/* Exibição de Mensagem de Erro */}
                    {errorMessage && (
                        <div className="alert alert-danger">
                            {errorMessage}
                        </div>
                    )}

                    <div className="row mb-4">
                        <div className="col-12 d-flex justify-content-center">
                            <div className="d-flex align-items-center">
                                <span className="me-2 text-muted">
                                    {searchType === "id"
                                        ? "Pesquisando por ID"
                                        : searchType === "name"
                                        ? "Pesquisando por Nome"
                                        : "Pesquisando por Data"}
                                </span>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setSearchType(searchType === "id" ? "name" : searchType === "name" ? "date" : "id")}
                                >
                                    {searchType === "id"
                                        ? "Mudar para Nome"
                                        : searchType === "name"
                                        ? "Mudar para Data"
                                        : "Mudar para ID"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Barra de Pesquisa */}
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
                                        placeholder={searchType === "id" ? "Digite o ID do profissional" : "Digite o nome"}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                )}
                            </div>

                            {/* Botões */}
                            <button className="btn btn-primary ms-3" onClick={searchProfessionals}>
                                Pesquisar
                            </button>
                            <button className="btn btn-danger ms-2" onClick={clearSearch}>
                                Limpar
                            </button>
                        </div>
                    </div>

                    {/* Tabela de Profissionais */}
                    <table className="table table-striped table-bordered shadow-lg">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Nome</th>
                                <th>Especialidade</th>
                                <th>Telefone</th>
                                <th>Data de Cadastro</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {professionals.length > 0 ? (
                                professionals.map((professional) => (
                                    <tr key={professional._id}>
                                        <th scope="row">{professional._id}</th>
                                        <td>{professional.name}</td>
                                        <td>{professional.specialty}</td>
                                        <td>{professional.phone_number}</td>
                                        <td>{new Date(professional.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <ProfessionalsAction pid={professional._id} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">Nenhum profissional encontrado</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}