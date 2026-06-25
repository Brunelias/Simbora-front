import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../../config/axios'

function CadastroLotes() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [lotes, setLotes] = useState([])
  const [tipoLote, setTipoLote] = useState(null)
  const [loteEditando, setLoteEditando] = useState(null)

  const [lote, setLote] = useState({
    nome: '',
    dataInicio: '',
    dataFim: '',
    quantidade: '',
    precoUnitario: '',
    gratuito: false
  })

  useEffect(() => {
    buscarLotes()
  }, [])

  function buscarLotes() {
    api
      .get(`/lotes`)
      .then((response) => {
        const lotesDoEvento = response.data.filter(
          (lote) => lote.idEvento === Number(id)
        )
        setLotes(lotesDoEvento)
      })
      .catch((error) => {
        console.error('Erro ao buscar lotes:', error)
      })
  }

  function abrirModal(tipo) {
    setTipoLote(tipo)
    setLoteEditando(null)
    setLote({
      nome: tipo === 'GRATUITO' ? 'Lote gratuito' : '',
      dataInicio: '',
      dataFim: '',
      quantidade: '',
      precoUnitario: tipo === 'GRATUITO' ? 0 : '',
      gratuito: tipo === 'GRATUITO'
    })
  }

  function abrirModalEdicao(loteExistente) {
    setLoteEditando(loteExistente)
    setTipoLote(loteExistente.gratuito ? 'GRATUITO' : 'PAGO')
    setLote({
      nome: loteExistente.nome,
      dataInicio: loteExistente.dataInicio?.slice(0, 16) || '',
      dataFim: loteExistente.dataFim?.slice(0, 16) || '',
      quantidade: loteExistente.quantidade,
      precoUnitario: loteExistente.precoUnitario,
      gratuito: loteExistente.gratuito
    })
  }

  function fecharModal() {
    setTipoLote(null)
    setLoteEditando(null)
    setLote({
      nome: '',
      dataInicio: '',
      dataFim: '',
      quantidade: '',
      precoUnitario: '',
      gratuito: false
    })
  }

  function alterarCampo(event) {
    const { name, value } = event.target
    setLote({ ...lote, [name]: value })
  }

  function salvarLote(event) {
    event.preventDefault()

    const loteParaSalvar = {
      nome: lote.nome,
      dataInicio: lote.dataInicio,
      dataFim: lote.dataFim,
      quantidade: Number(lote.quantidade),
      precoUnitario: tipoLote === 'GRATUITO' ? 0 : Number(lote.precoUnitario),
      gratuito: tipoLote === 'GRATUITO',
      idEvento: Number(id)
    }

    const requisicao = loteEditando
      ? api.put(`/lotes/${loteEditando.id}`, loteParaSalvar)
      : api.post(`/lotes`, loteParaSalvar)

    requisicao
      .then(() => {
        buscarLotes()
        fecharModal()
      })
      .catch((error) => {
        console.error('Erro ao salvar lote:', error)
        alert(error.response?.data || 'Erro ao salvar lote.')
      })
  }

  function excluirLote(idLote) {
    if (window.confirm('Deseja excluir este lote?')) {
      api
        .delete(`/lotes/${idLote}`)
        .then(() => buscarLotes())
        .catch((error) => {
          console.error('Erro ao excluir lote:', error)
          alert('Erro ao excluir lote.')
        })
    }
  }

  function finalizarCadastro() {
    navigate('/organizador')
  }

  function formatarData(data) {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div>
      <h1>Cadastrar lotes</h1>
      <p className="text-muted">Crie os lotes de ingresso para o evento.</p>

      <div className="d-flex gap-2 mt-4 mb-4">
        <button className="btn btn-outline-primary" onClick={() => abrirModal('GRATUITO')}>
          Cadastrar lote gratuito
        </button>
        <button className="btn btn-primary" onClick={() => abrirModal('PAGO')}>
          Cadastrar lote pago
        </button>
      </div>

      {lotes.length === 0 && (
        <div className="alert alert-info">Nenhum lote cadastrado ainda.</div>
      )}

      <div className="row">
        {lotes.map((lote) => (
          <div className="col-12 col-md-6 col-lg-4 mb-4" key={lote.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{lote.nome}</h5>
                <p className="mb-1"><strong>Início:</strong> {formatarData(lote.dataInicio)}</p>
                <p className="mb-1"><strong>Fim:</strong> {formatarData(lote.dataFim)}</p>
                <p className="mb-1"><strong>Quantidade:</strong> {lote.quantidade}</p>
                <p className="mb-2">
                  <strong>Valor:</strong>{' '}
                  {lote.gratuito ? 'Gratuito' : `R$ ${Number(lote.precoUnitario).toFixed(2)}`}
                </p>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => abrirModalEdicao(lote)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => excluirLote(lote.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {lotes.length > 0 && (
        <div className="mt-4 d-flex gap-2">
          <Link to="/organizador/eventos/novo" className="btn btn-outline-secondary">
            Voltar
          </Link>
          <button className="btn btn-success" onClick={finalizarCadastro}>
            Finalizar
          </button>
        </div>
      )}

      {tipoLote && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={salvarLote}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {loteEditando
                      ? 'Editar lote'
                      : tipoLote === 'GRATUITO'
                        ? 'Cadastrar lote gratuito'
                        : 'Cadastrar lote pago'}
                  </h5>
                  <button type="button" className="btn-close" onClick={fecharModal} />
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nome do lote</label>
                    <input type="text" name="nome" className="form-control"
                      value={lote.nome} onChange={alterarCampo} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Início das vendas</label>
                    <input type="datetime-local" name="dataInicio" className="form-control"
                      value={lote.dataInicio} onChange={alterarCampo} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fim das vendas</label>
                    <input type="datetime-local" name="dataFim" className="form-control"
                      value={lote.dataFim} onChange={alterarCampo} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Quantidade</label>
                    <input type="number" name="quantidade" className="form-control"
                      value={lote.quantidade} onChange={alterarCampo} min="1" required />
                  </div>
                  {tipoLote === 'PAGO' && (
                    <div className="mb-3">
                      <label className="form-label">Preço unitário</label>
                      <div className="input-group">
                        <span className="input-group-text">R$</span>
                        <input type="number" name="precoUnitario" className="form-control"
                          value={lote.precoUnitario} onChange={alterarCampo} min="1" step="1" required />
                      </div>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={fecharModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    {loteEditando ? 'Salvar alterações' : 'Adicionar lote'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CadastroLotes