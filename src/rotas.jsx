import { Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Home from './views/Home'
import Login from './views/auth/Login'
import ConsultaEventos from './views/eventos/ConsultaEventos'
import DetalhesEvento from './views/eventos/DetalhesEvento'
import CompraIngresso from './views/compras/CompraIngresso'
import ConfirmarCompra from './views/compras/ConfirmarCompra'
import PerfilOrganizador from './views/organizadores/PerfilOrganizador'
import EditarOrganizador from './views/organizadores/EditarOrganizador'
import CadastroEvento from './views/eventos/CadastroEvento'
import EditarEvento from './views/eventos/EditarEvento'
import CadastroLotes from './views/lotes/CadastroLotes'
import PerfilCliente from './views/clientes/PerfilCliente'
import EditarCliente from './views/clientes/EditarCliente'
import CadastroCliente from './views/clientes/CadastroCliente'
import CadastroOrganizador from './views/organizadores/CadastroOrganizador'

function RotaProtegida({ roles, children }) {
  const { usuario } = useAuth()

  if (!usuario) return <Navigate to="/login" />
  if (roles && !roles.includes(usuario.tipo)) return <Navigate to="/" />

  return children
}

const rotas = [
  { path: '/',          element: <Home /> },
  { path: '/login',     element: <Login /> },
  { path: '/eventos',   element: <ConsultaEventos /> },
  { path: '/eventos/:id', element: <DetalhesEvento /> },
  { path: '/cadastro', element: <CadastroCliente /> },
  { path: '/cadastro-organizador', element: <CadastroOrganizador /> },

  {
    path: '/eventos/:id/compra',
    element: (
      <RotaProtegida roles={['CLIENTE', 'ADMIN']}>
        <CompraIngresso />
      </RotaProtegida>
    )
  },
  {
    path: '/eventos/:id/compra/confirmar',
    element: (
      <RotaProtegida roles={['CLIENTE', 'ADMIN']}>
        <ConfirmarCompra />
      </RotaProtegida>
    )
  },
  {
    path: '/cliente',
    element: (
      <RotaProtegida roles={['CLIENTE', 'ADMIN']}>
        <PerfilCliente />
      </RotaProtegida>
    )
  },
  {
    path: '/cliente/editar',
    element: (
      <RotaProtegida roles={['CLIENTE', 'ADMIN']}>
        <EditarCliente />
      </RotaProtegida>
    )
  },
  {
    path: '/organizador',
    element: (
      <RotaProtegida roles={['ORGANIZADOR', 'ADMIN']}>
        <PerfilOrganizador />
      </RotaProtegida>
    )
  },
  {
    path: '/organizador/editar',
    element: (
      <RotaProtegida roles={['ORGANIZADOR', 'ADMIN']}>
        <EditarOrganizador />
      </RotaProtegida>
    )
  },
  {
    path: '/organizador/eventos/novo',
    element: (
      <RotaProtegida roles={['ORGANIZADOR', 'ADMIN']}>
        <CadastroEvento />
      </RotaProtegida>
    )
  },
  {
    path: '/organizador/eventos/:id/editar',
    element: (
      <RotaProtegida roles={['ORGANIZADOR', 'ADMIN']}>
        <EditarEvento />
      </RotaProtegida>
    )
  },
  {
    path: '/organizador/eventos/:id/lotes',
    element: (
      <RotaProtegida roles={['ORGANIZADOR', 'ADMIN']}>
        <CadastroLotes />
      </RotaProtegida>
    )
  },
]

export default rotas