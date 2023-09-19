/* eslint-disable no-unused-vars */
import { Navegacion } from "../components/Navegacion"
import { CardArticulo } from "../components/CardArticulo"
import api from "../api/api"
import { useEffect, useState } from "react"



export const HomeScreen = () => {

  const [articulos, setArticulos] = useState([]);
  const [usuarioID, setUsuarioid] = useState(localStorage.getItem('id'));
  const obtenerArticulos = async () => {
    try {
      const articulos = await api.get('/articulos/articulos');
      setArticulos(articulos.data.articulos)
    } catch (error) {
      console.log(error);
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
            fecha={articulo.created_at}
            img={articulo.imagen} />
          })}
    </>
  )
}
