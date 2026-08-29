import { useEffect, useState } from "react";

import {
    obtenerDisponibilidadEspecialista
} from "../../services/citaService";

import {
    obtenerCitaDraft,
    guardarCitaDraft
} from "../../services/citaDraftService";

import "./CalendarioDisponibilidad.css";


function CalendarioDisponibilidad({
    idEspecialista,
    onSeleccionarHorario
}) {

    const [disponibilidades, setDisponibilidades] =
        useState([]);

    const [cargando, setCargando] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // CARGAR DISPONIBILIDAD
    // =====================================================

    useEffect(() => {
      
        if (!idEspecialista) {
            return;
        }

        cargarDisponibilidad();

    }, [idEspecialista]);


    const cargarDisponibilidad = async () => {

        setCargando(true);
        setError("");

        try {

            const resultado =
                await obtenerDisponibilidadEspecialista(
                    idEspecialista
                );


            if (resultado.status) {

                setDisponibilidades(
                    resultado.data || []
                );

            } else {

                setError(
                    resultado.mensaje
                );

            }

        } catch (error) {

            console.error(
                "Error cargando disponibilidad:",
                error
            );

            setError(
                "No fue posible cargar la disponibilidad"
            );

        } finally {

            setCargando(false);

        }

    };


    // =====================================================
    // AGRUPAR FECHAS
    // =====================================================

    const fechas = [
        ...new Set(
            disponibilidades.map(
                item => item.fecha
            )
        )
    ];


    // =====================================================
    // SELECCIONAR HORARIO
    // =====================================================

    const seleccionarHorario = (
        disponibilidad
    ) => {

        // -------------------------------------------------
        // SOLO DISPONIBLES
        // -------------------------------------------------

        if (
            disponibilidad.estado !== "disponible"
        ) {

            return;

        }


        console.log(
            "======================================"
        );

        console.log(
            "HORARIO SELECCIONADO"
        );

        console.log(
            disponibilidad
        );


        // -------------------------------------------------
        // OBTENER DRAFT ACTUAL
        // -------------------------------------------------

        const draftActual =
            obtenerCitaDraft();


        console.log(
            "DRAFT ANTES:",
            draftActual
        );


        // -------------------------------------------------
        // CREAR NUEVO DRAFT
        // -------------------------------------------------

        const nuevoDraft = {

            ...(draftActual || {}),


            // =============================================
            // DATOS IMPORTANTES PARA CREAR CITA
            // =============================================

            id_especialista:
                disponibilidad.id_especialista,

            id_disponibilidad:
                disponibilidad.id_disponibilidad,


            // =============================================
            // DETALLE DISPONIBILIDAD
            // =============================================

            disponibilidad: {

                id_disponibilidad:
                    disponibilidad.id_disponibilidad,

                id_especialista:
                    disponibilidad.id_especialista,

                nombre:
                    disponibilidad.nombre,

                apellidos:
                    disponibilidad.apellidos,

                especializacion:
                    disponibilidad.especializacion,

                fecha:
                    disponibilidad.fecha,

                hora:
                    disponibilidad.hora,

                estado:
                    disponibilidad.estado

            },


            // =============================================
            // DETALLE ESPECIALISTA
            // =============================================

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


        console.log(
            "NUEVO DRAFT:",
            nuevoDraft
        );


        // -------------------------------------------------
        // GUARDAR LOCALSTORAGE
        // -------------------------------------------------

        guardarCitaDraft(
            nuevoDraft
        );


        // -------------------------------------------------
        // COMPROBAR INMEDIATAMENTE
        // -------------------------------------------------

        const verificar =
            obtenerCitaDraft();


        console.log(
            "DRAFT DESPUÉS DE GUARDAR:",
            verificar
        );


        console.log(
            "ID DISPONIBILIDAD GUARDADO:",
            verificar?.id_disponibilidad
        );


        console.log(
            "======================================"
        );


        // -------------------------------------------------
        // ACTUALIZAR COMPONENTE PADRE
        // -------------------------------------------------

        if (onSeleccionarHorario) {

            onSeleccionarHorario(
                verificar
            );

        }

    };


    // =====================================================
    // CARGANDO
    // =====================================================

    if (cargando) {

        return (
            <div className="calendar-loading">

                Cargando agenda...

            </div>
        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <div className="calendar-error">

                {error}

            </div>
        );

    }


    // =====================================================
    // CALENDARIO
    // =====================================================

    return (

        <div className="calendar-container">


            {/* =================================================
                ENCABEZADO
            ================================================= */}

            <div className="calendar-header">

                <div>

                    <h2>
                        📅 Agenda del especialista
                    </h2>


                    {disponibilidades.length > 0 && (

                        <p>

                            🩺{" "}

                            {
                                disponibilidades[0]
                                    .nombre
                            }{" "}

                            {
                                disponibilidades[0]
                                    .apellidos
                            }

                        </p>

                    )}

                </div>


                <div className="calendar-legend">

                    <span>

                        <i className="legend-disponible"></i>

                        Disponible

                    </span>


                    <span>

                        <i className="legend-ocupado"></i>

                        Ocupado

                    </span>

                </div>

            </div>


            {/* =================================================
                FECHAS
            ================================================= */}

            <div className="calendar-days">

                {fechas.map(
                    fecha => {

                        const horarios =
                            disponibilidades.filter(
                                item =>
                                    item.fecha ===
                                    fecha
                            );


                        return (

                            <div
                                className="calendar-day"
                                key={fecha}
                            >


                                {/* =============================
                                    FECHA
                                ============================== */}

                                <div className="calendar-day-header">

                                    <strong>

                                        {formatearFecha(
                                            fecha
                                        )}

                                    </strong>


                                    <span>

                                        {fecha}

                                    </span>

                                </div>


                                {/* =============================
                                    HORARIOS
                                ============================== */}

                                <div className="calendar-hours">

                                    {horarios.map(
                                        disponibilidad => (

                                            <button

                                                key={
                                                    disponibilidad
                                                        .id_disponibilidad
                                                }


                                                type="button"


                                                className={

                                                    disponibilidad
                                                        .estado ===
                                                    "disponible"

                                                        ? "hora disponible"

                                                        : "hora ocupado"

                                                }


                                                disabled={

                                                    disponibilidad
                                                        .estado !==
                                                    "disponible"

                                                }


                                                onClick={() =>
                                                    seleccionarHorario(
                                                        disponibilidad
                                                    )
                                                }

                                            >

                                                <span
                                                    className="hora-texto"
                                                >

                                                    {
                                                        disponibilidad
                                                            .hora
                                                            .slice(
                                                                0,
                                                                5
                                                            )
                                                    }

                                                </span>


                                                <span
                                                    className="estado-texto"
                                                >

                                                    {
                                                        disponibilidad
                                                            .estado ===
                                                        "disponible"

                                                            ? "Disponible"

                                                            : "Ocupado"
                                                    }

                                                </span>

                                            </button>

                                        )
                                    )}

                                </div>

                            </div>

                        );

                    }
                )}

            </div>

        </div>

    );

}


// =========================================================
// FORMATEAR FECHA
// =========================================================

function formatearFecha(
    fecha
) {

    const partes =
        fecha.split("-");


    const fechaLocal =
        new Date(
            partes[0],
            partes[1] - 1,
            partes[2]
        );


    return fechaLocal.toLocaleDateString(
        "es-CO",
        {
            weekday: "long",
            day: "numeric",
            month: "long"
        }
    );

}


export default CalendarioDisponibilidad;