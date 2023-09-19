import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom"
import api from "../api/api"
import swal from "sweetalert";


// eslint-disable-next-line react/prop-types
export const Navegacion = () => {

  const [rol, setRol] = useState('');
  let ID = localStorage.getItem('id');
  const getuser = async () => {
    try {
      const resp = await api.get(`auth/usuario/${ID}`);
      setRol(resp.data.usuario[0].rol);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getuser();
  }, [])

  const logout = (e) => {
    e.preventDefault();
    swal({
      title: "Estas seguro que deseas salir?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(async (willDelete) => {
      if (willDelete){
      localStorage.removeItem('id');
      swal("Vuelve Pronto!", {
        icon: "success",
      });
      setTimeout(() => {
      location.href="/";
      }, 1300);
      }
    });
  }

  return (
    <>
      <nav>
        <NavLink to={'/'} className="navlink"><h1>Blog</h1></NavLink>
        <div className="links">
          {
            ID == null ?
              <>
                <NavLink to={'/Login'} className="navlink">Login</NavLink>
                <NavLink to={'/register'} className="navlink">Register</NavLink>
              </> : rol == "admin" ?
                <>
                  <NavLink to={'/admin'} className="navlink">Crear post</NavLink>
                  <NavLink to={'/logout'} className="navlink" onClick={logout}>Salir</NavLink>
                </> : 
                <>
                <NavLink to={'/logout'} className="navlink" onClick={logout}>Salir</NavLink>
              </>
          }
        </div>
      </nav>
    </>
  )
}
