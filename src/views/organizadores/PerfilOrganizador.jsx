import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../config/axios'
import { useAuth } from '../../context/AuthContext'
import teste from '../../img/teste.jpg'

function PerfilOrganizador() {
  const { usuario } = useAuth()

  const [eventos, setEventos] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    api.get(`/eventos`)
      .then((response) => {
      const eventosDoOrganizador = response.data.filter(
        (evento) => evento.idOrganizador === usuario.id
      )
        setEventos(eventosDoOrganizador)
      })
      .catch((error) => {
        console.error('Erro ao carregar eventos:', error)
      })
      .finally(() => {
        setCarregando(false)
      })
  }, [])

  function cancelarEvento(evento) {
    const eventoAtualizado = { ...evento, status: 'CANCELADO' }

    api
      .put(`/eventos/${evento.id}`, eventoAtualizado)
      .then(() => {
        setEventos(
          eventos.map((item) =>
            item.id === evento.id ? eventoAtualizado : item
          )
        )
      })
      .catch((error) => {
        console.error('Erro ao cancelar evento:', error)
        alert('Erro ao cancelar evento.')
      })
  }

  if (carregando) return <p>Carregando perfil...</p>

  return (
    <div>
      <h1>Área do organizador</h1>

      <div className="card shadow-sm mt-4 mb-4">
        <div className="card-body d-flex align-items-center gap-4 flex-wrap">
          <div
            className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
            style={{ width: '80px', height: '80px', fontSize: '32px' }}
          >
            {usuario?.nome?.charAt(0).toUpperCase() || 'O'}
          </div>

          <div className="flex-grow-1">
            <h4 className="mb-1">{usuario?.nome}</h4>
            <p className="text-muted mb-0">{usuario?.email}</p>
          </div>

          <div className="d-flex gap-2">
            <Link to="/organizador/editar" className="btn btn-outline-secondary btn-sm">
              Editar perfil
            </Link>
            <Link to="/organizador/eventos/novo" className="btn btn-success btn-sm">
              Novo evento
            </Link>
          </div>
        </div>
      </div>

      <h2 className="mb-3">Meus eventos</h2>

      {eventos.length === 0 && (
        <div className="alert alert-info">
          Nenhum evento cadastrado ainda.{' '}
          <Link to="/organizador/eventos/novo">Criar primeiro evento</Link>
        </div>
      )}

      <div className="row">
        {eventos.map((evento) => (
          <div className="col-12 col-md-6 col-lg-4 mb-4" key={evento.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={teste}
                className="card-img-top"
                alt={evento.nome}
                style={{ height: '220px', objectFit: 'cover' }}
              />

              <div className="card-body">
                <h5 className="card-title">{evento.nome}</h5>

                <p className="mb-1">
                  <strong>Data:</strong>{' '}
                  {new Date(evento.dataInicio).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>

                <p className="mb-2">
                  <strong>Local:</strong> {evento.local} - {evento.cidade}
                </p>

                <span className={
                  evento.status === 'ATIVO'
                    ? 'badge bg-success'
                    : evento.status === 'CANCELADO'
                      ? 'badge bg-danger'
                      : 'badge bg-secondary'
                }>
                  {evento.status}
                </span>

                <div className="mt-3 d-flex gap-2">
                  <Link
                    to={`/organizador/eventos/${evento.id}/editar`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Editar
                  </Link>

                  <Link
                    to={`/organizador/eventos/${evento.id}/lotes`}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    Lotes
                  </Link>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    disabled={evento.status === 'CANCELADO'}
                    onClick={() => {
                      if (window.confirm('Deseja cancelar este evento?')) {
                        cancelarEvento(evento)
                      }
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PerfilOrganizador