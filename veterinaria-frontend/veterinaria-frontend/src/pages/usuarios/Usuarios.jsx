import { useEffect, useState } from "react";

import {
  Container,
  Row,
  Col,
  Alert,
  Spinner,
  Card,
  Badge,
} from "react-bootstrap";

import Table from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";
import DetalleMascota from "../../components/DetalleMascota/DetalleMascota";

import { obtenerUsuarios } from "../../services/usuarioService";

import { obtenerMascotasUsuario } from "../../services/mascotaService";

function Usuarios() {
  // =====================================================
  // USUARIOS
  // =====================================================

  const [usuarios, setUsuarios] = useState([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // MODAL
  // =====================================================

  const [modalAbierto, setModalAbierto] = useState(false);

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  // =====================================================
  // MASCOTAS
  // =====================================================

  const [mascotas, setMascotas] = useState([]);

  const [cargandoMascotas, setCargandoMascotas] = useState(false);

  const [errorMascotas, setErrorMascotas] = useState("");

  // =====================================================
  // MASCOTA SELECCIONADA
  // =====================================================

  const [mascotaSeleccionada, setMascotaSeleccionada] = useState(null);

  // =====================================================
  // CARGAR USUARIOS
  // =====================================================

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setCargando(true);

    setError("");

    try {
      const resultado = await obtenerUsuarios();

      if (resultado.status) {
        setUsuarios(resultado.data || []);
      } else {
        setError(resultado.mensaje || "No fue posible cargar los usuarios.");
      }
    } catch (error) {
      console.error("Error obteniendo usuarios:", error);

      setError("Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  // =====================================================
  // VER MASCOTAS
  // =====================================================

  const verMascotas = async (usuario) => {
    setUsuarioSeleccionado(usuario);

    setMascotaSeleccionada(null);

    setMascotas([]);

    setErrorMascotas("");

    setModalAbierto(true);

    setCargandoMascotas(true);

    try {
      const resultado = await obtenerMascotasUsuario(usuario.id_usuario);

      if (resultado.status) {
        setMascotas(resultado.data || []);
      } else {
        setErrorMascotas(
          resultado.mensaje || "No fue posible obtener las mascotas.",
        );
      }
    } catch (error) {
      console.error("Error obteniendo mascotas:", error);

      setErrorMascotas("Error de conexión con el servidor.");
    } finally {
      setCargandoMascotas(false);
    }
  };

  // =====================================================
  // SELECCIONAR MASCOTA
  // =====================================================

  const seleccionarMascota = (mascota) => {
    setMascotaSeleccionada(mascota);
  };

  // =====================================================
  // CERRAR MODAL
  // =====================================================

  const cerrarModal = () => {
    setModalAbierto(false);

    setUsuarioSeleccionado(null);

    setMascotas([]);

    setMascotaSeleccionada(null);

    setErrorMascotas("");
  };

  // =====================================================
  // COLUMNAS
  // =====================================================

  const columnas = [
    "id_usuario",
    "nombre",
    "apellidos",
    "telefono",
    "correo",
    "tipo",
  ];

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

            <div className="mt-3 text-muted">Cargando usuarios...</div>
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
  // RENDER
  // =====================================================

  return (
    <Container fluid className="py-4">
      {/* =================================================
                ENCABEZADO
            ================================================= */}

      <Row className="mb-4">
        <Col>
          <div>
            <h1 className="h3 mb-1 fw-bold">Usuarios</h1>

            <p className="text-muted mb-0">Gestión de usuarios del sistema</p>
          </div>
        </Col>

        <Col
          xs="auto"
          className="
                        d-flex
                        align-items-center
                    "
        >
          <Badge bg="primary" className="px-3 py-2">
            {usuarios.length} usuarios
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
            datos={usuarios}
            campoId="id_usuario"
            mostrarBuscador={true}
            camposBusqueda={["id_usuario", "nombre", "apellidos", "correo"]}
            placeholderBusqueda={"Buscar usuario por nombre o ID..."}
            mostrarAccion={true}
            textoAccion="🐾 Mascotas"
            onAccion={verMascotas}
            elementosPorPagina={5}
          />
        </Col>
      </Row>

      {/* =================================================
                MODAL
            ================================================= */}

      <Modal
        abierto={modalAbierto}
        cerrar={cerrarModal}
        titulo="Mascotas"
        subtitulo={
          usuarioSeleccionado
            ? `${usuarioSeleccionado.tipo} · Usuario: ${usuarioSeleccionado.nombre} ${usuarioSeleccionado.apellidos} · ${usuarioSeleccionado.id_usuario}`
            : ""
        }
      >
        {/* =================================================
                    CARGANDO MASCOTAS
                ================================================= */}

        {cargandoMascotas && (
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

              <div className="mt-3 text-muted">Cargando mascotas...</div>
            </div>
          </div>
        )}

        {/* =================================================
                    ERROR MASCOTAS
                ================================================= */}

        {!cargandoMascotas && errorMascotas && (
          <Alert variant="danger" className="mb-0">
            {errorMascotas}
          </Alert>
        )}

        {/* =================================================
                    SIN MASCOTAS
                ================================================= */}

        {!cargandoMascotas && !errorMascotas && mascotas.length === 0 && (
          <Alert variant="info" className="mb-0">
            Este usuario no tiene mascotas asociadas.
          </Alert>
        )}

        {/* =================================================
                    LISTA DE MASCOTAS
                ================================================= */}

        {!cargandoMascotas && !errorMascotas && mascotas.length > 0 && (
          <Row className="g-3">
            {mascotas.map((mascota) => (
              <Col xs={12} md={6} lg={4} key={mascota.id_mascota}>
                <Card
                  className={`
                                                h-100
                                                shadow-sm
                                                ${
                                                  mascotaSeleccionada?.id_mascota ===
                                                  mascota.id_mascota
                                                    ? "border-primary"
                                                    : ""
                                                }
                                            `}
                  role="button"
                  onClick={() => seleccionarMascota(mascota)}
                >
                  <Card.Body>
                    {/* ICONO */}

                    <div
                      className="
                                                        text-center
                                                        fs-1
                                                        mb-2
                                                    "
                    >
                      {mascota.especie?.toLowerCase() === "perro" ? "🐶" : "🐱"}
                    </div>

                    {/* NOMBRE */}

                    <Card.Title className="text-center">
                      {mascota.nombre_mascota}
                    </Card.Title>

                    {/* INFORMACIÓN */}

                    <div
                      className="
                                                        text-muted
                                                        small
                                                    "
                    >
                      <div className="mb-1">
                        <strong>ID:</strong> {mascota.id_mascota}
                      </div>

                      <div className="mb-1">
                        <strong>Especie:</strong> {mascota.especie}
                      </div>

                      <div className="mb-1">
                        <strong>Género:</strong> {mascota.genero}
                      </div>

                      <div className="mb-1">
                        <strong>Raza:</strong> {mascota.raza || "No registrada"}
                      </div>

                      <div>
                        <strong>Fecha nacimiento:</strong>{" "}
                        {mascota.fecha_nacimiento || "No registrada"}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* =================================================
                    DETALLE MASCOTA
                ================================================= */}

        {mascotaSeleccionada && (
          <Card
            className="
                            mt-4
                            border-primary
                            shadow-sm
                        "
          >
            <Card.Header
              className="
                                bg-primary
                                text-white
                            "
            >
              <strong>🐾 Detalle de la mascota</strong>
            </Card.Header>

            <Card.Body>
              <DetalleMascota mascota={mascotaSeleccionada} />
            </Card.Body>
          </Card>
        )}
      </Modal>
    </Container>
  );
}

export default Usuarios;
