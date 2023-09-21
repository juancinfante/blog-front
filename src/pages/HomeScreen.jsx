/* eslint-disable no-unused-vars */
import { Navegacion } from "../components/Navegacion"
import { CardArticulo } from "../components/CardArticulo"
import api from "../api/api"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"



export const HomeScreen = () => {
  
  const navigate = useNavigate();
  const [articulos, setArticulos] = useState([]);
  const [usuarioID, setUsuarioid] = useState(localStorage.getItem('id'));
  const obtenerArticulos = async () => {
    try {
      const articulos = await api.get('/articulos/articulos');
      setArticulos(articulos.data.articulos)
    } catch (error) {
      if(error.response.status == 401){
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        navigate('/login');
      }
    }
  }

  useEffect(() => {
    obtenerArticulos();
  }, [])


  return (
    <>
        <Navegacion />
          {articulos.map((articulo) =>{
            return <CardArticulo 
            key={articulo._id}
            id={articulo._id}
            titulo={articulo.titulo}
            desc={articulo.descripcion}
            autor={articulo.autor}
            fecha={articulo.created_at}
            img={articulo.imagen} />
          })}
    </>
  )
}
