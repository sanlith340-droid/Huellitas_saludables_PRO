import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/login.css";

function Login() {
  const { login } = useAuth();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setCargando(true);

    const resultado = await login(correo, contrasena);

    if (!resultado.status) {
      setError(resultado.mensaje);
    }

    setCargando(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🐾</div>

          <h1>Veterinaria</h1>

          <p>Sistema de gestión veterinaria</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="correo">Correo</label>

            <input
              id="correo"
              type="email"
              placeholder="correo@veterinaria.com"
              value={correo}
              onChange={(event) => setCorreo(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>

            <input
              id="contrasena"
              type="password"
              placeholder="Ingrese su contraseña"
              value={contrasena}
              onChange={(event) => setContrasena(event.target.value)}
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="login-button" type="submit" disabled={cargando}>
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
