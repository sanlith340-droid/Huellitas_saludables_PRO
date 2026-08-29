import { useEffect, useState } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Badge,
  Modal as BootstrapModal,
  Spinner,
} from "react-bootstrap";

import {
  obtenerCitaDraft,
  actualizarMotivo,
} from "../../services/citaDraftService";

import { crearCita } from "../../services/citaService";

import Notificacion from "../../components/Notificacion/Notificacion";

import ListarCitas from "./ListarCitas";

function Citas() {
  // =====================================================
  // ESTADOS
  // =====================================================

  const [mostrarModal, setMostrarModal] = useState(false);

  const [draft, setDraft] = useState(null);

  const [motivo, setMotivo] = useState("");

  // =====================================================
  // ESTADOS DE CREACIÓN
  // =====================================================

  const [creandoCita, setCreandoCita] = useState(false);

  const [citaCreada, setCitaCreada] = useState(null);

  // =====================================================
  // NOTIFICACIÓN
  // =====================================================

  const [notificacion, setNotificacion] = useState({
    mostrar: false,
    tipo: "info",
    mensaje: "",
  });

  // =====================================================
  // CARGAR DRAFT
  // =====================================================

  useEffect(() => {
    cargarDraft();
  }, []);

  const cargarDraft = () => {
    const cita = obtenerCitaDraft();

    console.log("DRAFT CARGADO EN CITAS:", cita);

    if (cita) {
      setDraft(cita);

      setMotivo(cita.motivo || "");
    } else {
      setDraft(null);

      setMotivo("");
    }
  };

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
  // ACTUALIZAR MOTIVO
  // =====================================================

  const cambiarMotivo = (e) => {
    const nuevoMotivo = e.target.value;

    setMotivo(nuevoMotivo);

    const nuevoDraft = actualizarMotivo(nuevoMotivo);

    setDraft(nuevoDraft);
  };

  // =====================================================
  // CONSTRUIR OBJETO POST
  // =====================================================

  const construirObjetoCita = () => {
    if (!draft) {
      return null;
    }

    return {
      id_recepcionista: draft.id_recepcionista,

      id_mascota: draft.id_mascota,

      id_disponibilidad: draft.id_disponibilidad,

      motivo: motivo.trim(),
    };
  };

  // =====================================================
  // CREAR CITA
  // =====================================================

  const prepararCita = async () => {
    const objetoCita = construirObjetoCita();

    console.log("OBJETO PARA CREAR CITA:", objetoCita);

    // =================================================
    // VALIDAR DRAFT
    // =================================================

    if (!objetoCita) {
      mostrarNotificacion("warning", "No existe una cita en construcción.");

      return;
    }

    // =================================================
    // VALIDAR MASCOTA
    // =================================================

    if (!objetoCita.id_mascota) {
      mostrarNotificacion("warning", "Debe seleccionar una mascota.");

      return;
    }

    // =================================================
    // VALIDAR DISPONIBILIDAD
    // =================================================

    if (!objetoCita.id_disponibilidad) {
      mostrarNotificacion("warning", "Debe seleccionar un horario disponible.");

      return;
    }

    // =================================================
    // VALIDAR MOTIVO
    // =================================================

    if (!objetoCita.motivo) {
      mostrarNotificacion("warning", "Debe ingresar el motivo de la cita.");

      return;
    }

    // =================================================
    // CREAR CITA
    // =================================================

    try {
      setCreandoCita(true);

      cerrarNotificacion();

      const resultado = await crearCita(objetoCita);

      console.log("RESPUESTA CREAR CITA:", resultado);

      // =================================================
      // ÉXITO
      // =================================================

      if (resultado.status) {
        setCitaCreada(resultado.data);

        mostrarNotificacion(
          "success",
          resultado.mensaje || "Cita creada correctamente.",
        );

        // ===============================================
        // ACTUALIZAR DRAFT CON INFORMACIÓN DE LA CITA
        // ===============================================

        const nuevoDraft = {
          ...draft,

          cita: resultado.data,

          estado: resultado.data?.estado || "pendiente",
        };

        setDraft(nuevoDraft);

        // ===============================================
        // CERRAR MODAL
        // ===============================================

        setMostrarModal(false);

        return;
      }

      // =================================================
      // ERROR DEL BACKEND
      // =================================================

      mostrarNotificacion(
        "danger",
        resultado.mensaje || "No fue posible crear la cita.",
      );
    } catch (error) {
      console.error("Error creando cita:", error);

      mostrarNotificacion("danger", "No fue posible conectar con el servidor.");
    } finally {
      setCreandoCita(false);
    }
  };

  // =====================================================
  // SI NO EXISTE DRAFT
  // =====================================================

  const mostrarSinDraft = () => {
    return (
      <Alert variant="info" className="mt-4">
        <Alert.Heading>📅 Nueva cita</Alert.Heading>

        <p className="mb-0">
          No hay una cita en construcción. Seleccione primero una mascota y un
          horario disponible.
        </p>
      </Alert>
    );
  };

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
        onCerrar={cerrarNotificacion}
      />

      {/* =================================================
          ENCABEZADO
      ================================================= */}

      <Row className="align-items-center mb-4">
        <Col>
          <h1 className="mb-1">Citas</h1>

          <p className="text-muted mb-0">Gestión de citas veterinarias</p>
        </Col>

        <Col xs="auto">
          <Button
            variant="primary"
            onClick={() => {
              cargarDraft();

              setMostrarModal(true);
            }}
          >
            + Nueva cita
          </Button>
        </Col>
      </Row>

      {/* =================================================
          CITA CREADA
      ================================================= */}

      {citaCreada && (
        <Alert variant="success" className="mb-4">
          <Alert.Heading>✅ Cita creada correctamente</Alert.Heading>
          <p className="mb-1">La cita fue registrada correctamente.</p>
          <strong>ID de cita:</strong> {citaCreada.id_cita}
          <br />
          <strong>Estado:</strong>{" "}
          <Badge bg="warning" text="dark">
            {citaCreada.estado}
          </Badge>
        </Alert>
      )}

      {/* =================================================
          SIN DRAFT
      ================================================= */}

      {!draft && mostrarSinDraft()}

      {/* =================================================
          DRAFT
      ================================================= */}

      {draft && (
        <Card className="shadow-sm border-0">
          {/* =================================================
              HEADER
          ================================================= */}

          <Card.Header className="bg-white py-3">
            <Row className="align-items-center">
              <Col>
                <h4 className="mb-1">📅 Cita</h4>

                <small className="text-muted">Información de la cita</small>
              </Col>

              <Col xs="auto">
                <Badge
                  bg={citaCreada ? "success" : "warning"}
                  text={citaCreada ? "white" : "dark"}
                >
                  {citaCreada ? "Registrada" : "En construcción"}
                </Badge>
              </Col>
            </Row>
          </Card.Header>

          <Card.Body>
            {/* =================================================
                MASCOTA
            ================================================= */}

            <Card className="mb-4">
              <Card.Header>
                <strong>🐾 Mascota</strong>
              </Card.Header>

              <Card.Body>
                <Row>
                  <Col md={3}>
                    <small className="text-muted">ID mascota</small>

                    <div className="fw-bold">
                      {draft.mascota?.id_mascota || draft.id_mascota}
                    </div>
                  </Col>

                  <Col md={3}>
                    <small className="text-muted">Nombre</small>

                    <div className="fw-bold">
                      {draft.mascota?.nombre || "Sin nombre"}
                    </div>
                  </Col>

                  <Col md={3}>
                    <small className="text-muted">Especie</small>

                    <div className="fw-bold">
                      {draft.mascota?.especie || "-"}
                    </div>
                  </Col>

                  <Col md={3}>
                    <small className="text-muted">Raza</small>

                    <div className="fw-bold">{draft.mascota?.raza || "-"}</div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* =================================================
                PROPIETARIO
            ================================================= */}

            {draft.propietario && (
              <Card className="mb-4">
                <Card.Header>
                  <strong>👤 Propietario</strong>
                </Card.Header>

                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <small className="text-muted">Nombre</small>

                      <div className="fw-bold">
                        {draft.propietario.nombre} {draft.propietario.apellidos}
                      </div>
                    </Col>

                    <Col md={4}>
                      <small className="text-muted">Correo</small>

                      <div>{draft.propietario.correo}</div>
                    </Col>

                    <Col md={4}>
                      <small className="text-muted">Teléfono</small>

                      <div>{draft.propietario.telefono}</div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            {/* =================================================
                RECEPCIONISTA
            ================================================= */}

            <Card className="mb-4">
              <Card.Header>
                <strong>👩‍💼 Recepcionista</strong>
              </Card.Header>

              <Card.Body>
                <Row>
                  <Col md={3}>
                    <small className="text-muted">Nombre</small>

                    <div className="fw-bold">
                      {draft.recepcionista?.nombre}{" "}
                      {draft.recepcionista?.apellidos}
                    </div>
                  </Col>

                  <Col md={3}>
                    <small className="text-muted">ID</small>

                    <div>{draft.id_recepcionista}</div>
                  </Col>

                  <Col md={3}>
                    <small className="text-muted">Correo</small>

                    <div>{draft.recepcionista?.correo}</div>
                  </Col>

                  <Col md={3}>
                    <small className="text-muted">Teléfono</small>

                    <div>{draft.recepcionista?.telefono}</div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* =================================================
                ESPECIALISTA
            ================================================= */}

            <Card className="mb-4">
              <Card.Header>
                <strong>🩺 Veterinario</strong>
              </Card.Header>

              <Card.Body>
                {draft.especialista ? (
                  <Row>
                    <Col md={4}>
                      <small className="text-muted">Nombre</small>

                      <div className="fw-bold">
                        {draft.especialista.nombre}{" "}
                        {draft.especialista.apellidos}
                      </div>
                    </Col>

                    <Col md={4}>
                      <small className="text-muted">ID</small>

                      <div>{draft.especialista.id_usuario}</div>
                    </Col>

                    <Col md={4}>
                      <small className="text-muted">Especialización</small>

                      <div>{draft.especialista.especializacion}</div>
                    </Col>
                  </Row>
                ) : (
                  <Alert variant="warning" className="mb-0">
                    No se ha seleccionado veterinario.
                  </Alert>
                )}
              </Card.Body>
            </Card>

            {/* =================================================
                HORARIO
            ================================================= */}

            <Card className="mb-4">
              <Card.Header>
                <strong>🕐 Horario</strong>
              </Card.Header>

              <Card.Body>
                {draft.disponibilidad ? (
                  <Row>
                    <Col md={4}>
                      <small className="text-muted">ID disponibilidad</small>

                      <div className="fw-bold">{draft.id_disponibilidad}</div>
                    </Col>

                    <Col md={4}>
                      <small className="text-muted">Fecha</small>

                      <div className="fw-bold">
                        {draft.disponibilidad.fecha}
                      </div>
                    </Col>

                    <Col md={4}>
                      <small className="text-muted">Hora</small>

                      <div className="fw-bold">
                        {draft.disponibilidad.hora?.slice(0, 5)}
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <Alert variant="warning" className="mb-0">
                    No se ha seleccionado horario.
                  </Alert>
                )}
              </Card.Body>
            </Card>

            {/* =================================================
                MOTIVO
            ================================================= */}

            <Card className="mb-4">
              <Card.Header>
                <strong>📝 Motivo de la cita</strong>
              </Card.Header>

              <Card.Body>
                <Form.Group>
                  <Form.Label>Motivo</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={motivo}
                    onChange={cambiarMotivo}
                    placeholder="Digite el motivo de la cita..."
                    disabled={!!citaCreada}
                  />
                </Form.Group>
              </Card.Body>
            </Card>

            {/* =================================================
                ACCIONES
            ================================================= */}

            {!citaCreada && (
              <div className="d-flex justify-content-end">
                <Button
                  variant="success"
                  size="lg"
                  onClick={prepararCita}
                  disabled={creandoCita}
                >
                  {creandoCita ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Creando cita...
                    </>
                  ) : (
                    <>📅 Crear cita</>
                  )}
                </Button>
              </div>
            )}

            {/* =================================================
                LISTAR CITAS
            ================================================= */}

            {draft.id_mascota && (
              <div className="mt-5">
                <ListarCitas idMascota={draft.id_mascota} />
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* =================================================
          MODAL NUEVA CITA
      ================================================= */}

      <BootstrapModal
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        centered
        size="lg"
      >
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title>📅 Nueva cita</BootstrapModal.Title>
        </BootstrapModal.Header>

        <BootstrapModal.Body>
          {draft ? (
            <>
              <Alert variant="info">
                <strong>Mascota:</strong>{" "}
                {draft.mascota?.nombre || "Sin seleccionar"}
              </Alert>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Veterinario:</strong>

                  <p>
                    {draft.especialista?.nombre} {draft.especialista?.apellidos}
                  </p>
                </Col>

                <Col md={3}>
                  <strong>Fecha:</strong>

                  <p>{draft.disponibilidad?.fecha || "-"}</p>
                </Col>

                <Col md={3}>
                  <strong>Hora:</strong>

                  <p>{draft.disponibilidad?.hora?.slice(0, 5) || "-"}</p>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Motivo</Form.Label>

                <Form.Control
                  as="textarea"
                  rows={4}
                  value={motivo}
                  onChange={cambiarMotivo}
                  placeholder="Digite el motivo..."
                />
              </Form.Group>

              <Button
                variant="success"
                onClick={prepararCita}
                disabled={creandoCita}
              >
                {creandoCita ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Creando...
                  </>
                ) : (
                  "📅 Crear cita"
                )}
              </Button>
            </>
          ) : (
            <Alert variant="warning">
              Primero seleccione una mascota y un horario disponible.
            </Alert>
          )}
        </BootstrapModal.Body>

        <BootstrapModal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cerrar
          </Button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </Container>
  );
}

export default Citas;
