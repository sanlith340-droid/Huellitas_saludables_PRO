import { useEffect, useState } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  Button,
  Badge,
  Modal as BootstrapModal,
} from "react-bootstrap";

import { Dog, Cat, Mars, Venus } from "lucide-react";

import {
  obtenerMascotas,
  obtenerDetalleMascota,
} from "../../services/mascotaService";

import {
  obtenerCitaDraft,
  guardarCitaDraft,
} from "../../services/citaDraftService";

import { useAuth } from "../../context/AuthContext";

import Table from "../../components/Table/Table";

import Notificacion from "../../components/Notificacion/Notificacion";

function Mascotas() {
  // =====================================================
  // USUARIO LOGUEADO
  // =====================================================

  const { usuario } = useAuth();

  // =====================================================
  // MASCOTAS
  // =====================================================

  const [mascotas, setMascotas] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // MODAL
  // =====================================================

  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);

  const [modalAbierto, setModalAbierto] = useState(false);

  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  const [errorDetalle, setErrorDetalle] = useState("");

  // =====================================================
  // NOTIFICACIÓN
  // =====================================================

  const [notificacion, setNotificacion] = useState({
    mostrar: false,
    tipo: "info",
    mensaje: "",
  });

  // =====================================================
  // MOSTRAR NOTIFICACIÓN
  // =====================================================

  const mostrarNotificacion = (tipo, mensaje) => {
    setNotificacion({
      mostrar: true,
      tipo,
      mensaje,
    });
  };

  // =====================================================
  // CERRAR NOTIFICACIÓN
  // =====================================================

  const cerrarNotificacion = () => {
    setNotificacion({
      mostrar: false,
      tipo: "info",
      mensaje: "",
    });
  };

  // =====================================================
  // CARGAR MASCOTAS
  // =====================================================

  useEffect(() => {
    cargarMascotas();
  }, []);

  const cargarMascotas = async () => {
    try {
      setCargando(true);

      setError("");

      const resultado = await obtenerMascotas();

      if (resultado.status) {
        const datos = (resultado.data || []).map((mascota) => ({
          ...mascota,

          edad: calcularEdad(mascota.fecha_nacimiento),
        }));

        setMascotas(datos);
      } else {
        setError(resultado.mensaje || "No se pudieron cargar las mascotas");
      }
    } catch (error) {
      console.error("Error al cargar mascotas:", error);

      setError("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  // =====================================================
  // CALCULAR EDAD
  // =====================================================

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) {
      return "";
    }

    const nacimiento = new Date(fechaNacimiento + "T00:00:00");

    const hoy = new Date();

    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  };

  // =====================================================
  // DETALLE MASCOTA
  // =====================================================

  const verDetalleMascota = async (mascota) => {
    setModalAbierto(true);

    setCargandoDetalle(true);

    setErrorDetalle("");

    setMascotaSeleccionada(null);

    try {
      const resultado = await obtenerDetalleMascota(mascota.id_mascota);

      if (resultado.status) {
        setMascotaSeleccionada(resultado.data);
      } else {
        setErrorDetalle(
          resultado.mensaje || "No fue posible obtener el detalle.",
        );
      }
    } catch (error) {
      console.error("Error obteniendo detalle:", error);

      setErrorDetalle("Error de conexión con el servidor.");
    } finally {
      setCargandoDetalle(false);
    }
  };

  // =====================================================
  // SELECCIONAR MASCOTA PARA CITA
  // =====================================================

  const seleccionarMascotaParaCita = (detalle) => {
    // =================================================
    // VALIDAR USUARIO
    // =================================================

    if (!usuario) {
      mostrarNotificacion("danger", "No existe un usuario logueado.");

      return;
    }

    // =================================================
    // VALIDAR RECEPCIONISTA
    // =================================================

    if (usuario.rol !== "recepcionista") {
      mostrarNotificacion(
        "warning",
        "Solo una recepcionista puede crear citas.",
      );

      return;
    }

    // =================================================
    // OBTENER MASCOTA REAL
    // =================================================

    const mascota = detalle?.mascota || detalle;

    if (!mascota?.id_mascota) {
      mostrarNotificacion("danger", "No fue posible identificar la mascota.");

      return;
    }

    // =================================================
    // CREAR DRAFT
    // =================================================

    const draft = {
      // =============================================
      // DATOS PARA POST
      // =============================================

      id_recepcionista: usuario.id_usuario,

      id_mascota: mascota.id_mascota,

      id_disponibilidad: null,

      motivo: "",

      // =============================================
      // DATOS PARA INTERFAZ
      // =============================================

      recepcionista: {
        id_usuario: usuario.id_usuario,

        nombre: usuario.nombre,

        apellidos: usuario.apellidos,

        correo: usuario.correo,

        telefono: usuario.telefono,
      },

      mascota: mascota,

      especialista: null,

      disponibilidad: null,
    };

    // =================================================
    // GUARDAR DRAFT
    // =================================================

    guardarCitaDraft(draft);

    // =================================================
    // VERIFICAR
    // =================================================

    console.log("DRAFT GUARDADO:", obtenerCitaDraft());

    // =================================================
    // NOTIFICACIÓN
    // =================================================

    mostrarNotificacion(
      "success",
      `Mascota ${mascota.nombre} seleccionada correctamente. Ahora seleccione el especialista y el horario.`,
    );
  };

  // =====================================================
  // CERRAR MODAL
  // =====================================================

  const cerrarModal = () => {
    setModalAbierto(false);

    setMascotaSeleccionada(null);

    setErrorDetalle("");
  };

  // =====================================================
  // COLUMNAS
  // =====================================================

  const columnas = [
    "id_mascota",

    "nombre_mascota",

    "especie",

    "genero",

    "raza",

    "fecha_nacimiento",

    "edad",
  ];

  // =====================================================
  // ICONOS DE TABLA
  // =====================================================

  const renderCelda = (columna, valor) => {
    // =================================================
    // ESPECIE
    // =================================================

    if (columna === "especie") {
      if (valor?.toLowerCase() === "perro") {
        return (
          <span
            title="Perro"
            className="
              d-inline-flex
              align-items-center
              gap-1
            "
          >
            <Dog size={22} />

            <span>Perro</span>
          </span>
        );
      }

      if (valor?.toLowerCase() === "gato") {
        return (
          <span
            title="Gato"
            className="
              d-inline-flex
              align-items-center
              gap-1
            "
          >
            <Cat size={22} />

            <span>Gato</span>
          </span>
        );
      }

      return valor;
    }

    // =================================================
    // GÉNERO
    // =================================================

    if (columna === "genero") {
      if (valor?.toLowerCase() === "macho") {
        return (
          <span
            title="Macho"
            className="
              d-inline-flex
              align-items-center
              gap-1
            "
          >
            <Mars size={22} />

            <span>Macho</span>
          </span>
        );
      }

      if (valor?.toLowerCase() === "hembra") {
        return (
          <span
            title="Hembra"
            className="
              d-inline-flex
              align-items-center
              gap-1
            "
          >
            <Venus size={22} />

            <span>Hembra</span>
          </span>
        );
      }

      return valor;
    }

    // =================================================
    // EDAD
    // =================================================

    if (columna === "edad") {
      if (valor === "" || valor === null || valor === undefined) {
        return "No registrada";
      }

      return `${valor} ${valor === 1 ? "año" : "años"}`;
    }

    return valor;
  };

  // =====================================================
  // CARGANDO
  // =====================================================

  if (cargando) {
    return (
      <Container fluid className="py-4">
        <div
          className="
            d-flex
            justify-content-center
            align-items-center
            py-5
          "
        >
          <div className="text-center">
            <Spinner animation="border" variant="primary" />

            <p
              className="
                mt-3
                text-muted
              "
            >
              Cargando mascotas...
            </p>
          </div>
        </div>
      </Container>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger" className="shadow-sm">
          <Alert.Heading>Error</Alert.Heading>

          <p className="mb-0">{error}</p>
        </Alert>
      </Container>
    );
  }

  // =====================================================
  // VISTA
  // =====================================================

  return (
    <Container fluid className="py-4">
      {/* =================================================
          NOTIFICACIÓN
      ================================================= */}

      <Notificacion
        mostrar={notificacion.mostrar}
        tipo={notificacion.tipo}
        mensaje={notificacion.mensaje}
        cerrar={cerrarNotificacion}
      />

      {/* =================================================
          ENCABEZADO
      ================================================= */}

      <Row className="mb-4">
        <Col>
          <h1
            className="
              h3
              fw-bold
              mb-1
            "
          >
            🐾 Mascotas
          </h1>

          <p
            className="
              text-muted
              mb-0
            "
          >
            Gestión de mascotas del sistema
          </p>
        </Col>

        <Col
          xs="auto"
          className="
            d-flex
            align-items-center
          "
        >
          <Badge
            bg="primary"
            className="
              px-3
              py-2
            "
          >
            {mascotas.length} mascotas
          </Badge>
        </Col>
      </Row>

      {/* =================================================
          TABLA
      ================================================= */}

      <Row>
        <Col>
          <Table
            columnas={columnas}
            datos={mascotas}
            campoId="id_mascota"
            mostrarBuscador={true}
            camposBusqueda={["id_mascota", "nombre_mascota"]}
            placeholderBusqueda={"Buscar mascota por nombre o ID..."}
            mostrarAccion={true}
            textoAccion={"🔎 Detalle"}
            onAccion={verDetalleMascota}
            renderCelda={renderCelda}
          />
        </Col>
      </Row>

      {/* =================================================
          MODAL
      ================================================= */}

      <BootstrapModal
        show={modalAbierto}
        onHide={cerrarModal}
        size="xl"
        centered
        scrollable
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title>
            🐾 Detalle de mascota
            <div>
              <small
                className="
                  text-muted
                  fw-normal
                "
              >
                Información completa
              </small>
            </div>
          </BootstrapModal.Title>
        </BootstrapModal.Header>

        {/* =================================================
            BODY
        ================================================= */}

        <BootstrapModal.Body>
          {/* =============================================
              CARGANDO
          ============================================= */}

          {cargandoDetalle && (
            <div
              className="
                d-flex
                justify-content-center
                py-5
              "
            >
              <div className="text-center">
                <Spinner animation="border" variant="primary" />

                <p
                  className="
                    mt-3
                    text-muted
                  "
                >
                  Cargando información...
                </p>
              </div>
            </div>
          )}

          {/* =============================================
              ERROR
          ============================================= */}

          {!cargandoDetalle && errorDetalle && (
            <Alert variant="danger">{errorDetalle}</Alert>
          )}

          {/* =============================================
              INFORMACIÓN
          ============================================= */}

          {!cargandoDetalle && !errorDetalle && mascotaSeleccionada && (
            <>
              {/* =================================
                    DATOS MASCOTA
                ================================= */}

              <Card
                className="
                    mb-4
                    shadow-sm
                  "
              >
                <Card.Header
                  className="
                      fw-bold
                      bg-light
                    "
                >
                  🐾 Datos de la mascota
                </Card.Header>

                <Card.Body>
                  <Row className="g-3">
                    <Col xs={12} md={6} lg={4}>
                      <div
                        className="
                            text-muted
                            small
                          "
                      >
                        ID
                      </div>

                      <strong>{mascotaSeleccionada.mascota.id_mascota}</strong>
                    </Col>

                    <Col xs={12} md={6} lg={4}>
                      <div
                        className="
                            text-muted
                            small
                          "
                      >
                        Nombre
                      </div>

                      <strong>{mascotaSeleccionada.mascota.nombre}</strong>
                    </Col>

                    <Col xs={12} md={6} lg={4}>
                      <div
                        className="
                            text-muted
                            small
                          "
                      >
                        Especie
                      </div>

                      <strong>
                        {mascotaSeleccionada.mascota.especie === "perro"
                          ? "🐶 Perro"
                          : "🐱 Gato"}
                      </strong>
                    </Col>

                    <Col xs={12} md={6} lg={4}>
                      <div
                        className="
                            text-muted
                            small
                          "
                      >
                        Género
                      </div>

                      <strong>{mascotaSeleccionada.mascota.genero}</strong>
                    </Col>

                    <Col xs={12} md={6} lg={4}>
                      <div
                        className="
                            text-muted
                            small
                          "
                      >
                        Raza
                      </div>

                      <strong>
                        {mascotaSeleccionada.mascota.raza || "No registrada"}
                      </strong>
                    </Col>

                    <Col xs={12} md={6} lg={4}>
                      <div
                        className="
                            text-muted
                            small
                          "
                      >
                        Fecha nacimiento
                      </div>

                      <strong>
                        {mascotaSeleccionada.mascota.fecha_nacimiento ||
                          "No registrada"}
                      </strong>
                    </Col>

                    <Col xs={12} md={6} lg={4}>
                      <div
                        className="
                            text-muted
                            small
                          "
                      >
                        Fecha registro
                      </div>

                      <strong>
                        {mascotaSeleccionada.mascota.fecha_registro ||
                          "No registrada"}
                      </strong>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* =================================
                    PROPIETARIO
                ================================= */}

              <Card
                className="
                    mb-4
                    shadow-sm
                  "
              >
                <Card.Header
                  className="
                      fw-bold
                      bg-light
                    "
                >
                  👤 Propietario
                </Card.Header>

                <Card.Body>
                  {mascotaSeleccionada.propietario ? (
                    <Row className="g-3">
                      <Col xs={12} md={6}>
                        <strong>
                          {mascotaSeleccionada.propietario.nombre}{" "}
                          {mascotaSeleccionada.propietario.apellidos}
                        </strong>

                        <Badge bg="primary" className="ms-2">
                          Propietario
                        </Badge>
                      </Col>

                      <Col xs={12} md={6}>
                        <span className="text-muted">ID:</span>{" "}
                        {mascotaSeleccionada.propietario.id_usuario}
                      </Col>

                      <Col xs={12} md={6}>
                        <span className="text-muted">Correo:</span>{" "}
                        {mascotaSeleccionada.propietario.correo}
                      </Col>

                      <Col xs={12} md={6}>
                        <span className="text-muted">Teléfono:</span>{" "}
                        {mascotaSeleccionada.propietario.telefono}
                      </Col>

                      <Col xs={12}>
                        <span className="text-muted">Dirección:</span>{" "}
                        {mascotaSeleccionada.propietario.direccion}
                      </Col>
                    </Row>
                  ) : (
                    <Alert variant="warning" className="mb-0">
                      No tiene propietario registrado.
                    </Alert>
                  )}
                </Card.Body>
              </Card>

              {/* =================================
                    ACUDIENTES
                ================================= */}

              <Card
                className="
                    mb-4
                    shadow-sm
                  "
              >
                <Card.Header
                  className="
                      fw-bold
                      bg-light
                    "
                >
                  👥 Acudientes
                </Card.Header>

                <Card.Body>
                  {mascotaSeleccionada.acudientes &&
                  mascotaSeleccionada.acudientes.length > 0 ? (
                    <Row className="g-3">
                      {mascotaSeleccionada.acudientes.map((acudiente) => (
                        <Col xs={12} md={6} key={acudiente.id_usuario}>
                          <Card
                            className="
                                        h-100
                                        border
                                      "
                          >
                            <Card.Body>
                              <div
                                className="
                                            fw-bold
                                            mb-2
                                          "
                              >
                                {acudiente.nombre} {acudiente.apellidos}
                                <Badge bg="secondary" className="ms-2">
                                  Acudiente
                                </Badge>
                              </div>

                              <div
                                className="
                                            small
                                            text-muted
                                          "
                              >
                                <div>ID: {acudiente.id_usuario}</div>

                                <div>Correo: {acudiente.correo}</div>

                                <div>Teléfono: {acudiente.telefono}</div>

                                <div>Dirección: {acudiente.direccion}</div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Alert variant="info" className="mb-0">
                      No tiene acudientes registrados.
                    </Alert>
                  )}
                </Card.Body>
              </Card>

              {/* =================================
                    CREAR CITA
                ================================= */}

              <div
                className="
                    d-flex
                    justify-content-end
                  "
              >
                <Button
                  variant="success"
                  size="lg"
                  onClick={() =>
                    seleccionarMascotaParaCita(mascotaSeleccionada)
                  }
                >
                  📅 Seleccionar para cita
                </Button>
              </div>
            </>
          )}
        </BootstrapModal.Body>

        {/* =================================================
            FOOTER
        ================================================= */}

        <BootstrapModal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cerrar
          </Button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </Container>
  );
}

export default Mascotas;
