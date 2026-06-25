import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import api from '../../config/axios'
import { useAuth } from '../../context/AuthContext'

function ConfirmarCompra() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { usuario } = useAuth()

  const itens = location.state?.itens || []

  const [formasPagamento, setFormasPagamento] = useState([])
  const [idFormaPagamento, setIdFormaPagamento] = useState('')
  const [salvando, setSalvando] = useState(false)

  const totalCompra = itens.reduce((total, item) => {
    return total + Number(item.valorUnitario) * Number(item.quantidade)
  }, 0)

  const compraGratuita = totalCompra === 0

  useEffect(() => {
    if (!compraGratuita) {
      api
        .get(`/formas-pagamento`)
        .then((response) => setFormasPagamento(response.data))
        .catch((error) => console.error('Erro ao buscar formas de pagamento:', error))
    }
  }, [])

  function finalizarCompra() {
    if (!compraGratuita && !idFormaPagamento) {
      alert('Selecione uma forma de pagamento.')
      return
    }

    if (itens.length === 0) {
      alert('Nenhum ingresso selecionado.')
      return
    }

    const compra = {
      idCliente: usuario.id,
      idFormaPagamento: compraGratuita ? null : Number(idFormaPagamento),
      itens: itens.map((item) => ({
        idLote: item.idLote,
        quantidade: item.quantidade,
        valorUnitario: Number(item.valorUnitario)
      }))
    }

    setSalvando(true)

    api
      .post(`/compras`, compra)
      .then(() => {
        alert('Compra realizada com sucesso!')
        navigate('/cliente')
      })
      .catch((error) => {
        console.error('Erro ao finalizar compra:', error)
        alert(typeof error.response?.data === 'string'
          ? error.response.data
          : 'Erro ao finalizar compra.')
      })
      .finally(() => setSalvando(false))
  }

  return (
    <div>
      <h1>Confirmar compra</h1>
      <p className="text-muted">Confira seus ingressos e finalize a compra.</p>

      {itens.length === 0 && (
        <div className="alert alert-warning">Nenhum item selecionado para compra.</div>
      )}

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h4>Resumo da compra</h4>

          {itens.map((item) => (
            <div className="d-flex justify-content-between border-bottom py-3" key={item.idLote}>
              <div>
                <strong>{item.nome}</strong>
                <p className="text-muted mb-0">Quantidade: {item.quantidade}</p>
              </div>
              <div>
                {Number(item.valorUnitario) === 0
                  ? 'Gratuito'
                  : `R$ ${(Number(item.valorUnitario) * Number(item.quantidade)).toFixed(2)}`}
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-between mt-4">
            <h4>Total</h4>
            <h4>{compraGratuita ? 'Gratuito' : `R$ ${totalCompra.toFixed(2)}`}</h4>
          </div>
        </div>
      </div>

      {!compraGratuita && (
        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h4>Forma de pagamento</h4>
            <select
              className="form-select mt-3"
              value={idFormaPagamento}
              onChange={(e) => setIdFormaPagamento(e.target.value)}
              required
            >
              <option value="">Selecione uma forma de pagamento</option>
              {formasPagamento.map((forma) => (
                <option key={forma.id} value={forma.id}>{forma.nome}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="mt-4 d-flex gap-2">
        <Link to={`/eventos/${id}/compra`} className="btn btn-outline-secondary">
          Voltar
        </Link>
        <button
          className="btn btn-success"
          onClick={finalizarCompra}
          disabled={salvando || itens.length === 0}
        >
          {salvando ? 'Finalizando...' : 'Finalizar compra'}
        </button>
      </div>
    </div>
  )
}

export default ConfirmarCompra