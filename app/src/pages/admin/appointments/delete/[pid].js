import Axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import MenuAppointments from '@/components/MenuAppointments';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DeleteAppointment() {
    const router = useRouter();
    const { pid } = router.query;

    const API_URL = `http://localhost:8080/api/appointments/${pid}`;
    const [appointment, setAppointment] = useState({});
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await Axios.get(API_URL);
                setAppointment(response.data);
            } catch (error) {
                setMessage("Erro ao carregar compromisso.");
            }
        };

        if (pid) fetchAppointment();
    }, [pid]);

    const handleDelete = async () => {
        try {
            const response = await Axios.delete(API_URL);
            setMessage(response.data.message);
            router.push('/admin/appointments');
        } catch (error) {
            setMessage("Erro ao deletar compromisso.");
        }
    };

    return (
        <>
            <Head>
                <title>Admin - Deletar Compromisso</title>
            </Head>
            <NavAdmin />
            <MenuAppointments />
            <div className="container">
                <h3>Deletar Compromisso</h3>
                {message && (
                    <div className={`alert ${message.includes("sucesso") ? "alert-success" : "alert-danger"}`}>
                        {message}
                    </div>
                )}
                {!message && (
                    <div>
                        <p>Deseja deletar o compromisso abaixo?</p>
                        <div className="form-group">
                            <label>Especialidade:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={appointment.specialty || ""}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label>Data:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={appointment.date ? new Date(appointment.date).toLocaleDateString() : ""}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label>Aluno:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={appointment.student || ""}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label>Profissional:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={appointment.professional || ""}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label>Comentários:</label>
                            <textarea
                                className="form-control"
                                value={appointment.comments || ""}
                                readOnly
                            />
                        </div>
                        <div className="d-flex">
                            <button className="btn btn-danger" onClick={handleDelete}>
                                Deletar
                            </button>
                            <Link href="/admin/appointments">
                                <button className="btn btn-info ms-2">Voltar</button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}