import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { FaPaw, FaCalendarAlt } from "react-icons/fa";

function Dashboard() {
  const { usuario } = useAuth();

  const [mascotas, setMascotas] = useState([]);
  const [citas, setCitas] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      setError("");

      try {
        const [resMascotas, resCitas] = await Promise.all([
          api.get("/mascotas"),
          api.get("/citas"),
        ]);

        setMascotas(resMascotas.data.data || []);
        setCitas(resCitas.data.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "No se pudo conectar con el servidor. Verifica que el backend y la base de datos estén activos."
        );
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div className="container">
      <div className="dash-header">
        <div>
          <h1>Hola, {usuario?.nombre || "de nuevo"}</h1>
          <p>Este es el resumen de tu cuenta en Huellitas Saludables.</p>
        </div>
        <span className="badge">{usuario?.rol}</span>
      </div>

      {error && <p className="message message-error">{error}</p>}

      <div className="dash-grid">
        <div className="panel">
          <div className="panel__head">
            <h2>Mascotas</h2>
          </div>

          {cargando ? (
            <p className="empty-state">Cargando mascotas...</p>
          ) : mascotas.length === 0 ? (
            <p className="empty-state">Aún no hay mascotas registradas.</p>
          ) : (
            mascotas.map((mascota, i) => (
              <div className="list-item" key={mascota.id_mascota ?? i}>
                <div className="list-item__icon">
                  <FaPaw />
                </div>
                <div>
                  <div className="list-item__title">{mascota.nombre}</div>
                  <div className="list-item__meta">
                    {mascota.especie}
                    {mascota.raza ? ` · ${mascota.raza}` : ""}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="panel">
          <div className="panel__head">
            <h2>Citas</h2>
          </div>

          {cargando ? (
            <p className="empty-state">Cargando citas...</p>
          ) : citas.length === 0 ? (
            <p className="empty-state">No tienes citas agendadas.</p>
          ) : (
            citas.map((cita, i) => (
              <div className="list-item" key={cita.id_cita ?? i}>
                <div className="list-item__icon">
                  <FaCalendarAlt />
                </div>
                <div>
                  <div className="list-item__title">{cita.motivo}</div>
                  <div className="list-item__meta">Estado: {cita.estado}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <p className="state-note">
        Los datos se cargan desde la API del backend (/api/mascotas y /api/citas).
      </p>
    </div>
  );
}

export default Dashboard;
