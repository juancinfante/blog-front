import { useState } from "react";
import { Navegacion } from "../components/Navegacion"
import { useNavigate } from 'react-router';

import api from "../api/api"
import swal from "sweetalert";


export const RegisterScreen = () => {

    const navigate = useNavigate();
    if(localStorage.getItem('id') !== null){
        location.href = '/';
      }
    const [username, setUsername] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [contraseña2, setContraseña2] = useState('');

    const registrar = async (e) => {
        e.preventDefault();
        if(contraseña == contraseña2){
            try {
                const resp = await api.post('/auth/register',{
                    username,
                    contraseña
                })
                localStorage.setItem('id',resp.data.id);
                swal( resp.data.msg ,  "" ,  "success" )

                navigate('/');
            } catch (error) {
                swal( error.response.data.msg ,  "" ,  "success" )

            }
        }else{
            alert('Las contraseñas no son iguales');
        }
    }

  return (
    <>
        <Navegacion/>
        <div className="auth">
            <div className="container">
            <h3>Registro</h3>
            <form onSubmit={registrar}>
            <input type="text" required placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} minLength={8} maxLength={15}/>
            <input type="password" required placeholder="Contraseña" value={contraseña} onChange={(e) => setContraseña(e.target.value)} minLength={6} maxLength={10}/>
            <input type="password" required placeholder="Repetir Contraseña" value={contraseña2} onChange={(e) => setContraseña2(e.target.value)} minLength={6} maxLength={10}/>
            <button type="submit">REGISTRARSE</button>
            </form>
            </div>
        </div>
    </>
  )
}
