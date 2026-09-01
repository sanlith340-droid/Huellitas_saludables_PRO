import { Link } from "react-router-dom";

function Home() {
  return (
    <div>

      <h1>🐾 Huellitas Saludables</h1>

      <p>
        Plataforma para la gestión de citas veterinarias.
      </p>

      <Link to="/login">
        Iniciar sesión
      </Link>

    </div>
  );
}

export default Home;