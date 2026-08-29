import "./Modal.css";

function Modal({
  abierto,
  cerrar,
  titulo,
  subtitulo,
  children,
  textoCerrar = "Cerrar",
}) {
  if (!abierto) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={cerrar}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="modal-header">
          <div>
            <h2>{titulo}</h2>

            {subtitulo && (
              <p>{subtitulo}</p>
            )}
          </div>

          <button
            className="modal-close"
            onClick={cerrar}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="modal-body">
          {children}
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button
            className="btn-cerrar"
            onClick={cerrar}
          >
            {textoCerrar}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;