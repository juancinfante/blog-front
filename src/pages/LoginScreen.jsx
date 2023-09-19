import { useState } from "react"
import { Navegacion } from "../components/Navegacion"
import api from "../api/api";
import { useNavigate } from "react-router";
import swal from "sweetalert";


export const LoginScreen = () => {

    const navigate = useNavigate();
    if(localStorage.getItem('id') !== null){
      location.href = '/';
    }
    const [username, setUsername] = useState('');
    const [contraseña, setContraseña] = useState('');

    const login = async (e) => {
      e.preventDefault();

      try {
        const resp = await api.post('/auth/login',{
          username,
          contraseña
        })
        localStorage.setItem('id', resp.data.id);
        swal( resp.data.msg ,  "" ,  "success" )
        navigate('/');
      } catch (error) {
        swal( error.response.data.msg ,  "" ,  "error" )
      }
    }
  return (
    <>
        <Navegacion/>
        <div className="auth">
            <div className="container">
            <h3>Login</h3>
            <form onSubmit={login}>
            <input type="text" required placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input type="password" required placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)}/>
            <button>INGRESAR</button>
            </form>
            </div>
        </div>
    </>
  )
}
