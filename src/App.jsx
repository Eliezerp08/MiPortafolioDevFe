import { useState, useEffect } from 'react';
import './index.css';

function App() {
  // --- ESTADOS GLOBALES ---
  const [cartelera, setCartelera] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // --- ESTADOS PARA AGREGAR PELÍCULA ---
  const [formPelicula, setFormPelicula] = useState({
    titulo: '',
    sinopsis: '',
    precio: '',
    tipo: '',
    genero: ''
  });
  const [loadingPelicula, setLoadingPelicula] = useState(false);
  const [mensajePelicula, setMensajePelicula] = useState('');

  // --- ESTADOS PARA AGREGAR RESEÑA ---
  const [formData, setFormData] = useState({
    usuario_id: '',
    produccion_id: '',
    calificacion: '5',
    comentario: ''
  });
  const [loadingForm, setLoadingForm] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  // --- CARGAR DATOS INICIALES ---
  const fetchData = async () => {
    try {
      const [resCartelera, resUsuarios] = await Promise.all([
        fetch(`${API_URL}/cartelera`),
        fetch(`${API_URL}/users`) 
      ]);
      setCartelera(await resCartelera.json());
      setUsuarios(await resUsuarios.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [API_URL]);

  // --- MANEJADORES DE PELÍCULA ---
  const handleChangePelicula = (e) => {
    setFormPelicula({ ...formPelicula, [e.target.name]: e.target.value });
  };

  const handleSubmitPelicula = async (e) => {
    e.preventDefault();
    setLoadingPelicula(true);
    setMensajePelicula('');

    // Convertimos el string de género a un array antes de enviar
    const datosAEnviar = {
      ...formPelicula,
      precio: Number(formPelicula.precio),
      genero: formPelicula.genero ? formPelicula.genero.split(',').map(g => g.trim()) : []
    };

    try {
      const response = await fetch(`${API_URL}/cartelera`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosAEnviar),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || errData.message || 'Error al agregar la producción');
      }

      setMensajePelicula('¡Producción agregada con éxito!');
      setFormPelicula({ titulo: '', sinopsis: '', precio: '', tipo: '', genero: '' });
      fetchData(); // Recarga la cartelera
    } catch (err) {
      setMensajePelicula(err.message);
    } finally {
      setLoadingPelicula(false);
    }
  };

  // --- MANEJADORES DE RESEÑA ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    setError('');
    setExito(false);

    try {
      const response = await fetch(`${API_URL}/resenas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorDelBackend = await response.json();
        throw new Error(errorDelBackend.error || errorDelBackend.message || 'Error al enviar la reseña');
      }

      setExito(true);
      setFormData({ usuario_id: '', produccion_id: '', comentario: '', calificacion: '5' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingForm(false);
    }
  };

  // --- INTERFAZ GRÁFICA (JSX) ---
  return (
    <div>
        <header className="navbar">
            <div className="logo">CineApp</div>
            <nav>
                <ul className="nav-links">
                    <li><a href="#inicio">Inicio</a></li>
                    <li><a href="#cartelera">Cartelera</a></li>
                    <li><a href="#agregar-pelicula">Agregar</a></li>
                    <li><a href="#nueva-resena">Reseñas</a></li>
                </ul>
            </nav>
        </header>

        <main>
            <section id="inicio" className="section sobre-mi">
                <div className="sobre-mi-container">
                    <div className="sobre-mi-texto">
                        <h1>Bienvenido a CineApp</h1>
                        <p>Descubre los últimos estrenos y comparte tu opinión.</p>
                    </div>
                </div>
            </section>

            {/* SECCIÓN CARTELERA */}
            <section id="cartelera" className="section">
                <h2>Cartelera Actual</h2>
                <div id="proyectos-grid" className="proyectos-grid">
                    {loadingData ? (
                        <p>Cargando datos...</p>
                    ) : cartelera.length === 0 ? (
                        <p>No hay producciones en cartelera.</p>
                    ) : (
                        cartelera.map((produccion) => (
                            <div key={produccion._id} className="proyecto-card">
                                <h3>{produccion.titulo}</h3>
                                <p><strong>Tipo:</strong> {produccion.tipo === 'pelicula' ? 'Película' : 'Serie'}</p>
                                <p><strong>Género:</strong> {produccion.genero.join(', ')}</p>
                                <p><strong>Precio:</strong> ${produccion.precio}</p>
                                <p>{produccion.sinopsis}</p>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* SECCIÓN AGREGAR PELÍCULA / SERIE */}
            <section id="agregar-pelicula" className="section">
                <h2>Agregar Nueva Producción</h2>
                <form className="contacto-form" onSubmit={handleSubmitPelicula}>
                    
                    <div className="form-group">
                        <label htmlFor="titulo">Título:</label>
                        <input 
                            type="text" id="titulo" name="titulo" required
                            value={formPelicula.titulo} onChange={handleChangePelicula} 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tipo">Tipo:</label>
                        <select id="tipo" name="tipo" value={formPelicula.tipo} onChange={handleChangePelicula} required>
                            <option value="">Selecciona una opción</option>
                            <option value="pelicula">Película</option>
                            <option value="serie">Serie</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="genero">Género:</label>
                        <input 
                            type="text" id="genero" name="genero" placeholder="Ej. Acción, Comedia"
                            value={formPelicula.genero} onChange={handleChangePelicula} 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="sinopsis">Sinopsis:</label>
                        <textarea 
                            id="sinopsis" name="sinopsis" rows="3" required
                            value={formPelicula.sinopsis} onChange={handleChangePelicula}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="precio">Precio:</label>
                        <input 
                            type="number" id="precio" name="precio" step="0.01" min="0" required placeholder="Ej. 10.99 (0 si es gratis)"
                            value={formPelicula.precio} onChange={handleChangePelicula} 
                        />
                    </div>

                    <button type="submit" disabled={loadingPelicula}>
                        {loadingPelicula ? 'Agregando...' : 'Agregar Producción'}
                    </button>
                </form>
                {mensajePelicula && <p style={{marginTop: '10px'}}>{mensajePelicula}</p>}
            </section>

            {/* SECCIÓN AGREGAR RESEÑA */}
            <section id="nueva-resena" className="section">
                <h2>Escribe una Reseña</h2>
                <form id="formulario-contacto" className="contacto-form" onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label htmlFor="usuario_id">Usuario:</label>
                        <select id="usuario_id" name="usuario_id" value={formData.usuario_id} onChange={handleChange} required>
                            <option value="">Selecciona tu usuario</option>
                            {usuarios.map(user => (
                                <option key={user._id} value={user._id}>{user.nombre} {user.apellido}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="produccion_id">Producción:</label>
                        <select id="produccion_id" name="produccion_id" value={formData.produccion_id} onChange={handleChange} required>
                            <option value="">Selecciona una producción</option>
                            {cartelera.map(prod => (
                                <option key={prod._id} value={prod._id}>{prod.titulo}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="calificacion">Calificación (1-5):</label>
                        <input 
                            type="number" id="calificacion" name="calificacion" min="1" max="5" required
                            value={formData.calificacion} onChange={handleChange} 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="comentario">Comentario:</label>
                        <textarea 
                            id="comentario" name="comentario" rows="4" required
                            value={formData.comentario} onChange={handleChange}
                        ></textarea>
                    </div>

                    <button type="submit" disabled={loadingForm}>
                        {loadingForm ? 'Enviando...' : 'Publicar Reseña'}
                    </button>
                </form>
                
                {exito && <p style={{color: 'green', marginTop: '10px'}}>¡Reseña publicada con éxito!</p>}
                {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}
            </section>
        </main>
    </div>
  );
}

export default App;