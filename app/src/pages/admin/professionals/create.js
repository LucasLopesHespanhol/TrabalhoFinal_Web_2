import Axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import MenuProfessionals from '@/components/MenuProfessionals';
import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CreateProfessional() {
    const API_URL = "http://localhost:8080/api/professionals";

    const [professional, setProfessional] = useState({
        name: "",
        specialty: "",
        contact: "",
        phone_number: "",
        status: "",
    });

    const [message, setMessage] = useState({ text: "", status: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfessional({ ...professional, [name]: value });
    };

    const handleSubmit = async () => {
        // Validação simples de formulário
        if (!professional.name || !professional.specialty || !professional.contact || !professional.phone_number || !professional.status) {
            setMessage({ text: "Todos os campos obrigatórios devem ser preenchidos!", status: "error" });
            return;
        }

        try {
            const response = await Axios.post(API_URL, professional);
            setMessage({ text: response.data.message, status: "success" });
            setProfessional({
                name: "",
                specialty: "",
                contact: "",
                phone_number: "",
                status: "",
            });
        } catch (error) {
            setMessage({ text: "Erro ao adicionar profissional.", status: "error" });
        }
    };

    return (
        <>
            <Head>
                <title>Admin - Adicionar Profissional</title>
            </Head>
            <NavAdmin />
            <MenuProfessionals />
            <div className="container">
                <h3>Adicionar Profissional</h3>
                {message.text && (
                    <div className={`alert ${message.status === "success" ? "alert-success" : "alert-danger"}`}>
                        {message.text}
                    </div>
                )}
                <form>
                    <div className="form-group">
                        <label>Nome:</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={professional.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Especialidade:</label>
                        <input
                            type="text"
                            name="specialty"
                            className="form-control"
                            value={professional.specialty}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Contato:</label>
                        <input
                            type="text"
                            name="contact"
                            className="form-control"
                            value={professional.contact}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Telefone:</label>
                        <input
                            type="text"
                            name="phone_number"
                            className="form-control"
                            value={professional.phone_number}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Status:</label>
                        <select
                            name="status"
                            className="form-control"
                            value={professional.status}
                            onChange={handleChange}
                        >
                            <option value="">Selecione...</option>
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                        </select>
                    </div>
                    <div className="d-flex mt-3">
                        <button className="btn btn-success" type="button" onClick={handleSubmit}>
                            Salvar
                        </button>
                        <Link href="/admin/professionals">
                            <button className="btn btn-info" type="button">
                                Voltar
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}