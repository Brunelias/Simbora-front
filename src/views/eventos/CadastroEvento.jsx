import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../config/axios'
import { useAuth } from '../../context/AuthContext'

function CadastroEvento() {
  const navigate = useNavigate()
  const { usuario } = useAuth()

  const [evento, setEvento] = useState({
    nome: '',
    descricao: '',
    dataInicio: '',
    local: '',
    cidade: '',
    capacidadeMaxima: ''
  })

  function alterarCampo(event) {
    const { name, value } = event.target
    setEvento({ ...evento, [name]: value })
  }

  function salvarEvento(event) {
    event.preventDefault()

    const eventoParaSalvar = {
      ...evento,
      capacidadeMaxima: Number(evento.capacidadeMaxima),
      status: 'ATIVO',
      idOrganizador: usuario.id
    }

    api
      .post(`/eventos`, eventoParaSalvar)
      .then((response) => {
        navigate(`/organizador/eventos/${response.data.id}/lotes`)
      })
      .catch((error) => {
        console.error('Erro ao cadastrar evento:', error)
        alert('Erro ao cadastrar evento.')
      })
  }

  return (
    <div>
      <h1>Cadastrar evento</h1>

      <p className="text-muted">
        Preencha as informações principais do evento.
      </p>

      <form className="card shadow-sm mt-4" onSubmit={salvarEvento}>
        <div className="card-body">

          <div className="mb-3">
            <label className="form-label">Nome do evento</label>
            <input
              type="text"
              name="nome"
              className="form-control"
              value={evento.nome}
              onChange={alterarCampo}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Descrição</label>
            <textarea
              name="descricao"
              className="form-control"
              rows="5"
              value={evento.descricao}
              onChange={alterarCampo}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Data e horário</label>
            <input
              type="datetime-local"
              name="dataInicio"
              className="form-control"
              value={evento.dataInicio}
              onChange={alterarCampo}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Local</label>
            <input
              type="text"
              name="local"
              className="form-control"
              value={evento.local}
              onChange={alterarCampo}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Cidade</label>
            <input
              type="text"
              name="cidade"
              className="form-control"
              value={evento.cidade}
              onChange={alterarCampo}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Capacidade máxima</label>
            <input
              type="number"
              name="capacidadeMaxima"
              className="form-control"
              value={evento.capacidadeMaxima}
              onChange={alterarCampo}
              min="1"
              required
            />
          </div>

          <div className="d-flex gap-2 mt-4">
            <Link to="/organizador" className="btn btn-outline-secondary">
              Cancelar
            </Link>
            <button type="submit" className="btn btn-success">
              Salvar e cadastrar lotes
            </button>
          </div>

        </div>
      </form>
    </div>
  )
}

export default CadastroEvento