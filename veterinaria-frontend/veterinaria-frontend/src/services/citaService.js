const API_URL = import.meta.env.VITE_API_URL;

// =====================================================
// OBTENER DISPONIBILIDAD DE UN ESPECIALISTA
// =====================================================

export async function obtenerDisponibilidadEspecialista(idEspecialista) {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/disponibilidad/especialista/${idEspecialista}`,
    );

    const resultado = await response.json();

    return resultado;
  } catch (error) {
    console.error("Error obteniendo disponibilidad:", error);

    return {
      status: false,

      mensaje: "No fue posible consultar la disponibilidad",

      data: [],

      error: "SERVER_ERROR",

      code: 500,
    };
  }
}

// =====================================================
// CREAR CITA
// =====================================================

export const crearCita = async (datosCita) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/citas`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(datosCita),
    });

    const resultado = await response.json();

    return resultado;
  } catch (error) {
    console.error("Error creando cita:", error);

    return {
      status: false,

      mensaje: "No fue posible conectar con el servidor.",

      data: null,

      error: "CONNECTION_ERROR",

      code: 500,
    };
  }
};

// =====================================================
// LISTAR CITAS POR MASCOTA
// =====================================================

export const obtenerCitasPorMascota = async (idMascota) => {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/citas/mascota/${idMascota}`,
    );

    const resultado = await response.json();

    return resultado;
  } catch (error) {
    console.error("Error obteniendo citas de la mascota:", error);

    return {
      status: false,

      mensaje: "No fue posible conectar con el servidor.",

      data: null,

      error: "CONNECTION_ERROR",

      code: 500,
    };
  }
};
