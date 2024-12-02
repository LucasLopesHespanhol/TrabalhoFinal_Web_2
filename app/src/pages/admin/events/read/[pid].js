import NavAdmin from '@/components/NavAdmin';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ReadEvent() {
  const API_URL = "http://localhost:8080/api/events/";

  const [event, setEvent] = useState({
    description: "",
    comments: "",
    date: "",
  });

  const router = useRouter();
  const { pid } = router.query;
  const [message, setMessage] = useState({ message: "", status: "" });

  useEffect(() => {
    if (!pid) return;

    const getEvent = async () => {
      try {
        const response = await Axios.get(`${API_URL}${pid}`);
        setMessage({ message: response.data.message, status: "ok" });
        setEvent(response.data);
      } catch (error) {
        console.error('Erro ao buscar o evento:', error);
        setMessage({ message: "Erro ao buscar o evento!", status: "error" });
      }
    };

    getEvent();
  }, [pid]);

  return (
    <>
      <Head>
        <title>Detalhes do Evento</title>
      </Head>
      <div>
        <NavAdmin />
        {message.status === "error" && (
          <div className="alert alert-danger">
            {message.message} <Link href="/admin/events">Voltar</Link>
          </div>
        )}
      </div>
      <div className="d-flex justify-content-center p-2">
        <div className="container">
          <h3>Detalhes do Evento</h3>
          <form>
            <div className="form-group">
              <label>Descrição</label>
              <input type="text" className="form-control" value={event.description} readOnly />
            </div>
            <div className="form-group">
              <label>Comentários</label>
              <textarea className="form-control" value={event.comments} readOnly />
            </div>
            <div className="form-group">
              <label>Data</label>
              <input type="text" className="form-control" value={new Date(event.date).toLocaleString()} readOnly />
            </div>
            <Link href="/admin/events" className="btn btn-outline-info">Voltar</Link>
          </form>
        </div>
      </div>
    </>
  );
}