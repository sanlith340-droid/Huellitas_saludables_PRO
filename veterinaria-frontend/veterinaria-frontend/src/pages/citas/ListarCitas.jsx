import { useEffect, useState } from "react";

import { Card, Table, Badge, Alert, Spinner, Row, Col } from "react-bootstrap";

import { obtenerCitasPorMascota } from "../../services/citaService";

function ListarCitas({ idMascota }) {
  // =====================================================
  // ESTADOS
  // =====================================================

  const [citas, setCitas] = useState([]);

  const [cargando, setCargando] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // CARGAR CITAS
  // =====================================================

  useEffect(() => {
    if (!idMascota) {
      setCitas([]);

      return;
    }

    cargarCitas();
  }, [idMascota]);

  // =====================================================
  // OBTENER CITAS
  // =====================================================

  const cargarCitas = async () => {
    try {
      setCargando(true);

      setError("");

      const resultado = await obtenerCitasPorMascota(idMascota);

      console.log("CITAS DE LA MASCOTA:", resultado);

      if (resultado.status) {
        setCitas(resultado.data || []);
      } else {
        setCitas([]);

        setError(resultado.mensaje || "No fue posible obtener las citas.");
      }
    } catch (error) {
      console.error("Error obteniendo citas:", error);

      setCitas([]);

      setError("Error de conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  // =====================================================
  // ESTADO DE LA CITA
  // =====================================================

  const obtenerVariantEstado = (estado) => {
    switch (estado?.toLowerCase()) {
      case "pendiente":
        return "warning";

      case "atendido":
        return "success";

      case "cancelado":
        return "danger";

      case "cancelada":
        return "danger";

      case "finalizado":
        return "success";

      default:
        return "secondary";
    }
  };

  // =====================================================
  // CARGANDO
  // =====================================================

  if (cargando) {
    return (
      <Card className="shadow-sm border-0">
        <Card.Body className="text-center py-5">
          <Spinner animation="border" variant="primary" />

          <p className="text-muted mt-3 mb-0">
            Cargando citas de la mascota...
          </p>
        </Card.Body>
      </Card>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <Card className="shadow-sm border-0">
        <Card.Header>
          <strong>📋 Historial de citas</strong>
        </Card.Header>

        <Card.Body>
          <Alert variant="danger" className="mb-0">
            {error}
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  // =====================================================
  // SIN CITAS
  // =====================================================

  if (citas.length === 0) {
    return (
      <Card className="shadow-sm border-0">
        <Card.Header>
          <strong>📋 Citas de la mascota</strong>
        </Card.Header>

        <Card.Body>
          <Alert variant="info" className="mb-0">
            Esta mascota no tiene citas registradas.
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  // =====================================================
  // VISTA
  // =====================================================

  return (
    <Card className="shadow-sm border-0">
      {/* =================================================
          HEADER
      ================================================= */}

      <Card.Header className="bg-white">
        <Row className="align-items-center">
          <Col>
            <h5 className="mb-1">📋 Citas de la mascota</h5>

            <small className="text-muted">Historial de citas registradas</small>
          </Col>

          <Col xs="auto">
            <Badge bg="primary">
              {citas.length} {citas.length === 1 ? "cita" : "citas"}
            </Badge>
          </Col>
        </Row>
      </Card.Header>

      {/* =================================================
          TABLA
      ================================================= */}

      <Card.Body>
        <div className="table-responsive">
          <Table hover bordered responsive className="align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>

                <th>Fecha</th>

                <th>Hora</th>

                <th>Motivo</th>

                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {citas.map((cita) => (
                <tr key={cita.id_cita}>
                  <td>
                    <strong>{cita.id_cita}</strong>
                  </td>

                  <td>{cita.fecha || cita.disponibilidad?.fecha || "-"}</td>

                  <td>
                    {cita.hora || cita.disponibilidad?.hora?.slice(0, 5) || "-"}
                  </td>

                  <td>{cita.motivo || "Sin motivo"}</td>

                  <td>
                    <Badge bg={obtenerVariantEstado(cita.estado_cita)}>
                      {cita.estado_cita || "Sin estado"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ListarCitas;
