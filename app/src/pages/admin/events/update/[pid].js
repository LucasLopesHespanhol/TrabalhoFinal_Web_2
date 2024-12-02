import NavAdmin from '@/components/NavAdmin';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UpdateEvent() {
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
        setEvent(response.data);
      } catch (error) {
        console.error('Erro ao buscar o evento:', error);
      }
    };

    getEvent();
  }, [pid]);

  const handleUpdate = async () => {
    try {
      await Axios.put(`${API_URL}${pid}`, event);
      setMessage({ message: "Evento atualizado com sucesso!", status: "ok" });
    } catch (error) {
      console.error('Erro ao atualizar o evento:', error);
      setMessage({ message: "Erro ao atualizar o evento!", status: "error" });
    }
  };

  return (
    <>
      <Head>
        <title>Editar Evento</title>
      </Head>
      <div>
        <NavAdmin />
        {message.status && (
          <div className={`alert alert-${message.status === "ok" ? "success" : "danger"}`}>
            {message.message}
          </div>
        )}
      </div>
      <div className="container">
        <h3>Editar Evento</h3>
        <form>
          <div className="form-group">
            <label>Descrição</label>
            <input
              type="text"
              className="form-control"
              value={event.description}
              onChange={(e) => setEvent({ ...event, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Comentários</label>
            <textarea
              className="form-control"
              value={event.comments}
              onChange={(e) => setEvent({ ...event, comments: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Data</label>
            <input
              type="datetime-local"
              className="form-control"
              value={event.date}
              onChange={(e) => setEvent({ ...event, date: e.target.value })}
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={handleUpdate}>
            Salvar
          </button>
          <Link href="/admin/events" className="btn btn-outline-info">Voltar</Link>
        </form>
      </div>
    </>
  );
}
