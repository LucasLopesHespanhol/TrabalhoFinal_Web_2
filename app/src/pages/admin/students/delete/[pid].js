import Axios from 'axios';
import NavAdmin from '@/components/NavAdmin';
import MenuStudents from '@/components/MenuStudents';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DeleteStudent() {
    const router = useRouter();
    const { pid } = router.query;

    const API_URL = `http://localhost:8080/api/students/${pid}`;
    const [student, setStudent] = useState({});
    const [message, setMessage] = useState("");

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

    const handleDelete = async () => {
        try {
            const response = await Axios.delete(API_URL);
            setMessage(response.data.message);
            router.push('/admin/students');
        } catch (error) {
            setMessage("Erro ao deletar estudante.");
        }
    };

    return (
        <>
            <Head>
                <title>Admin - Deletar Estudante</title>
            </Head>
            <NavAdmin />
            <MenuStudents />
            <div className="container">
                <h3>Deletar Estudante</h3>
                {message && (
                    <div className={`alert ${message.includes("sucesso") ? "alert-success" : "alert-danger"}`}>
                        {message}
                    </div>
                )}
                {!message && (
                    <div>
                        <p>Deseja deletar o estudante <strong>{student.name}</strong>?</p>
                        <div className="d-flex">
                            <button className="btn btn-danger" onClick={handleDelete}>Deletar</button>
                            <Link href="/admin/students">
                                <button className="btn btn-info ms-2">Voltar</button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
