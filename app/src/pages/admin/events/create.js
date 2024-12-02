import NavAdmin from '@/components/NavAdmin'
import MenuEvents from '@/components/MenuEvents';
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CreateEvent() {
  const API_URL = "http://localhost:8080/api/events";

  const [event, setEvent] = useState({
    description: "",
    comments: "",
    date: "",
  });

  const [message, setMessage] = useState({ message: "", status: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({
      ...event,
      [name]: value,
    });
  };

  const handleCreateEvent = async () => {
    try {
      const response = await axios.post(API_URL, event);
      
      // Se o evento for criado com sucesso, exibimos a mensagem
      setMessage({ message: response.data.message, status: "ok" });
    } catch (error) {
      setMessage({ message: error.response?.data.message || "Erro ao criar evento", status: "error" });
      console.error('Erro ao criar evento:', error);
    }
  };
  
  return (
    <>
      <Head>
        <title>APP-BC</title>
        <meta name="description" content="Gerenciamento de Eventos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <NavAdmin />
        <MenuEvents />
        {message.status && (
          <div className={`alert alert-${message.status === "ok" ? "success" : "danger"}`} role="alert">
            {message.message}
            <Link className="alert-link" href="/admin/events">Voltar</Link>
          </div>
        )}
      </div>

      <div className="d-flex justify-content-center p-2">
        <div className="container">
          <div className="row border-bottom">
            <h3>Cadastro de Evento</h3>

            <form method="POST">
              <div className="form-group">
                <label className="form-label" htmlFor="description">Descrição</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  className="form-control"
                  value={event.description}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="comments">Comentários</label>
                <textarea
                  id="comments"
                  name="comments"
                  className="form-control"
                  value={event.comments}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="date">Data</label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  className="form-control"
                  value={event.date}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group p-2">
                <button className="btn btn-outline-success" type="button" onClick={handleCreateEvent}>Salvar</button>
                <Link className="btn btn-outline-info" href="/admin/events">Voltar</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}