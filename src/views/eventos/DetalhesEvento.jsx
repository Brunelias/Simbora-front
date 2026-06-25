import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'

import { BASE_URL } from '../../config/axios'
import teste from '../../img/teste.jpg'

function DetalhesEvento() {
  const { id } = useParams()

  const [evento, setEvento] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    axios
      .get(`${BASE_URL}/eventos/${id}`)
      .then((response) => {
        setEvento(response.data)
      })
      .catch((error) => {
        console.error('Erro ao buscar evento:', error)
      })
      .finally(() => {
        setCarregando(false)
      })
  }, [id])

  if (carregando) {
    return <p>Carregando evento...</p>
  }

  if (!evento) {
    return (
      <div className="alert alert-danger">
        Evento não encontrado.
      </div>
    )
  }

  return (
    <div>
      <div className="card shadow-sm">

        <img
          src={teste}
          className="card-img-top"
          alt={evento.nome}
          style={{
            height: '500px',
            objectFit: 'cover'
          }}
        />

        <div className="card-body">

          <h1 className="card-title">
            {evento.nome}
          </h1>

          <div className="text-muted mb-4">

            <p className="mb-1">
              <strong>Local:</strong>{' '}
              {evento.local} - {evento.cidade}
            </p>

            <p className="mb-0">
              <strong>Data:</strong>{' '}
              {new Date(evento.dataInicio).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>

          </div>

          <section className="mt-4">

            <h4>Descrição do evento</h4>

            <p
              className="mt-3"
              style={{
                whiteSpace: 'pre-line',
                lineHeight: '1.8'
              }}
            >
              {evento.descricao}
            </p>

          </section>

          <div className="mt-4 d-flex gap-2">

            <Link
              to="/eventos"
              className="btn btn-outline-secondary"
            >
              Voltar
            </Link>

            <Link
              to={`/eventos/${evento.id}/compra`}
              className="btn btn-success"
            >
              Comprar ingresso
            </Link>

          </div>

        </div>
      </div>
    </div>
  )
}

export default DetalhesEvento