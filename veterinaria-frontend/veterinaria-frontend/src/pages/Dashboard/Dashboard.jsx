import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import { useAuth } from "../../context/AuthContext";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";

import InicioDashboard from "./InicioDashboard";

import Usuarios from "../usuarios/Usuarios";
import Mascotas from "../mascotas/Mascotas";
import Citas from "../citas/Citas";
import Especialista from "../especialista/Especialista";

function Dashboard() {
  const { usuario } = useAuth();

  const [pagina, setPagina] = useState("dashboard");

  const renderContenido = () => {
    switch (pagina) {
      case "usuarios":
        return <Usuarios />;

      case "mascotas":
        return <Mascotas />;

      case "especialista":
        return <Especialista />;

      case "citas":
        return <Citas />;

      default:
        return <InicioDashboard usuario={usuario} />;
    }
  };

  return (
    <Container fluid className="p-0 min-vh-100">
      <Row className="g-0 min-vh-100">
        <Col xs="auto" className="bg-dark">
          <Sidebar
            rol={usuario.rol}
            pagina={pagina}
            cambiarPagina={setPagina}
          />
        </Col>

        <Col>
          <div className="d-flex flex-column min-vh-100">
            <Header />

            <main className="flex-grow-1 bg-light">{renderContenido()}</main>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
