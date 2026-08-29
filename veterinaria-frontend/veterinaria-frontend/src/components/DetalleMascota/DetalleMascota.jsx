import "./DetalleMascota.css";

function DetalleMascota({ mascota }) {
  if (!mascota) {
    return null;
  }

  const esPerro = mascota.especie?.toLowerCase() === "perro";
  console.log ("MASCOTA" , mascota)
  return (
    <div className="detalle-mascota">
      {/* =================================================
          CABECERA MASCOTA
      ================================================= */}

      <div className="detalle-mascota-header">
        <div className="detalle-mascota-icon">{esPerro ? "🐶" : "🐱"}</div>

        <div>
          <h3>{mascota.nombre}</h3>

          <span className="detalle-mascota-id">ID: {mascota.id_mascota}</span>
        </div>
      </div>

      {/* =================================================
          INFORMACIÓN
      ================================================= */}

      <div className="detalle-seccion">
        <h4>🐾 Información de la mascota</h4>

        <div className="detalle-grid">
          <div className="detalle-item">
            <span className="detalle-label">Nombre</span>

            <strong>{mascota.nombre || "No registrado"}</strong>
          </div>

          <div className="detalle-item">
            <span className="detalle-label">Especie</span>

            <strong>{mascota.especie || "No registrada"}</strong>
          </div>

          <div className="detalle-item">
            <span className="detalle-label">Género</span>

            <strong>{mascota.genero || "No registrado"}</strong>
          </div>

          <div className="detalle-item">
            <span className="detalle-label">Raza</span>

            <strong>{mascota.raza || "No registrada"}</strong>
          </div>

          <div className="detalle-item">
            <span className="detalle-label">Fecha de nacimiento</span>

            <strong>{mascota.fecha_nacimiento || "No registrada"}</strong>
          </div>

          <div className="detalle-item">
            <span className="detalle-label">Fecha de registro</span>

            <strong>{mascota.fecha_registro || "No registrada"}</strong>
          </div>
        </div>
      </div>

      {/* =================================================
          PROPIETARIO
      ================================================= */}

      <div className="detalle-seccion">
        <h4>👤 Propietario</h4>

        <div className="propietario-card">
          <div className="propietario-avatar">👤</div>

          <div className="propietario-info">
            <strong>{mascota.propietario_nombre || "No registrado"}</strong>

            {mascota.propietario_id && (
              <span>ID: {mascota.propietario_id}</span>
            )}

            {mascota.propietario_correo && (
              <span>✉️ {mascota.propietario_correo}</span>
            )}

            {mascota.propietario_telefono && (
              <span>📞 {mascota.propietario_telefono}</span>
            )}
          </div>
        </div>
      </div>

      {/* =================================================
          ACUDIENTES
      ================================================= */}

      <div className="detalle-seccion">
        <h4>👥 Acudientes</h4>

        {mascota.acudientes && mascota.acudientes.length > 0 ? (
          <div className="acudientes-list">
            {mascota.acudientes.map((acudiente) => (
              <div className="acudiente-card" key={acudiente.id_usuario}>
                <div className="acudiente-avatar">👤</div>

                <div>
                  <strong>
                    {acudiente.nombre} {acudiente.apellidos}
                  </strong>

                  <span>ID: {acudiente.id_usuario}</span>

                  {acudiente.correo && <span>✉️ {acudiente.correo}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="sin-acudientes">No hay acudientes registrados.</div>
        )}
      </div>
    </div>
  );
}

export default DetalleMascota;
