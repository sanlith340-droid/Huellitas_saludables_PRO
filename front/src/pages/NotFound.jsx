import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found">
      <h1>🐾 404</h1>
      <h2>Esta página se escapó como un gato</h2>
      <p>No encontramos lo que buscas.</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  );
}

export default NotFound;
