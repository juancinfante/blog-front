/* eslint-disable no-unused-vars */
import { Container, FormGroup } from "react-bootstrap"
import { useParams } from "react-router"

import { Navegacion } from "../components/Navegacion"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from "react";
import api from "../api/api";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from "axios";

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
            { list: 'orderer' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
        ],
        ['link', 'image', 'video'],
    ]
}

export const EditorScreen = () => {

    const params = useParams();

    const instance = axios.create()

    const [titulo, setTitulo] = useState('');
    const [descripcion, setDesc] = useState('');
    const [contenido, setContenido] = useState('');
    const [autor, setAutor] = useState('');
    const [image, setImage] = useState('');
    const [imageInput, setImageInput] = useState();

    const obtenerArticulo = async () => {

        try {
            const resp = await api.get(`/articulos/articulo/${params.id}`);
            console.log(resp.data.articulo[0])
            setTitulo(resp.data.articulo[0].titulo);            
            setDesc(resp.data.articulo[0].descripcion);            
            setContenido(resp.data.articulo[0].contenido);            
            setAutor(resp.data.articulo[0].autor);            
            setImage(resp.data.articulo[0].imagen);            
        } catch (error) {
            console.log(error)
        }
    }

    const enviarForm = async (e) => {
        e.preventDefault();
        let imagen = "";
        const _id = params.id;
        // Subir Imagen
        const files = imageInput;
        if(files !== undefined){
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append("upload_preset", "test_preset");
        formData.append("cloud_name", "dwjhbrsmf");
        const res = await instance.post("https://api.cloudinary.com/v1_1/dwjhbrsmf/image/upload", formData);
        imagen = res.data.secure_url;
        console.log(imagen)
        }else{
            imagen = image;
        }
        try {
            const resp = await api.put('/articulos/articulo', {
                _id,
                titulo,
                descripcion,
                contenido,
                autor,
                imagen
            })
            console.log(resp);
            alert('Articulo editado!');
        } catch (error) {
            console.log(error);
        }

    }
    const setImageC = (e) => {
        setImageInput(e.target.files)
    }

    useEffect(() => {
        obtenerArticulo();
    }, [])

    return (
        <>
            <Navegacion adminpage={true} />
            <form className="form-admin" onSubmit={enviarForm}>
                <h1>EDITAR ARTICULO</h1>
                <input type="text" placeholder="Titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                <input type="text" placeholder="Descripcion" value={descripcion} onChange={(e) => setDesc(e.target.value)} />
                <div>
                    <p>PORTADA: </p>
                    <input type="file" name='file' onChange={setImageC} />
                </div>
                <ReactQuill
                    theme="snow"
                    value={contenido}
                    onChange={setContenido}
                    modules={modules} />
                <button type="submit">Enviar</button>
            </form>

        </>
    )
}
