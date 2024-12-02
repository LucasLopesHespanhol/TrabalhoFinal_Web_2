import Axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import MenuAppointments from '@/components/MenuAppointments';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function CreateAppointment() {
    const API_URL = "http://localhost:8080/api/appointments";

    const [appointment, setAppointment] = useState({
        specialty: "",
        date: "",
        student: "",
        professional: "",
        comments: "",
    });

    const [message, setMessage] = useState({ text: "", status: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointment({ ...appointment, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            // Converte a data para UTC no frontend
            const utcDate = new Date(appointment.date + "T00:00:00Z").toISOString();
    
            console.log("Data enviada ajustada para UTC:", utcDate);
    
            const response = await Axios.post(API_URL, {
                ...appointment,
                date: appointment.date // Não aplique manipulação adicional
            });            
    
            setMessage({ text: response.data.message, status: "success" });
        } catch (error) {
            setMessage({ text: "Erro ao criar compromisso.", status: "error" });
        }
    };
    
    

    return (
        <>
            <Head>
                <title>Admin - Criar Compromisso</title>
            </Head>
            <NavAdmin />
            <MenuAppointments />
            <div className="container">
                <h3>Criar Compromisso</h3>
                {message.text && (
                    <div className={`alert ${message.status === "success" ? "alert-success" : "alert-danger"}`}>
                        {message.text}
                        <Link className="alert-link" href="/admin/appointments">
                            Voltar
                        </Link>
                    </div>
                )}
                <form>
                    <div className="form-group">
                        <label>Especialidade:</label>
                        <input
                            type="text"
                            name="specialty"
                            className="form-control"
                            value={appointment.specialty}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Data:</label>
                        <input
                            type="date"
                            name="date"
                            className="form-control"
                            value={appointment.date}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Aluno:</label>
                        <input
                            type="text"
                            name="student"
                            className="form-control"
                            value={appointment.student}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Profissional:</label>
                        <input
                            type="text"
                            name="professional"
                            className="form-control"
                            value={appointment.professional}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Comentários:</label>
                        <textarea
                            name="comments"
                            className="form-control"
                            value={appointment.comments}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="d-flex mt-3">
                        <button className="btn btn-success" type="button" onClick={handleSubmit}>
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