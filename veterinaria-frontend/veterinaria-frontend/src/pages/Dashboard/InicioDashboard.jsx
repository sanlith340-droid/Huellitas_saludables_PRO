import { Container, Row, Col, Card } from "react-bootstrap";

function InicioDashboard({ usuario }) {
  const esEspecialista = usuario.rol === "especialista";

  return (
    <Container fluid className="py-4">
      <Row className="g-4">
        <Col xs={12}>
          <h1 className="h3 mb-1">Dashboard</h1>

          <p className="text-muted">
            Bienvenido, <strong>{usuario.nombre}</strong>
          </p>
        </Col>

        {/* TARJETAS */}

        <Col xs={12} md={6} lg={4}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <Card.Title>Citas</Card.Title>

                  <h2>0</h2>

                  <Card.Text className="text-muted">Citas pendientes</Card.Text>
                </div>

                <span className="fs-1">📅</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {!esEspecialista && (
          <>
            <Col xs={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <Card.Title>Mascotas</Card.Title>

                      <h2>0</h2>

                      <Card.Text className="text-muted">
                        Mascotas registradas
                      </Card.Text>
                    </div>

                    <span className="fs-1">🐶</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={12} md={6} lg={4}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div>
                      <Card.Title>Usuarios</Card.Title>

                      <h2>0</h2>

                      <Card.Text className="text-muted">
                        Usuarios registrados
                      </Card.Text>
                    </div>

                    <span className="fs-1">👥</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </>
        )}
      </Row>
    </Container>
  );
}

export default InicioDashboard;
