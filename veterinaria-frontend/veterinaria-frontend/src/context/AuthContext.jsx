import {
    createContext,
    useContext,
    useState
} from "react";

import {
    login as loginService
} from "../services/authService";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {

    // =====================================================
    // RECUPERAR USUARIO GUARDADO
    // =====================================================

    const [usuario, setUsuario] = useState(() => {

        const usuarioGuardado =
            localStorage.getItem("veterinaria_usuario");

        if (!usuarioGuardado) {
            return null;
        }

        try {

            return JSON.parse(
                usuarioGuardado
            );

        } catch (error) {

            console.error(
                "Error al recuperar usuario:",
                error
            );

            localStorage.removeItem(
                "veterinaria_usuario"
            );

            return null;
        }
    });


    // =====================================================
    // LOGIN
    // =====================================================

    const login = async (
        correo,
        password
    ) => {

        const resultado =
            await loginService(
                correo,
                password
            );


        if (
            resultado.status &&
            resultado.data?.logueado
        ) {

            const usuarioLogin =
                resultado.data;


            // Guardar en React
            setUsuario(
                usuarioLogin
            );


            // Guardar en navegador
            localStorage.setItem(
                "veterinaria_usuario",
                JSON.stringify(
                    usuarioLogin
                )
            );
        }


        return resultado;
    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {

        setUsuario(null);

        localStorage.removeItem(
            "veterinaria_usuario"
        );
    };


    // =====================================================
    // CONTEXTO
    // =====================================================

    const value = {

        usuario,

        autenticado:
            usuario !== null,

        login,

        logout
    };


    return (

        <AuthContext.Provider
            value={value}
        >

            {children}

        </AuthContext.Provider>
    );
}


export function useAuth() {

    return useContext(
        AuthContext
    );
}