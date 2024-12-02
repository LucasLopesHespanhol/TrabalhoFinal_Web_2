import Axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import StudentsAction from '@/components/StudentsAction';
import MenuStudents from '@/components/MenuStudents';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Students() {
    const API_URL = "http://localhost:8080/api/students";

    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("id");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const fetchStudents = async () => {
        try {
            const response = await Axios.get(API_URL);
            setStudents(response.data);
        } catch (error) {
            console.error("Erro ao buscar estudantes:", error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const searchStudents = async () => {
        setErrorMessage("");

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
                setStudents(response.data ? [response.data] : []);
            } else if (searchType === "name") {
                // Pesquisa por Nome
                response = await Axios.get(`${API_URL}?name=${searchTerm}`);
                setStudents(response.data || []);
            } else if (searchType === "date") {
                // Pesquisa por Data
                const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
                const formattedEndDate = new Date(endDate).toISOString().split('T')[0];
                response = await Axios.get(`${API_URL}/date?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
                setStudents(response.data.foundStudents || []);
            } else {
                setErrorMessage("Tipo de pesquisa inválido.");
            }
        } catch (error) {
            const backendMessage = error.response?.data?.message || "Erro ao buscar estudantes.";
            setErrorMessage(backendMessage);
        }
    };

    const clearSearch = async () => {
        setSearchTerm("");
        setStartDate("");
        setEndDate("");
        setErrorMessage("");
        fetchStudents();
    };

    return (
        <>
            <Head>
                <title>Admin - Estudantes</title>
            </Head>
            <NavAdmin />
            <MenuStudents />
            <div className="d-flex justify-content-center p-4">
                <div className="container">
                    <h3 className="text-center text-primary">Lista de Estudantes</h3>
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
                                        placeholder={searchType === "id" ? "Digite o ID do estudante" : "Digite o nome"}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                )}
                            </div>

                            {/* Botões */}
                            <button className="btn btn-primary ms-3" onClick={searchStudents}>
                                Pesquisar
                            </button>
                            <button className="btn btn-danger ms-2" onClick={clearSearch}>
                                Limpar
                            </button>
                        </div>
                    </div>

                    {/* Tabela de Estudantes */}
                    <table className="table table-striped table-bordered shadow-lg">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Nome</th>
                                <th>Idade</th>
                                <th>Telefone</th>
                                <th>Data de Cadastro</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? (
                                students.map((student) => (
                                    <tr key={student._id}>
                                        <th scope="row">{student._id}</th>
                                        <td>{student.name}</td>
                                        <td>{student.age}</td>
                                        <td>{student.phone_number}</td>
                                        <td>{new Date(student.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <StudentsAction pid={student._id} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">Nenhum estudante encontrado</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}