import { useLocation, useParams } from "react-router"
import { Navegacion } from "../components/Navegacion"
import { useEffect, useState } from "react";

import api from "../api/api";
import { NavLink } from "react-router-dom";
import swal from "sweetalert";

export const ArticuloPage = () => {

    const params = useParams();
    const location = useLocation();
    const { state } = location;
    const [contenido, setContenido] = useState('');
    const [dia, setDia] = useState(state.dia);
    const [hora, setHora] = useState(state.hora);
    const [rol, setRol] = useState('');

    const [comentarios, setComentarios] = useState([]);
    const [texto, setTexto] = useState('');
    const [username, setUsername] = useState('');

    let ID = localStorage.getItem('id');
    
    const obtenerComentarios = async () => {
        try {
            const resp = await api.get(`/comentario/comentario/${params.id}`);
            setComentarios(resp.data.comentarios);
        } catch (error) {
            console.log(error);
        }
    }

    const comentar = async(e) => {
        e.preventDefault();
        if(ID == null){
        swal("Debe registrarse primero" ,  "" ,  "warning" );
        }else{
            let id_articulo = params.id;
            try {
                const resp = await api.post('comentario/comentario',{
                    id_articulo,
                    username,
                    texto
                })
                obtenerComentarios();
            } catch (error) {
                console.log(error)
            }
        }
    }

    const eliminarArticulo = async (e) => {
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
                const resp = await api.delete(`/articulos/articulo/${params.id}`);
                console.log(resp);
                swal("Articulo eliminado!", {
                  icon: "success",
                });
                setTimeout(() => {
                  window.location.href = '/';
                }, "1500");
                
                
              } catch (error) {
                console.log(error);
              }
            }
          });
    }

    const getuser = async () => {
        try {
          const resp = await api.get(`auth/usuario/${ID}`);
          setRol(resp.data.usuario.rol);
          setUsername(resp.data.usuario.username);
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
        obtenerComentarios();
    }, [])

    return (
        <>
            <Navegacion />
            <div className="articulo-page">
                <div className="header">
                    <h3>{contenido.titulo}</h3>
                    <p>{contenido.descripcion}</p>
                    <p>{dia[0] + " " + hora} </p>
                    <p>by {contenido.autor} </p>
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
                <div className="desc" dangerouslySetInnerHTML={{__html: contenido.contenido}}>
                </div>
                <div className="comentarios-container">
                <form onSubmit={comentar}>
                        <input type="text" placeholder="Ingrese comentario" value={texto} onChange={(e) => setTexto(e.target.value)}/>
                        <button type="submit">Enviar</button>
                    </form>
                    <h5>COMENTARIOS {comentarios.length} </h5>
                        {comentarios.toReversed().map((e) => {
                            return (
                          <div className="comentario" key={e._id}>
                            <img src="https://freesvg.org/img/user.png" alt="" />
                            <div className="comentario-info">
                            <p>{e.username}</p>
                            <p>{e.texto }</p>
                            </div>
                          </div>
                            )
                          
                        })}
                </div>
            </div>
        </>
    )
}
