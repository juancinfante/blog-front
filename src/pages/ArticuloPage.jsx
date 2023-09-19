import { useLocation, useParams } from "react-router"
import { Navegacion } from "../components/Navegacion"
import { useEffect, useState } from "react";

import api from "../api/api";
import { NavLink } from "react-router-dom";

export const ArticuloPage = () => {

    const params = useParams();
    const location = useLocation();
    const { state } = location;
    const [contenido, setContenido] = useState('');
    const [dia, setDia] = useState(state.dia);
    const [hora, setHora] = useState(state.hora);
    const [rol, setRol] = useState('');
    let ID = localStorage.getItem('id');
    

    const eliminarArticulo = async () => {
        try {
            const resp = await api.delete(`/articulos/articulo/${params.id}`);
            console.log(resp);
        } catch (error) {
            console.log(error);
        }
    }

    const getuser = async () => {
        try {
          const resp = await api.get(`auth/usuario/${ID}`);
          setRol(resp.data.usuario[0].rol);
        } catch (error) {
          console.log(error);
        }
      }

    const obtenerArticulo = async () => {

        try {
            const resp = await api.get(`/articulos/articulo/${params.id}`);
            setContenido(resp.data.articulo[0]);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        obtenerArticulo();
        getuser();
    }, [])

    return (
        <>
            <Navegacion />
            <div className="articulo-page">
                <div className="header">
                    <h3>{contenido.titulo}</h3>
                    <p>{dia[0] + " " + hora} </p>
                    <p>by ADMIN</p>
                    {
                        rol == "admin" ?
                        <>
                        <div className="admin-option">
                        <NavLink to={`/editar/${params.id}`}>
                                    <button>EDITAR</button>
                                </NavLink>
                                <NavLink onClick={eliminarArticulo}>
                                    <button>ELIMINAR</button>
                                </NavLink> 
                        </div>
                               
                        
                        </>
                        : ""
                    }
                </div>
                <img src={contenido.imagen} alt="" />
                <div className="desc" dangerouslySetInnerHTML={{__html: contenido.descripcion}}>

                </div>
            </div>
        </>
    )
}
