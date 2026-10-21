import { useState, useEffect } from 'react'
import './App.css'
import Saludo from './Elements/boton'
import Notificaciones from './Elements/notificcion'
import Like from './Elements/like'
import PerfilGithub from './Elements/TarjetaGit'

function App() {
  // Estado para guardar los datos que vienen de Express
  const [datosBackend, setDatosBackend] = useState(null);

  // useEffect se ejecuta automáticamente cuando el componente se renderiza por primera vez
  useEffect(() => {
    // Reemplaza el puerto 5000 y la ruta por la URL real de tu backend en ProyectoExpress
    fetch('http://localhost:3000/api/proyectos')
      .then(respuesta => {
        if (!respuesta.ok) throw new Error('Error en la red');
        return respuesta.json();
      })
      .then(datos => setDatosBackend(datos))
      .catch(error => console.error('Error conectando al backend:', error));
  }, []); // El arreglo vacío indica que solo se ejecuta una vez

  return (
    <div> 
      <Saludo /> 
      <Notificaciones /> 
      <Like /> 
      <PerfilGithub />

      {/* Sección nueva para mostrar la respuesta de tu servidor Express */}
      <div style={{ marginTop: '32px', padding: '20px', borderTop: '1px solid var(--border)' }}>
        <h2>Datos desde Express</h2>
        {datosBackend ? (
           // Renderiza los datos obtenidos; ajusta esto según el JSON que envíe tu backend
          <pre style={{ textAlign: 'left', background: 'var(--code-bg)', padding: '10px' }}>
            {JSON.stringify(datosBackend, null, 2)}
          </pre>
        ) : (
          <p>Cargando datos del backend...</p>
        )}
      </div>
    </div>
  )
}

export default App
