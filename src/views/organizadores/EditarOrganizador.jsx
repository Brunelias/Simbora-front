import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../config/axios'
import { useAuth } from '../../context/AuthContext'

function EditarOrganizador() {
  const navigate = useNavigate()
  const { usuario } = useAuth()

  const [organizador, setOrganizador] = useState({
    nome: '',
    celular: '',
    documento: ''
  })

  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    api
      .get(`/auth/me`)
      .then((response) => {
        const o = response.data
        setOrganizador({
          nome: o.nome || '',
          celular: o.celular || '',
          documento: o.documento || ''
        })
      })
      .catch(() => alert('Erro ao carregar organizador.'))
      .finally(() => setCarregando(false))
  }, [])

  function alterarCampo(event) {
    const { name, value } = event.target
    setOrganizador({ ...organizador, [name]: value })
  }

  function atualizarOrganizador(event) {
    event.preventDefault()

    api
      .put(`/organizadores/me`, organizador)
      .then(() => {
        alert('Perfil atualizado com sucesso!')
        navigate('/organizador')
      })
      .catch(() => alert('Erro ao atualizar perfil.'))
  }

  if (carregando) return <p>Carregando organizador...</p>

  return (
    <div>
      <h1>Editar perfil</h1>
      <p className="text-muted">Atualize suas informações de organizador.</p>

      <form className="card shadow-sm mt-4" onSubmit={atualizarOrganizador}>
        <div className="card-body">

          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input
              type="text"
              name="nome"
              className="form-control"
              value={organizador.nome}
              onChange={alterarCampo}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              className="form-control"
              value={usuario.email}
              disabled
            />
            <div className="form-text">O e-mail não pode ser alterado.</div>
          </div>

          <div className="mb-3">
            <label className="form-label">Celular</label>
            <input
              type="text"
              name="celular"
              className="form-control"
              value={organizador.celular}
              onChange={alterarCampo}
              required
            />
          </div>

          <div className="alert alert-info py-2 mt-3">
            Para alterar sua senha,{' '}
            <Link to="/organizador/alterar-senha">clique aqui</Link>.
          </div>

          <div className="d-flex gap-2 mt-4">
            <Link to="/organizador" className="btn btn-outline-secondary">
              Cancelar
            </Link>
            <button type="submit" className="btn btn-success">
              Salvar alterações
            </button>
          </div>

        </div>
      </form>
    </div>
  )
}

export default EditarOrganizador