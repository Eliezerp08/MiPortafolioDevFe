import { useState, useEffect } from 'react';

function PerfilGithub() {
  const [usuario, setUsuario] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const url = 'https://api.github.com/users/SlinkAlex/repos';

    fetch(url)
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('No se pudo obtener la información');
        }
        // Solución al error de fetch: retornar el JSON correctamente
        return respuesta.json(); 
      })
      .then((datos) => {
        setUsuario(datos); 
        setCargando(false);
      })
      .catch((error) => {
        console.error("Hubo un error:", error);
        setCargando(false);
      });
  }, []); 

  if (cargando) return <p>Cargando información de GitHub...</p>;

  return (  
    <div>
      <h2>Mis Repositorios en GitHub</h2>
      <ul>
        {/* Solución al error de Vite: Sintaxis correcta de map y etiquetas */}
        {usuario.map((repo) => (   
          <li key={repo.id}>
            {repo.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PerfilGithub;