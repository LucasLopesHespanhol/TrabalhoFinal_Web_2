import Axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import MenuProfessionals from '@/components/MenuProfessionals';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UpdateProfessional() {
    const router = useRouter();
    const { pid } = router.query;

    const API_URL = `http://localhost:8080/api/professionals/${pid}`;
    const [professional, setProfessional] = useState({
        name: "",
        specialty: "",
        contact: "",
        phone_number: "",
        status: "",
    });
    const [message, setMessage] = useState({ text: "", status: "" });

    useEffect(() => {
        const fetchProfessional = async () => {
            try {
                const response = await Axios.get(API_URL);
                setProfessional(response.data);
            } catch (error) {
                console.error("Erro ao carregar profissional:", error);
            }
        };

        if (pid) fetchProfessional();
    }, [pid]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfessional({ ...professional, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await Axios.put(API_URL, professional);
            setMessage({ text: response.data.message, status: "success" });
        } catch (error) {
            setMessage({ text: "Erro ao atualizar profissional.", status: "error" });
        }
    };

    return (
        <>
            <Head>
                <title>Admin - Atualizar Profissional</title>
            </Head>
            <NavAdmin />
            <MenuProfessionals />
            <div className="container">
                <h3>Atualizar Profissional</h3>
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
                    <div className="d-flex">
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