/* eslint-disable react/prop-types */
import { NavLink } from 'react-router-dom';
import swal from 'sweetalert'
import api from '../api/api';
import { useEffect, useState } from 'react';

export const CardArticulo = ({id,titulo,desc,autor,fecha, img}) => {

  const dia = fecha.split('T');
  const hora = dia[1].split(":").slice(0, 2).join(":");
  const [rol, setRol] = useState('');
  let ID = localStorage.getItem('id');

  const getuser = async () => {
    try {
      const resp = await api.get(`auth/usuario/${ID}`);
      setRol(resp.data.usuario.rol);
    } catch (error) {
      console.log(error);
    }
  }

  const eliminarArticulo = (e) => {
    e.preventDefault();
    swal({
      title: "Estas seguro que deseas eliminar?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(async (willDelete) => {
      if (willDelete) {
        try {
          const resp = await api.delete(`/articulos/articulo/${id}`);
          console.log(resp);
          swal("Articulo eliminado!", {
            icon: "success",
          });
          setTimeout(() => {
            location.href = '/';
          }, "1500");
          
          
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  useEffect(() => {
    getuser();
  }, [])
  return (
   <>
    <div className="articulo-container">
      <img src={img} alt={titulo} />
      <div className='articulo-inner'>
        <div className="titulo">
        <NavLink className="navlink" to={`/articulo/${id}`} state={{dia: dia, hora: hora}}>
          <h1>{titulo}</h1>
        </NavLink>
        {rol == "admin" ? <>
        <div>
          <NavLink to={`/editar/${id}`} className="navlink">
          <span>📝</span>
          </NavLink>
        <span onClick={eliminarArticulo}>❌</span>
        </div>
        </> : ''}
        </div>
        <p><strong>by {autor} </strong>{dia[0] +" - "+ dia[1].split(":").slice(0, 2).join(":")}</p>
        <p dangerouslySetInnerHTML={{__html: desc}}></p>
      </div>
    </div>
   </>
  )
}
