import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../config/axios'
import { useAuth } from '../../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [dados, setDados] = useState({ email: '', senha: '' })
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  function alterarCampo(event) {
    const { name, value } = event.target
    setDados({ ...dados, [name]: value })
  }

  function entrar(event) {
    event.preventDefault()
    setErro('')
    setCarregando(true)

    api.post('/auth', dados)
      .then((response) => {
        login(response.data)

        const tipo = response.data.tipo
        if (tipo === 'ADMIN') navigate('/admin')
        else if (tipo === 'ORGANIZADOR') navigate('/organizador')
        else navigate('/cliente')
      })
      .catch(() => {
        setErro('E-mail ou senha incorretos.')
      })
      .finally(() => {
        setCarregando(false)
      })
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-sm" style={{ width: '100%', maxWidth: '420px' }}>
        <div className="card-body p-4">
          <h4 className="card-title mb-1">Entrar</h4>
          <p className="text-muted mb-4">Acesse sua conta para continuar.</p>

          {erro && (
            <div className="alert alert-danger py-2">{erro}</div>
          )}

          <form onSubmit={entrar}>
            <div className="mb-3">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={dados.email}
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
                value={dados.senha}
                onChange={alterarCampo}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mt-2"
              disabled={carregando}
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login