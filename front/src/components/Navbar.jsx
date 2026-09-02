import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { usuario, autenticado, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="brand">
          <span className="brand__mark">🐾</span>
          Huellitas Saludables
        </Link>

        <nav className="navbar__links">
          {autenticado ? (
            <>
              <Link to="/dashboard">Mi panel</Link>
              <div className="navbar__user">
                <span>
                  {usuario?.nombre} · <span className="badge">{usuario?.rol}</span>
                </span>
                <button type="button" className="btn btn-ghost" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/registro" className="btn btn-primary">
                Crear cuenta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
