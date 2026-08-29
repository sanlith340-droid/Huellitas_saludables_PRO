// =========================================================
// SERVICIO DRAFT DE CITA
// =========================================================

const DRAFT_KEY = "citaDraft";


// =========================================================
// OBTENER DRAFT
// =========================================================

export function obtenerCitaDraft() {

    try {

        const draft =
            localStorage.getItem(DRAFT_KEY);

        if (!draft) {
            return null;
        }

        return JSON.parse(draft);

    } catch (error) {

        console.error(
            "Error obteniendo cita draft:",
            error
        );

        return null;
    }
}


// =========================================================
// GUARDAR DRAFT
// =========================================================

export function guardarCitaDraft(draft) {

    try {

        localStorage.setItem(
            DRAFT_KEY,
            JSON.stringify(draft)
        );

        console.log(
            "DRAFT GUARDADO:",
            draft
        );

        return draft;

    } catch (error) {

        console.error(
            "Error guardando cita draft:",
            error
        );

        return null;
    }
}


// =========================================================
// INICIAR CITA
// =========================================================

export function iniciarCita(
    usuario,
    mascota
) {

    const draft = {

        // =================================================
        // DATOS NECESARIOS PARA POST
        // =================================================

        id_recepcionista:
            usuario?.id_usuario || null,

        id_mascota:
            mascota?.id_mascota ||
            mascota?.mascota?.id_mascota ||
            null,

        id_disponibilidad:
            null,

        motivo:
            "",


        // =================================================
        // DATOS PARA MOSTRAR EN LA INTERFAZ
        // =================================================

        recepcionista: {

            id_usuario:
                usuario?.id_usuario || null,

            nombre:
                usuario?.nombre || "",

            apellidos:
                usuario?.apellidos || "",

            correo:
                usuario?.correo || "",

            telefono:
                usuario?.telefono || ""
        },


        mascota: {

            id_mascota:
                mascota?.id_mascota ||
                mascota?.mascota?.id_mascota ||
                null,

            nombre:
                mascota?.nombre_mascota ||
                mascota?.nombre ||
                mascota?.mascota?.nombre ||
                "",

            especie:
                mascota?.especie ||
                mascota?.mascota?.especie ||
                "",

            genero:
                mascota?.genero ||
                mascota?.mascota?.genero ||
                "",

            raza:
                mascota?.raza ||
                mascota?.mascota?.raza ||
                "",

            fecha_nacimiento:
                mascota?.fecha_nacimiento ||
                mascota?.mascota?.fecha_nacimiento ||
                ""
        },


        // =================================================
        // ESPECIALISTA
        // =================================================

        especialista: null,


        // =================================================
        // DISPONIBILIDAD
        // =================================================

        disponibilidad: null
    };


    guardarCitaDraft(draft);

    return draft;
}


// =========================================================
// ACTUALIZAR DRAFT
// =========================================================

export function actualizarCitaDraft(
    cambios
) {

    const draftActual =
        obtenerCitaDraft();


    const nuevoDraft = {

        ...(draftActual || {}),

        ...cambios
    };


    guardarCitaDraft(
        nuevoDraft
    );


    return nuevoDraft;
}


// =========================================================
// SELECCIONAR DISPONIBILIDAD
// =========================================================

export function seleccionarDisponibilidad(
    disponibilidad
) {

    const draftActual =
        obtenerCitaDraft();


    if (!draftActual) {

        console.warn(
            "No existe un draft de cita"
        );

        return null;
    }


    const nuevoDraft = {

        ...draftActual,


        // =================================================
        // DATO QUE SE ENVIARÁ AL POST
        // =================================================

        id_disponibilidad:
            disponibilidad.id_disponibilidad,


        // =================================================
        // DATOS PARA MOSTRAR
        // =================================================

        disponibilidad: {

            id_disponibilidad:
                disponibilidad.id_disponibilidad,

            fecha:
                disponibilidad.fecha,

            hora:
                disponibilidad.hora,

            estado:
                disponibilidad.estado
        },


        especialista: {

            id_usuario:
                disponibilidad.id_especialista,

            nombre:
                disponibilidad.nombre,

            apellidos:
                disponibilidad.apellidos,

            especializacion:
                disponibilidad.especializacion
        }
    };


    guardarCitaDraft(
        nuevoDraft
    );


    console.log(
        "DRAFT CON DISPONIBILIDAD:",
        nuevoDraft
    );


    return nuevoDraft;
}


// =========================================================
// ACTUALIZAR MOTIVO
// =========================================================

export function actualizarMotivo(
    motivo
) {

    return actualizarCitaDraft({

        motivo: motivo
    });
}


// =========================================================
// LIMPIAR DRAFT
// =========================================================

export function eliminarCitaDraft() {

    localStorage.removeItem(
        DRAFT_KEY
    );

    console.log(
        "DRAFT DE CITA ELIMINADO"
    );
}


// =========================================================
// VERIFICAR SI EXISTE DRAFT
// =========================================================

export function existeCitaDraft() {

    return (
        obtenerCitaDraft() !== null
    );
}