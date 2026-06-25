import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import rotas from './rotas'

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="container mt-4">
        <Routes>
          {rotas.map((rota) => (
            <Route
              key={rota.path}
              path={rota.path}
              element={rota.element}
            />
          ))}
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App