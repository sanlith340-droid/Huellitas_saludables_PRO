const API_URL = import.meta.env.VITE_API_URL;

/**
 * Login de usuario
 *
 * POST /api/v1/usuarios/login
 *
 * Body:
 * {
 *   correo: "...",
 *   contrasena: "..."
 * }
 */
export async function login(correo, contrasena) {

    try {

        const response = await fetch(
            `${API_URL}/api/v1/usuarios/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    correo: correo,
                    contrasena: contrasena
                })
            }
        );

        const resultado = await response.json();

        return resultado;

    } catch (error) {

        console.error("Error en login:", error);

        return {
            status: false,

            mensaje: "No fue posible conectar con el servidor",

            data: {
                logueado: false
            },

            error: "SERVER_ERROR",

            code: 500
        };
    }
}