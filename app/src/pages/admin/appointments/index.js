import Axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import MenuAppointments from '@/components/MenuAppointments';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppointmentsAction from '@/components/AppointmentsAction';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Appointments() {
    const API_URL = "http://localhost:8080/api/appointments";

    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("id");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Carregar todos os compromissos
    const fetchAppointments = async () => {
        try {
            const response = await Axios.get(API_URL);
            setAppointments(response.data);
        } catch (error) {
            console.error("Erro ao buscar compromissos:", error);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Formatar a data para exibição como "dd/mm/yyyy"
    const formatDate = (date) => {
        const [year, month, day] = date.split("T")[0].split("-");
        return `${day}/${month}/${year}`;
    };

    const searchAppointments = async () => {
        setErrorMessage("");

        if (!searchTerm && (searchType === "id" || searchType === "student")) {
            setErrorMessage(`Por favor, digite um ${searchType === "id" ? "ID" : "aluno"} para pesquisar.`);
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
                setAppointments(response.data ? [response.data] : []);
            } else if (searchType === "student") {
                response = await Axios.get(`${API_URL}/student?student=${searchTerm}`);
                setAppointments(response.data || []);
            } else if (searchType === "date") {
                response = await Axios.get(
                    `${API_URL}/date?startDate=${startDate}&endDate=${endDate}`
                );
                setAppointments(response.data.foundAppointments || []);
            }
        } catch (error) {
            const backendMessage = error.response?.data?.message || "Erro ao buscar compromissos.";
            setErrorMessage(backendMessage);
        }
    };

    const clearSearch = async () => {
        setSearchTerm("");
        setStartDate("");
        setEndDate("");
        setErrorMessage("");
        fetchAppointments();
    };

    return (
        <>
            <Head>
                <title>Admin - Compromissos</title>
            </Head>
            <NavAdmin />
            <MenuAppointments />
            <div className="d-flex justify-content-center p-4">
                <div className="container">
                    <h3 className="text-center text-primary">Lista de Compromissos</h3>
                    <div className="row mb-4">
                        <div className="col-12 d-flex justify-content-center">
                            {/* Indicador Dinâmico de Tipo de Pesquisa */}
                            <div className="d-flex align-items-center">
                                <span className="me-2 text-muted">
                                    {searchType === "id"
                                        ? "Pesquisando por ID"
                                        : searchType === "student"
                                            ? "Pesquisando por Aluno"
                                            : "Pesquisando por Data"}
                                </span>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        setSearchType(
                                            searchType === "id"
                                                ? "student"
                                                : searchType === "student"
                                                    ? "date"
                                                    : "id"
                                        )
                                    }
                                >
                                    {searchType === "id"
                                        ? "Mudar para Aluno"
                                        : searchType === "student"
                                            ? "Mudar para Data"
                                            : "Mudar para ID"}
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
                                    className={`btn btn-outline-success ${searchType === "student" ? "active" : ""}`}
                                    onClick={() => setSearchType("student")}
                                >
                                    <i className="bi bi-person" /> Aluno
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
                                        placeholder={searchType === "id" ? "Digite o ID do compromisso" : "Digite o aluno"}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                )}
                            </div>

                            {/* Botões de Ação */}
                            <button className="btn btn-primary ms-3" onClick={searchAppointments}>
                                Pesquisar
                            </button>
                            <button className="btn btn-danger ms-2" onClick={clearSearch}>
                                Limpar Pesquisa
                            </button>
                        </div>
                    </div>

                    {/* Exibição de erros */}
                    {errorMessage && (
                        <div className="alert alert-danger">{errorMessage}</div>
                    )}

                    {/* Tabela de compromissos */}
                    <table className="table table-striped table-bordered shadow-lg">
                        <thead className="table-light">
                            <tr>
                                <th>#</th>
                                <th>Especialidade</th>
                                <th>Aluno</th>
                                <th>Data</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length > 0 ? (
                                appointments.map((appointment) => (
                                    <tr key={appointment._id}>
                                        <th scope="row">{appointment._id}</th>
                                        <td>{appointment.specialty}</td>
                                        <td>{appointment.student}</td>
                                        <td>{formatDate(appointment.date)}</td>
                                        <td>
                                            <AppointmentsAction pid={appointment._id} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">Nenhum compromisso encontrado</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}