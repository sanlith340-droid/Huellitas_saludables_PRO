import { useAuth } from "../context/AuthContext";

function Dashboard() {

  const { usuario, logout } = useAuth();

  return (
    <div>

      <h1>Dashboard</h1>

      <h2>
        Bienvenido {usuario?.nombre}
      </h2>

      <p>
        Rol: {usuario?.rol}
      </p>

      <button onClick={logout}>
        Cerrar sesión
      </button>

    </div>
  );
}

export default Dashboard;