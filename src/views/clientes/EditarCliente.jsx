import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../config/axios'
import { useAuth } from '../../context/AuthContext'

function EditarCliente() {
  const navigate = useNavigate()
  const { usuario } = useAuth()

  const [cliente, setCliente] = useState({
    nome: '',
    celular: ''
  })

  const [carregando, setCarregando] = useState(true)

useEffect(() => {
  api
    .get(`/auth/me`)
    .then((response) => {
      const c = response.data
      setCliente({
        nome: c.nome || '',
        celular: c.celular || ''
      })
    })
    .catch(() => alert('Erro ao carregar cliente.'))
    .finally(() => setCarregando(false))
}, [])

  function alterarCampo(event) {
    const { name, value } = event.target
    setCliente({ ...cliente, [name]: value })
  }

  function atualizarCliente(event) {
    event.preventDefault()

    api
      .put(`/clientes/me`, {
          nome: cliente.nome,
          celular: cliente.celular
        })
        .then(() => {
          alert('Perfil atualizado com sucesso!')
          navigate('/cliente')
        })
        .catch(() => alert('Erro ao atualizar perfil.'))
  }

  if (carregando) return <p>Carregando cliente...</p>

  return (
    <div>
      <h1>Editar perfil</h1>
      <p className="text-muted">Atualize suas informações pessoais.</p>

      <form className="card shadow-sm mt-4" onSubmit={atualizarCliente}>
        <div className="card-body">

          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input
              type="text"
              name="nome"
              className="form-control"
              value={cliente.nome}
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
              value={cliente.celular}
              onChange={alterarCampo}
              required
            />
          </div>

          <div className="alert alert-info py-2 mt-3">
            Para alterar sua senha,{' '}
            <Link to="/cliente/alterar-senha">clique aqui</Link>.
          </div>

          <div className="d-flex gap-2 mt-4">
            <Link to="/cliente" className="btn btn-outline-secondary">
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

export default EditarCliente