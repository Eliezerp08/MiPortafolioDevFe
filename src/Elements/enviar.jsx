import React from 'react';

function Entorno() {
  // Lista de tecnologías que manejas
  const tecnologias = ['React', 'JavaScript', 'Node.js', 'Express', 'Git', 'Vite'];

  return (
    <div style={{ marginTop: '32px', padding: '20px', borderTop: '1px solid var(--border)' }}>
      <h2>Mi Entorno y Tecnologías</h2>
      <p>Estas son las herramientas con las que construyo mis proyectos:</p>
      
      <ul style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '10px', 
        listStyle: 'none', 
        padding: 0,
        justifyContent: 'center',
        marginTop: '16px'
      }}>
        {tecnologias.map((tech, index) => (
          <li key={index} style={{ 
            background: 'var(--accent-bg)', 
            color: 'var(--accent)',
            padding: '8px 16px', 
            borderRadius: '8px',
            fontWeight: 'bold'
          }}>
            {tech}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Entorno;