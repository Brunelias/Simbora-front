import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  function sair() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Simbora
        </Link>

        <div className="navbar-nav me-auto">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/eventos">Eventos</Link>

          {usuario?.tipo === 'ORGANIZADOR' && (
            <Link className="nav-link" to="/organizador">Painel do organizador</Link>
          )}

          {usuario?.tipo === 'CLIENTE' && (
            <Link className="nav-link" to="/cliente">Meus ingressos</Link>
          )}

          {usuario?.tipo === 'ADMIN' && (
            <>
              <Link className="nav-link" to="/organizador">Organizadores</Link>
              <Link className="nav-link" to="/cliente">Clientes</Link>
              <Link className="nav-link" to="/admin">Admin</Link>
            </>
          )}
        </div>

        <div className="navbar-nav ms-auto">
          {usuario ? (
            <>
              <span className="nav-link text-white opacity-75">
                Olá, {usuario.nome.split(' ')[0]}
              </span>
              <button
                className="btn btn-outline-light btn-sm ms-2"
                onClick={sair}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link text-white opacity-75" to="/cadastro-organizador">
                Seja um organizador
              </Link>
              <Link className="nav-link text-white opacity-75" to="/cadastro">
                Criar conta
              </Link>
              <Link className="btn btn-outline-light btn-sm ms-2" to="/login">
                Entrar
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar