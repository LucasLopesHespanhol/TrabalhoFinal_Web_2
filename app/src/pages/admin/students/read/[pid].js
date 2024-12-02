import Axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import MenuStudents from '@/components/MenuStudents';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function ReadStudent() {
    const router = useRouter();
    const { pid } = router.query;

    const API_URL = `http://localhost:8080/api/students/${pid}`;
    const [student, setStudent] = useState({});

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

    return (
        <>
            <Head>
                <title>Admin - Detalhes do Estudante</title>
            </Head>
            <NavAdmin />
            <MenuStudents />
            <div className="container">
                <h3>Detalhes do Estudante</h3>
                <form>
                    <div className="form-group">
                        <label>Nome:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={student.name || ""}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Idade:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={student.age || ""}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Pais/Responsáveis:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={student.parents || ""}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Telefone:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={student.phone_number || ""}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Necessidades Especiais:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={student.special_needs || "Nenhuma"}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label>Status:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={student.status || ""}
                            readOnly
                        />
                    </div>
                    <Link href="/admin/students">
                        <button className="btn btn-info mt-3" type="button">Voltar</button>
                    </Link>
                </form>
            </div>
        </>
    );
}
