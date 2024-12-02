import Axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import MenuAppointments from '@/components/MenuAppointments';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UpdateAppointment() {
    const router = useRouter();
    const { pid } = router.query;

    const API_URL = `http://localhost:8080/api/appointments/${pid}`;
    const [appointment, setAppointment] = useState({
        specialty: "",
        date: "",
        student: "",
        professional: "",
        comments: "",
    });
    const [message, setMessage] = useState("");

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointment({ ...appointment, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await Axios.put(API_URL, appointment);
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Erro ao atualizar compromisso.");
        }
    };

    return (
        <>
            <Head>
                <title>Admin - Atualizar Compromisso</title>
            </Head>
            <NavAdmin />
            <MenuAppointments />
            <div className="container">
                <h3>Atualizar Compromisso</h3>
                {message && (
                    <div className={`alert ${message.includes("sucesso") ? "alert-success" : "alert-danger"}`}>
                        {message}
                    </div>
                )}
                <form>
                    <div className="form-group">
                        <label>Especialidade:</label>
                        <input
                            type="text"
                            name="specialty"
                            className="form-control"
                            value={appointment.specialty || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Data:</label>
                        <input
                            type="date"
                            name="date"
                            className="form-control"
                            value={appointment.date || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Aluno:</label>
                        <input
                            type="text"
                            name="student"
                            className="form-control"
                            value={appointment.student || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Profissional:</label>
                        <input
                            type="text"
                            name="professional"
                            className="form-control"
                            value={appointment.professional || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Comentários:</label>
                        <textarea
                            name="comments"
                            className="form-control"
                            value={appointment.comments || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="d-flex">
                        <button className="btn btn-danger" type="button" onClick={handleSubmit}>
                            Salvar
                        </button>
                        <Link href="/admin/appointments">
                            <button className="btn btn-info ms-2" type="button">
                                Voltar
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}
