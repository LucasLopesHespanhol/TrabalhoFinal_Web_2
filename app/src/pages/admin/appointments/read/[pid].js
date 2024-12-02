import Axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import MenuAppointments from '@/components/MenuAppointments';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ReadAppointment() {
    const router = useRouter();
    const { pid } = router.query;

    const API_URL = `http://localhost:8080/api/appointments/${pid}`;
    const [appointment, setAppointment] = useState({});

    // Formatar a data para exibição como "dd/mm/yyyy"
    const formatDate = (date) => {
        const [year, month, day] = date.split("T")[0].split("-");
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await Axios.get(API_URL);
                setAppointment(response.data);
            } catch (error) {
                console.error("Erro ao carregar compromisso.");
            }
        };

        if (pid) fetchAppointment();
    }, [pid]);

    return (
        <>
            <Head>
                <title>Admin - Detalhes do Compromisso</title>
            </Head>
            <NavAdmin />
            <MenuAppointments />
            <div className="container">
                <h3>Detalhes do Compromisso</h3>
                <form>
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
                            value={appointment.date ? formatDate(appointment.date) : ""}
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
                    <Link href="/admin/appointments">
                        <button className="btn btn-info mt-3" type="button">Voltar</button>
                    </Link>
                </form>
            </div>
        </>
    );
}