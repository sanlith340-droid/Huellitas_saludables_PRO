const API_URL = import.meta.env.VITE_API_URL;


// =====================================================
// OBTENER TODAS LAS MACOTTAS
// =====================================================

export async function obtenerMascotas() {
    try {

        const response = await fetch(
            `${API_URL}/api/v1/mascotas`
        );

        const resultado = await response.json();

        return resultado;

    } catch (error) {

        console.error("Error obteniendo mascotas:", error);

        return {
            status: false,
            mensaje: "No fue posible consultar las mascotas",
            data: [],
            error: "SERVER_ERROR",
            code: 500
        };
    }
}



// =====================================================
// OBTENER MASCOTAS POR USUARIO
// =====================================================

export async function obtenerMascotasUsuario(
    idUsuario
) {

    try {

        const response = await fetch(
            `${API_URL}/api/v1/mascotas/usuario/${idUsuario}`
        );

        const resultado =
            await response.json();

        return resultado;

    } catch (error) {

        console.error(
            "Error obteniendo mascotas del usuario:",
            error
        );

        return {
            status: false,
            mensaje:
                "No fue posible consultar las mascotas del usuario",
            data: [],
            error: "SERVER_ERROR",
            code: 500
        };
    }
}

// =====================================================
// OBTENER DETALLE DE MASCOTA
// =====================================================

export async function obtenerDetalleMascota(
    idMascota
) {

    try {

        const response = await fetch(
            `${API_URL}/api/v1/mascotas/${idMascota}`
        );

        const resultado =
            await response.json();

        return resultado;

    } catch (error) {

        console.error(
            "Error obteniendo detalle de mascota:",
            error
        );

        return {

            status: false,

            mensaje:
                "No fue posible consultar el detalle de la mascota",

            data: null,

            error:
                "SERVER_ERROR",

            code: 500
        };
    }
}