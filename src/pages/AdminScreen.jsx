/* eslint-disable no-unused-vars */
import { Container, FormGroup } from "react-bootstrap"
import { Navegacion } from "../components/Navegacion"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from "react";
import api from "../api/api";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from "axios";
import swal from "sweetalert";
import { useEffect } from "react";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false]}],
    [{ font: []}],
    [{ size: []}],
    ['bold','italic','underline','strike','blockquote'],
    [
      {list: 'orderer'},
      {list: 'bullet'},
      {indent: '-1'},
      {indent: '+1'},
    ],
    ['link','image','video'],
  ]
}

export const AdminScreen = () => {

  const instance = axios.create()

  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [descripcion, setDesc] = useState('');
  const [imagen, setImagen] = useState("");
  const [autor, setAutor] = useState("");
  const [imageInput, setImageInput] = useState();

  
  const enviarForm =  async (e) => {
    e.preventDefault();
    // Subir Imagen
    const files = imageInput;
    if(files == undefined){
      swal("Elige una imagen de portada." ,  "" ,  "warning" )
    }else{
      const formData = new FormData();
    formData.append('file', files[0]);
    formData.append("upload_preset", "test_preset");
    formData.append("cloud_name","dwjhbrsmf");
    const res = await instance.post("https://api.cloudinary.com/v1_1/dwjhbrsmf/image/upload", formData);
    setImagen(res.data.secure_url);
    const imagen = res.data.secure_url;
    try {
      const resp = await api.post('/articulos/articulo',{
        titulo,
        descripcion,
        contenido,
        autor,
        imagen
      })
      swal("Articulo creado!" ,  "" ,  "warning" )
      setTimeout(() => {
        location.href = '/admin';
      }, 1000);
    } catch (error) {
      console.log(error);
    }
    }
    
    
  }
  const getuser = async () => {
    let ID = localStorage.getItem('id');
    try {
      const resp = await api.get(`auth/usuario/${ID}`);
      setAutor(resp.data.usuario.username);
    } catch (error) {
      console.log(error);
    }
  }
  const setImageC = (e) => {
    setImageInput(e.target.files)
  }

  useEffect(() => {
    getuser();
  },[])

  return (
    <>
        <Navegacion adminpage={true}/>
        <form className="form-admin" onSubmit={enviarForm}>
          <h1>AGREGAR ARTICULO</h1>
          <input type="text" placeholder="Titulo" required value={titulo} onChange={(e) => setTitulo(e.target.value)} />
          <input type="text" placeholder="Descripcion"  required value={descripcion} onChange={(e) => setDesc(e.target.value)} />
          <div>
            <p>PORTADA: </p>
          <input type="file" name='file' onChange={setImageC}/>
          </div>
          <ReactQuill
          theme="snow"
          value={contenido}
          onChange={setContenido}
          modules={modules} />
          <button type="submit">Enviar</button>
        </form>
        {/* <Container>
          <h4>Agregar Articulo</h4>
        <Form onSubmit={enviarForm}>
      <Form.Group className="mb-3" controlId="formBasicEmail" >
        <Form.Label>Titulo</Form.Label>
        <Form.Control type="text" placeholder="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)}/>
      </Form.Group>
      <label htmlFor="file">Imagen de Portada</label>
      <br />
      <input type="file" name='file' onChange={setImageC}/>
      {/* <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Descripcion</Form.Label>
        <Form.Control type="text" placeholder="descripcion" value={descripcion} onChange={(e) => setDesc(e.target.value)}/>
      </Form.Group>
      <ReactQuill
          theme="snow"
          value={descripcion}
          onChange={setDesc}
          modules={modules} />
      <Button variant="primary" type="submit">
        Guardar
      </Button>
    </Form>
        </Container> */}
    </>
  )
}
