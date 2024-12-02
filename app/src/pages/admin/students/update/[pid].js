import Axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import MenuStudents from '@/components/MenuStudents';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function UpdateStudent() {
    const router = useRouter();
    const { pid } = router.query;

    const API_URL = `http://localhost:8080/api/students/${pid}`;
    const [student, setStudent] = useState({
        name: "",
        age: "",
        parents: "",
        phone_number: "",
        special_needs: "",
        status: "",
    });
    const [message, setMessage] = useState({ text: "", status: "" });

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await Axios.get(API_URL);
                setStudent(response.data);
            } catch (error) {
                console.error("Erro ao carregar estudante:", error);
            }
        };

        if (pid) fetchStudent();
    }, [pid]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent({ ...student, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await Axios.put(API_URL, student);
            setMessage({ text: response.data.message, status: "success" });
        } catch (error) {
            setMessage({ text: "Erro ao atualizar estudante.", status: "error" });
        }
    };

    return (
        <>
            <Head>
                <title>Admin - Atualizar Estudante</title>
            </Head>
            <NavAdmin />
            <MenuStudents />
            <div className="container">
                <h3>Atualizar Estudante</h3>
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
                            value={student.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Idade:</label>
                        <input
                            type="number"
                            name="age"
                            className="form-control"
                            value={student.age}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Pais/Responsáveis:</label>
                        <input
                            type="text"
                            name="parents"
                            className="form-control"
                            value={student.parents}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Telefone:</label>
                        <input
                            type="text"
                            name="phone_number"
                            className="form-control"
                            value={student.phone_number}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Necessidades Especiais:</label>
                        <input
                            type="text"
                            name="special_needs"
                            className="form-control"
                            value={student.special_needs || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Status:</label>
                        <select
                            name="status"
                            className="form-control"
                            value={student.status}
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
                        <Link href="/admin/students">
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
