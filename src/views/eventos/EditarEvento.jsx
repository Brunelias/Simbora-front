import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../../config/axios'
import { useAuth } from '../../context/AuthContext'

function EditarEvento() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuario } = useAuth()

  const [evento, setEvento] = useState({
    nome: '',
    descricao: '',
    dataInicio: '',
    local: '',
    cidade: '',
    capacidadeMaxima: '',
    status: 'ATIVO'
  })

  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    api
      .get(`/eventos/${id}`)
      .then((response) => {
        const eventoRecebido = response.data
        setEvento({
          nome: eventoRecebido.nome || '',
          descricao: eventoRecebido.descricao || '',
          dataInicio: eventoRecebido.dataInicio
            ? eventoRecebido.dataInicio.substring(0, 16)
            : '',
          local: eventoRecebido.local || '',
          cidade: eventoRecebido.cidade || '',
          capacidadeMaxima: eventoRecebido.capacidadeMaxima || '',
          status: eventoRecebido.status || 'ATIVO'
        })
      })
      .catch((error) => {
        console.error('Erro ao buscar evento:', error)
        alert('Erro ao carregar evento.')
      })
      .finally(() => {
        setCarregando(false)
      })
  }, [id])

  function alterarCampo(event) {
    const { name, value } = event.target
    setEvento({ ...evento, [name]: value })
  }

  function atualizarEvento(event) {
    event.preventDefault()

    const eventoAtualizado = {
      ...evento,
      capacidadeMaxima: Number(evento.capacidadeMaxima),
      idOrganizador: usuario.id
    }

    api
      .put(`/eventos/${id}`, eventoAtualizado)
      .then(() => {
        alert('Evento atualizado com sucesso!')
        navigate('/organizador')
      })
      .catch((error) => {
        console.error('Erro ao atualizar evento:', error)
        alert('Erro ao atualizar evento.')
      })
  }

  if (carregando) return <p>Carregando evento...</p>

  return (
    <div>
      <h1>Editar evento</h1>
      <p className="text-muted">Atualize as informações principais do evento.</p>

      <form className="card shadow-sm mt-4" onSubmit={atualizarEvento}>
        <div className="card-body">

          <div className="mb-3">
            <label className="form-label">Nome do evento</label>
            <input type="text" name="nome" className="form-control"
              value={evento.nome} onChange={alterarCampo} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Descrição</label>
            <textarea name="descricao" className="form-control" rows="5"
              value={evento.descricao} onChange={alterarCampo} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Data e horário</label>
            <input type="datetime-local" name="dataInicio" className="form-control"
              value={evento.dataInicio} onChange={alterarCampo}
              min="2025-01-01T00:00" max="2100-12-31T23:59" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Local</label>
            <input type="text" name="local" className="form-control"
              value={evento.local} onChange={alterarCampo} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Cidade</label>
            <input type="text" name="cidade" className="form-control"
              value={evento.cidade} onChange={alterarCampo} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Capacidade máxima</label>
            <input type="number" name="capacidadeMaxima" className="form-control"
              value={evento.capacidadeMaxima} onChange={alterarCampo} min="1" required />
          </div>

          <div className="mb-3">
            <label className="form-label">Status</label>
            <select name="status" className="form-select"
              value={evento.status} onChange={alterarCampo} required>
              <option value="ATIVO">ATIVO</option>
              <option value="CANCELADO">CANCELADO</option>
            </select>
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

export default EditarEvento