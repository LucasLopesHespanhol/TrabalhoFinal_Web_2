import Axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import MenuProfessionals from '@/components/MenuProfessionals';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DeleteProfessional() {
    const router = useRouter();
    const { pid } = router.query;

    const API_URL = `http://localhost:8080/api/professionals/${pid}`;
    const [professional, setProfessional] = useState({});
    const [message, setMessage] = useState("");

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

    const handleDelete = async () => {
        try {
            const response = await Axios.delete(API_URL);
            setMessage(response.data.message);
            router.push('/admin/professionals');
        } catch (error) {
            setMessage("Erro ao deletar profissional.");
        }
    };

    return (
        <>
            <Head>
                <title>Admin - Deletar Profissional</title>
            </Head>
            <NavAdmin />
            <MenuProfessionals />
            <div className="container">
                <h3>Deletar Profissional</h3>
                {message && (
                    <div className={`alert ${message.includes("sucesso") ? "alert-success" : "alert-danger"}`}>
                        {message}
                    </div>
                )}
                {!message && (
                    <div>
                        <p>Deseja deletar o profissional <strong>{professional.name}</strong>?</p>
                        <div className="d-flex">
                            <button className="btn btn-danger" onClick={handleDelete}>Deletar</button>
                            <Link href="/admin/professionals">
                                <button className="btn btn-info ms-2">Voltar</button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}