import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../config/axios'
import { useAuth } from '../../context/AuthContext'

function CadastroOrganizador() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [organizador, setOrganizador] = useState({
    nome: '',
    email: '',
    celular: '',
    documento: '',
    senha: '',
    confirmacaoSenha: ''
  })

  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  function alterarCampo(event) {
    const { name, value } = event.target
    setOrganizador({ ...organizador, [name]: value })
  }

  function cadastrar(event) {
    event.preventDefault()
    setErro('')

    if (organizador.senha !== organizador.confirmacaoSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    setCarregando(true)

    const { confirmacaoSenha, ...dadosParaEnviar } = organizador

    api.post('/organizadores', dadosParaEnviar)
      .then(() => {
        return api.post('/auth', {
          email: organizador.email,
          senha: organizador.senha
        })
      })
      .then((response) => {
        login(response.data)
        navigate('/organizador')
      })
      .catch((error) => {
        console.error('Erro ao cadastrar:', error)
        setErro(error.response?.data || 'Erro ao realizar cadastro. Verifique os dados e tente novamente.')
      })
      .finally(() => {
        setCarregando(false)
      })
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-sm" style={{ width: '100%', maxWidth: '480px' }}>
        <div className="card-body p-4">
          <h4 className="card-title mb-1">Seja um organizador</h4>
          <p className="text-muted mb-4">
            Crie sua conta e comece a vender ingressos.
          </p>

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
                value={organizador.nome}
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
                value={organizador.email}
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
                value={organizador.celular}
                onChange={alterarCampo}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">CPF ou CNPJ</label>
              <input
                type="text"
                name="documento"
                className="form-control"
                value={organizador.documento}
                onChange={alterarCampo}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input
                type="password"
                name="senha"
                className="form-control"
                value={organizador.senha}
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
                value={organizador.confirmacaoSenha}
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
              Já tem conta? <Link to="/login">Entrar</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CadastroOrganizador