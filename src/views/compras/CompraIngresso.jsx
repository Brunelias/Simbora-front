import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import api from '../../config/axios'

function CompraIngresso() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [lotes, setLotes] = useState([])
  const [quantidades, setQuantidades] = useState({})
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
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
      .finally(() => {
        setCarregando(false)
      })
  }, [id])

  function alterarQuantidade(idLote, valor, lote) {
    const maximo = lote.gratuito ? 1 : lote.quantidade
    const quantidade = Math.min(Math.max(0, Number(valor) || 0), maximo)
    setQuantidades({ ...quantidades, [idLote]: quantidade })
  }

  function adicionar(idLote, lote) {
    const maximo = lote.gratuito ? 1 : lote.quantidade
    if ((quantidades[idLote] || 0) >= maximo) return
    alterarQuantidade(idLote, (quantidades[idLote] || 0) + 1, lote)
  }

  function remover(idLote, lote) {
    alterarQuantidade(idLote, (quantidades[idLote] || 0) - 1, lote)
  }

  function calcularSubtotal(lote) {
    const quantidade = quantidades[lote.id] || 0
    return quantidade * Number(lote.precoUnitario)
  }

  function calcularTotal() {
    return lotes.reduce((total, lote) => total + calcularSubtotal(lote), 0)
  }

  function temItensSelecionados() {
    return lotes.some((lote) => (quantidades[lote.id] || 0) > 0)
  }

  function prosseguirCompra() {
    const itensSelecionados = lotes
      .filter((lote) => (quantidades[lote.id] || 0) > 0)
      .map((lote) => ({
        idLote: lote.id,
        nome: lote.nome,
        quantidade: quantidades[lote.id],
        valorUnitario: lote.precoUnitario
      }))

    if (itensSelecionados.length === 0) {
      alert('Selecione pelo menos um ingresso.')
      return
    }

    navigate(`/eventos/${id}/compra/confirmar`, {
      state: { itens: itensSelecionados }
    })
  }

  if (carregando) return <p>Carregando lotes...</p>

  return (
    <div>
      <h1>Comprar ingresso</h1>
      <p className="text-muted">Escolha seus ingressos e confirme a quantidade desejada.</p>

      <div className="mt-4">
        {lotes.length === 0 && (
          <div className="alert alert-info">
            Nenhum lote disponível para este evento.
          </div>
        )}

        {lotes.map((lote) => (
          <div className="card mb-3 shadow border" key={lote.id}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                <div>
                  <h4 className="card-title mb-2">{lote.nome}</h4>
                  <p className="mb-1">
                    <strong>Valor:</strong>{' '}
                    {lote.gratuito ? 'Gratuito' : `R$ ${Number(lote.precoUnitario).toFixed(2)}`}
                  </p>
                  <p className="text-muted mb-0">Disponível: {lote.quantidade}</p>
                  {lote.gratuito && (
                    <small className="text-muted">Limite de 1 ingresso por pessoa</small>
                  )}
                </div>

                <div className="text-end">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => remover(lote.id, lote)}
                    >-</button>

                    <input
                      type="number"
                      className="form-control text-center"
                      style={{ width: '80px' }}
                      min="0"
                      max={lote.gratuito ? 1 : lote.quantidade}
                      value={quantidades[lote.id] || 0}
                      onChange={(e) => alterarQuantidade(lote.id, e.target.value, lote)}
                    />

                    <button
                      className="btn btn-outline-success"
                      onClick={() => adicionar(lote.id, lote)}
                    >+</button>
                  </div>

                  {!lote.gratuito && (
                    <p className="mb-0">
                      <strong>Subtotal:</strong> R$ {calcularSubtotal(lote).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-sm mt-4">
        <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-3">
          <h4 className="mb-0">
            Total: R$ {calcularTotal().toFixed(2)}
          </h4>

          <div className="d-flex gap-2">
            <Link to={`/eventos/${id}`} className="btn btn-outline-secondary">
              Voltar
            </Link>
            <button
              className="btn btn-success"
              onClick={prosseguirCompra}
              disabled={!temItensSelecionados()}
            >
              Prosseguir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompraIngresso