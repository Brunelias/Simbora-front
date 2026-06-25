import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../config/axios'
import { useAuth } from '../../context/AuthContext'

function CadastroCliente() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [cliente, setCliente] = useState({
    nome: '',
    email: '',
    celular: '',
    senha: '',
    confirmacaoSenha: ''
  })

  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  function alterarCampo(event) {
    const { name, value } = event.target
    setCliente({ ...cliente, [name]: value })
  }

  function cadastrar(event) {
    event.preventDefault()
    setErro('')

    if (cliente.senha !== cliente.confirmacaoSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    setCarregando(true)

    const { confirmacaoSenha, ...dadosParaEnviar } = cliente

    api.post('/clientes', dadosParaEnviar)
      .then(() => {
        return api.post('/auth', {
          email: cliente.email,
          senha: cliente.senha
        })
      })
      .then((response) => {
        login(response.data)
        navigate('/cliente')
      })
      .catch((error) => {
        console.error('Erro ao cadastrar:', error)
        setErro('Erro ao realizar cadastro. Verifique os dados e tente novamente.')
      })
      .finally(() => {
        setCarregando(false)
      })
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-sm" style={{ width: '100%', maxWidth: '480px' }}>
        <div className="card-body p-4">
          <h4 className="card-title mb-1">Criar conta</h4>
          <p className="text-muted mb-4">Preencha seus dados para se cadastrar.</p>

          {erro && (
            <div className="alert alert-danger py-2">{erro}</div>
          )}

          <form onSubmit={cadastrar}>
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
                name="email"
                className="form-control"
                value={cliente.email}
                onChange={alterarCampo}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Celular</label>
              <input
                type="text"
                name="celular"
                className="form-control"
                value={cliente.celular}
                onChange={alterarCampo}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input
                type="password"
                name="senha"
                className="form-control"
                value={cliente.senha}
                onChange={alterarCampo}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirmar senha</label>
              <input
                type="password"
                name="confirmacaoSenha"
                className="form-control"
                value={cliente.confirmacaoSenha}
                onChange={alterarCampo}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mt-2"
              disabled={carregando}
            >
              {carregando ? 'Cadastrando...' : 'Criar conta'}
            </button>

            <p className="text-center text-muted mt-3 mb-0">
              Já tem conta?{' '}
              <Link to="/login">Entrar</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CadastroCliente