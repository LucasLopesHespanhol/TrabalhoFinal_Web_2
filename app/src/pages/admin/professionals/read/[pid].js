import Axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import MenuProfessionals from '@/components/MenuProfessionals';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ReadProfessional() {
    const router = useRouter();
    const { pid } = router.query;

    const API_URL = `http://localhost:8080/api/professionals/${pid}`;
    const [professional, setProfessional] = useState({});

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

    return (
        <>
            <Head>
                <title>Admin - Detalhes do Profissional</title>
            </Head>
            <NavAdmin />
            <MenuProfessionals />
            <div className="container">
                <h3>Detalhes do Profissional</h3>
                <form>
                    <div className="form-group">
                        <label>Nome:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={professional.name || ""}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Especialidade:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={professional.specialty || ""}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Contato:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={professional.contact || ""}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Telefone:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={professional.phone_number || ""}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Status:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={professional.status || ""}
                            readOnly
                        />
                    </div>
                    <Link href="/admin/professionals">
                        <button className="btn btn-info mt-3" type="button">Voltar</button>
                    </Link>
                </form>
            </div>
        </>
    );
}