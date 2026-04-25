import './App.css'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import Notfound from './pages/NotFound/Notfound'
import Main from './pages/Main/Main'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Main />} />

        <Route path="/login" element={<Login />} />

        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App