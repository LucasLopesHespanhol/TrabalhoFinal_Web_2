import NavAdmin from '@/components/NavAdmin';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DeleteEvent() {
  const API_URL = "http://localhost:8080/api/events/";
  const router = useRouter();
  const { pid } = router.query;

  const [message, setMessage] = useState({ message: "", status: "" });
  const [event, setEvent] = useState({
    description: "",
    comments: "",
    date: "",
  });

  useEffect(() => {
    if (!pid) return;

    const fetchEvent = async () => {
      try {
        const response = await Axios.get(`${API_URL}${pid}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Erro ao buscar o evento para exclusão:', error);
        setMessage({ message: "Erro ao carregar os detalhes do evento!", status: "error" });
      }
    };

    fetchEvent();
  }, [pid]);

  const handleDelete = async () => {
    try {
      await Axios.delete(`${API_URL}${pid}`);
      setMessage({ message: "Evento excluído com sucesso!", status: "ok" });
      setTimeout(() => router.push('/admin/events'), 2000); // Redireciona após 2 segundos
    } catch (error) {
      console.error('Erro ao excluir o evento:', error);
      setMessage({ message: "Erro ao excluir o evento!", status: "error" });
    }
  };

  return (
    <>
      <Head>
        <title>Excluir Evento</title>
      </Head>
      <div>
        <NavAdmin />
        {message.status && (
          <div className={`alert alert-${message.status === "ok" ? "success" : "danger"}`}>
            {message.message}
          </div>
        )}
      </div>
      <div className="d-flex justify-content-center p-2">
        <div className="container">
          <h3>Excluir Evento</h3>
          {message.status === "" && (
            <>
              <p>Tem certeza de que deseja excluir o evento abaixo?</p>
              <div className="form-group">
                <label>Descrição:</label>
                <input type="text" className="form-control" value={event.description} readOnly />
              </div>
              <div className="form-group">
                <label>Comentários:</label>
                <textarea className="form-control" value={event.comments} readOnly />
              </div>
              <div className="form-group">
                <label>Data:</label>
                <input type="text" className="form-control" value={new Date(event.date).toLocaleString()} readOnly />
              </div>
              <button className="btn btn-danger" onClick={handleDelete}>
                Confirmar Exclusão
              </button>
              <Link href="/admin/events" className="btn btn-secondary ml-2">
                Cancelar
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}