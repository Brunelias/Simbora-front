import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../config/axios'
import { useAuth } from '../../context/AuthContext'

function PerfilCliente() {
  const { usuario } = useAuth()

  const [compras, setCompras] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    api.get(`/compras/minhas`)
      .then((response) => {
        setCompras(response.data)
      })
      .catch((error) => {
        console.error('Erro ao carregar compras:', error)
      })
      .finally(() => {
        setCarregando(false)
      })
  }, [])

  if (carregando) return <p>Carregando perfil...</p>

  return (
    <div>
      <h1>Minha conta</h1>

      {/* Card de perfil */}
      <div className="card shadow-sm mt-4 mb-4">
        <div className="card-body d-flex align-items-center gap-4 flex-wrap">
          <div
            className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
            style={{ width: '80px', height: '80px', fontSize: '32px' }}
          >
            {usuario?.nome?.charAt(0).toUpperCase() || 'C'}
          </div>

          <div className="flex-grow-1">
            <h4 className="mb-1">{usuario?.nome}</h4>
            <p className="text-muted mb-0">{usuario?.email}</p>
          </div>

          <div className="d-flex gap-2">
            <Link to="/cliente/editar" className="btn btn-outline-secondary btn-sm">
              Editar perfil
            </Link>
            <Link to="/cliente/alterar-senha" className="btn btn-outline-secondary btn-sm">
              Alterar senha
            </Link>
          </div>
        </div>
      </div>

      {/* Compras */}
      <h2 className="mb-3">Minhas compras</h2>

      {compras.length === 0 ? (
        <div className="alert alert-info">
          Você ainda não realizou nenhuma compra.{' '}
          <Link to="/eventos">Ver eventos disponíveis</Link>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {compras.map((compra) => (
            <div className="card shadow-sm" key={compra.id}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <div>
                    <h5 className="mb-1">Compra #{compra.id}</h5>
                    <p className="text-muted mb-1">
                      {new Date(compra.dataCompra).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="mb-0">
                      <strong>Total:</strong>{' '}
                      {compra.valorTotal === 0
                        ? 'Gratuito'
                        : `R$ ${compra.valorTotal?.toFixed(2)}`}
                    </p>
                  </div>

                  <span className={
                    compra.status === 'CONFIRMADA'
                      ? 'badge bg-success'
                      : compra.status === 'PENDENTE'
                        ? 'badge bg-warning text-dark'
                        : 'badge bg-danger'
                  }>
                    {compra.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PerfilCliente