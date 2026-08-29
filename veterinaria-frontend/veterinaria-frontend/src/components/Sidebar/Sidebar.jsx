import { Nav, Button } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ rol, pagina, cambiarPagina }) {
  const { logout } = useAuth();

  const menuBase = [
    {
      id: "dashboard",
      icono: "🏠",
      nombre: "Dashboard",
    },
  ];

  const menuRecepcionista = [
    {
      id: "usuarios",
      icono: "👥",
      nombre: "Usuarios",
    },
    {
      id: "mascotas",
      icono: "🐶",
      nombre: "Mascotas",
    },
    {
      id: "especialista",
      icono: "🩺",
      nombre: "Especialistas",
    },
    {
      id: "citas",
      icono: "📅",
      nombre: "Citas",
    },
  ];

  const menuEspecialista = [
    {
      id: "citas",
      icono: "📅",
      nombre: "Mis citas",
    },
    {
      id: "pacientes",
      icono: "🐶",
      nombre: "Mis pacientes",
    },
    {
      id: "historias",
      icono: "📋",
      nombre: "Historias clínicas",
    },
  ];

  const obtenerMenu = () => {
    if (rol === "recepcionista") {
      return [...menuBase, ...menuRecepcionista];
    }

    if (rol === "especialista") {
      return [...menuBase, ...menuEspecialista];
    }

    return menuBase;
  };

  const menu = obtenerMenu();

  return (
    <aside
      className="
                bg-dark
                text-white
                d-flex
                flex-column
                min-vh-100
                p-3
            "
      style={{
        width: "250px",
      }}
    >
      {/* LOGO */}

      <div
        className="
                    fs-5
                    fw-bold
                    text-center
                    py-3
                    mb-3
                    border-bottom
                    border-secondary
                "
      >
        🐾 Veterinaria
      </div>

      {/* MENÚ */}

      <Nav
        className="
                    flex-column
                    gap-1
                "
      >
        {menu.map((item) => (
          <Nav.Link
            key={item.id}
            as="button"
            type="button"
            onClick={() => cambiarPagina(item.id)}
            className={`
                            text-start
                            text-white
                            rounded
                            px-3
                            py-2
                            border-0
                            ${pagina === item.id ? "bg-primary" : ""}
                        `}
          >
            <span className="me-2">{item.icono}</span>

            {item.nombre}
          </Nav.Link>
        ))}
      </Nav>

      {/* ESPACIO */}

      <div className="flex-grow-1" />

      {/* CERRAR SESIÓN */}

      <Button variant="outline-light" className="w-100" onClick={logout}>
        🚪 Cerrar sesión
      </Button>
    </aside>
  );
}

export default Sidebar;
