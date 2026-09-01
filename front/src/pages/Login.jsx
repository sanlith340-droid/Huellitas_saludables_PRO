import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    correo: "",
    contrasena: ""
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const respuesta = await api.post(
        "/auth/login",
        form
      );

      const datos = respuesta.data.data;

      login(datos.usuario);

      localStorage.setItem(
        "token",
        datos.token
      );

      navigate("/dashboard");

    } catch (error) {

      setMensaje(
        error.response?.data?.message ||
        "Error al iniciar sesión"
      );

    }

  };

  return (
    <div>

      <h1>Iniciar sesión</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          value={form.correo}
          onChange={handleChange}
        />

        <input
          type="password"
          name="contrasena"
          placeholder="Contraseña"
          value={form.contrasena}
          onChange={handleChange}
        />

        <button>
          Iniciar sesión
        </button>

      </form>

      {mensaje && <p>{mensaje}</p>}

    </div>
  );
}

export default Login;