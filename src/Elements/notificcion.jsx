function Notificaciones({ mensajesNuevos }) {
  return (
    <div>
      <h1>Tus mensajes</h1>
      {mensajesNuevos > 0 && (
        <h2>Tienes {mensajesNuevos} mensajes sin leer.</h2>
      )}
    </div>
  );
}

export default Notificaciones;