import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

import { BASE_URL } from '../../config/axios'

import teste from '../../img/teste.jpg'

const baseURL = `${BASE_URL}/eventos`

function ConsultaEventos() {
  const [eventos, setEventos] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    axios
      .get(baseURL)
      .then((response) => {
        const eventosAtivos = response.data.filter(
          (evento) => evento.status === 'ATIVO'
        )

        setEventos(eventosAtivos)
      })
      .catch((error) => {
        console.error('Erro ao buscar eventos:', error)
      })
      .finally(() => {
        setCarregando(false)
      })
  }, [])

  if (carregando) {
    return <p>Carregando eventos...</p>
  }

  return (
    <div>
      <h2>Eventos disponíveis</h2>

      <p className="text-muted">
        Os melhores eventos estão aqui, escolha o seu e Simbora!
      </p>

      <div className="row mt-4">
        {eventos.length === 0 && (
          <div className="col-12">
            <div className="alert alert-info">
              Nenhum evento encontrado.
            </div>
          </div>
        )}

        {eventos.map((evento) => (
          <div
            className="col-12 col-md-6 col-lg-4 mb-4"
            key={evento.id}
          >
            <Link
              to={`/eventos/${evento.id}`}
              className="text-decoration-none text-dark"
            >
              <div className="card h-100 shadow-sm">

               <img
  src={teste}
  className="card-img-top"
  alt={evento.nome}
  style={{
    height: '220px',
    objectFit: 'cover'
  }}
/>

                <div className="card-body">

                  <h5 className="card-title">
                    {evento.nome}
                  </h5>

                  <p className="mb-1">
                    <strong>Data:</strong>{' '}
                    {new Date(evento.dataInicio).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>

                  <p className="mb-0">
                    <strong>Local:</strong>{' '}
                    {evento.local} - {evento.cidade}
                  </p>

                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ConsultaEventos