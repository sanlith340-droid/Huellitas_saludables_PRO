import { useEffect, useState } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Modal,
  Button,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";

import Table from "../../components/Table/Table";

import CalendarioDisponibilidad from "../../components/Calendar/CalendarioDisponibilidad";

import { obtenerUsuariosEspecialistas } from "../../services/usuarioService";

function Especialista() {
  // =====================================================
  // ESPECIALISTAS
  // =====================================================

  const [especialistas, setEspecialistas] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // MODAL
  // =====================================================

  const [modalAbierto, setModalAbierto] = useState(false);

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  // =====================================================
  // DRAFT DE CITA
  // =====================================================

  const [citaDraft, setCitaDraft] = useState(null);

  // =====================================================
  // CARGAR DATOS
  // =====================================================

  useEffect(() => {
    cargarUsuariosEspecialistas();

    cargarDraft();
  }, []);

  // =====================================================
  // CARGAR ESPECIALISTAS
  // =====================================================

  const cargarUsuariosEspecialistas = async () => {
    setCargando(true);

    setError("");

    try {
      const resultado = await obtenerUsuariosEspecialistas();

      if (resultado.status) {
        setEspecialistas(resultado.data || []);
      } else {
        setError(
          resultado.mensaje || "No fue posible cargar los especialistas.",
        );
      }
    } catch (error) {
      console.error("Error cargando especialistas:", error);

      setError("No fue posible conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  // =====================================================
  // CARGAR DRAFT
  // =====================================================

  const cargarDraft = () => {
    try {
      const draft = localStorage.getItem("citaDraft");

      if (draft) {
        const objeto = JSON.parse(draft);

        setCitaDraft(objeto);

        console.log("DRAFT CARGADO:", objeto);
      }
    } catch (error) {
      console.error("Error leyendo citaDraft:", error);
    }
  };

  // =====================================================
  // ABRIR DISPONIBILIDAD
  // =====================================================

  const verDisponibilidad = (usuario) => {
    console.log("ESPECIALISTA SELECCIONADO:", usuario);

    setUsuarioSeleccionado(usuario);

    cargarDraft();

    setModalAbierto(true);
  };

  // =====================================================
  // CERRAR MODAL
  // =====================================================

  const cerrarModal = () => {
    setModalAbierto(false);

    setUsuarioSeleccionado(null);
  };

  // =====================================================
  // SELECCIONAR HORARIO
  // =====================================================

  const seleccionarHorario = (draft) => {
    console.log("======================================");

    console.log("DRAFT RECIBIDO DEL CALENDARIO");

    console.log(draft);

    console.log("ID MASCOTA:", draft?.id_mascota);

    console.log("ID RECEPCIONISTA:", draft?.id_recepcionista);

    console.log("ID ESPECIALISTA:", draft?.id_especialista);

    console.log("ID DISPONIBILIDAD:", draft?.id_disponibilidad);

    console.log("FECHA:", draft?.disponibilidad?.fecha);

    console.log("HORA:", draft?.disponibilidad?.hora);

    console.log("======================================");

    // =================================================
    // ACTUALIZAR DRAFT
    // =================================================

    setCitaDraft(draft);
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
              Cargando especialistas...
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
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>

          <p className="mb-0">{error}</p>
        </Alert>
      </Container>
    );
  }

  // =====================================================
  // COLUMNAS
  // =====================================================

  const columnas = [
    "id_usuario",

    "nombre",

    "apellidos",

    "telefono",

    "correo",

    "especializacion",
  ];

  // =====================================================
  // VISTA
  // =====================================================

  return (
    <Container fluid className="py-4">
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
            🩺 Especialistas
          </h1>

          <p
            className="
                            text-muted
                            mb-0
                        "
          >
            Gestión de especialistas y disponibilidad
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
            {especialistas.length} especialistas
          </Badge>
        </Col>
      </Row>

      {/* =================================================
                RESUMEN DEL DRAFT
            ================================================= */}

      {citaDraft && (
        <Card
          className="
                        mb-4
                        shadow-sm
                        border-0
                    "
        >
          <Card.Header
            className="
                            bg-primary
                            text-white
                            fw-bold
                        "
          >
            📅 Información de la cita
          </Card.Header>

          <Card.Body>
            <Row className="g-3">
              {/* =================================
                                MASCOTA
                            ================================= */}

              <Col xs={12} md={6} lg={2}>
                <div
                  className="
                                        text-muted
                                        small
                                    "
                >
                  🐾 Mascota
                </div>

                <strong>
                  {citaDraft.nombre_mascota ||
                    citaDraft.mascota?.nombre ||
                    (citaDraft.id_mascota
                      ? `ID ${citaDraft.id_mascota}`
                      : "No seleccionada")}
                </strong>
              </Col>

              {/* =================================
                                ESPECIALISTA
                            ================================= */}

              <Col xs={12} md={6} lg={2}>
                <div
                  className="
                                        text-muted
                                        small
                                    "
                >
                  🩺 Especialista
                </div>

                <strong>
                  {citaDraft.especialista?.nombre}{" "}
                  {citaDraft.especialista?.apellidos}
                  {!citaDraft.especialista?.nombre && "No seleccionado"}
                </strong>
              </Col>

              {/* =================================
                                FECHA
                            ================================= */}

              <Col xs={12} md={6} lg={2}>
                <div
                  className="
                                        text-muted
                                        small
                                    "
                >
                  📅 Fecha
                </div>

                <strong>
                  {citaDraft.disponibilidad?.fecha || "No seleccionada"}
                </strong>
              </Col>

              {/* =================================
                                HORA
                            ================================= */}

              <Col xs={12} md={6} lg={2}>
                <div
                  className="
                                        text-muted
                                        small
                                    "
                >
                  🕐 Hora
                </div>

                <strong>
                  {citaDraft.disponibilidad?.hora?.slice(0, 5) ||
                    "No seleccionada"}
                </strong>
              </Col>

              {/* =================================
                                DISPONIBILIDAD
                            ================================= */}

              <Col xs={12} md={6} lg={2}>
                <div
                  className="
                                        text-muted
                                        small
                                    "
                >
                  Disponibilidad
                </div>

                <strong>
                  {citaDraft.id_disponibilidad || "No seleccionada"}
                </strong>
              </Col>

              {/* =================================
                                ESTADO
                            ================================= */}

              <Col
                xs={12}
                md={6}
                lg={2}
                className="
                                    d-flex
                                    align-items-center
                                "
              >
                <Badge
                  bg={citaDraft.id_disponibilidad ? "success" : "warning"}
                  className="px-3 py-2"
                >
                  {citaDraft.id_disponibilidad
                    ? "Horario seleccionado"
                    : "Pendiente"}
                </Badge>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* =================================================
                TABLA
            ================================================= */}

      <Card
        className="
                    shadow-sm
                    border-0
                "
      >
        <Card.Body>
          <Table
            columnas={columnas}
            datos={especialistas}
            campoId="id_usuario"
            mostrarBuscador={true}
            camposBusqueda={["id_usuario", "nombre", "apellidos", "correo"]}
            placeholderBusqueda={"Buscar especialista por nombre o ID..."}
            mostrarAccion={true}
            textoAccion={"📅 Disponibilidad"}
            onAccion={verDisponibilidad}
          />
        </Card.Body>
      </Card>

      {/* =================================================
                MODAL DISPONIBILIDAD
            ================================================= */}

      <Modal
        show={modalAbierto && usuarioSeleccionado !== null}
        onHide={cerrarModal}
        size="xl"
        centered
        scrollable
      >
        {/* =================================================
                    HEADER
                ================================================= */}

        <Modal.Header closeButton>
          <Modal.Title>
            <div>📅 Disponibilidad</div>

            <small
              className="
                                text-muted
                                fw-normal
                            "
            >
              {usuarioSeleccionado?.nombre} {usuarioSeleccionado?.apellidos}
              {usuarioSeleccionado?.especializacion &&
                ` · ${usuarioSeleccionado.especializacion}`}
            </small>
          </Modal.Title>
        </Modal.Header>

        {/* =================================================
                    BODY
                ================================================= */}

        <Modal.Body>
          {usuarioSeleccionado && (
            <CalendarioDisponibilidad
              idEspecialista={usuarioSeleccionado.id_usuario}
              onSeleccionarHorario={seleccionarHorario}
            />
          )}
        </Modal.Body>

        {/* =================================================
                    FOOTER
                ================================================= */}

        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Especialista;
