const API_URL = import.meta.env.VITE_API_URL;

// =====================================================
// OBTENER USUARIOS
// =====================================================

export async function obtenerUsuarios() {

    try {

        const response = await fetch(
            `${API_URL}/api/v1/usuarios/todos`,
        );
        
        return await response.json();

    } catch (error) {

        return {
            status: false,
            mensaje: "No fue posible consultar los usuarios",
            data: [],
            error: "SERVER_ERROR",
            code: 500
        };
    }
}

// =====================================================
// OBTENER LISTADO DE ESPECIALISTAS
// =====================================================

export async function obtenerUsuariosEspecialistas() {

    try {

        const response = await fetch(
            `${API_URL}/api/v1/usuarios/especialistas`,
        );
        
        return await response.json();

    } catch (error) {

        return {
            status: false,
            mensaje: "No fue posible consultar los usuarios especialistas",
            data: [],
            error: "SERVER_ERROR",
            code: 500
        };
    }
}