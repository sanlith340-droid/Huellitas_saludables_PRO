import { useEffect, useMemo, useState } from "react";

import {
  Card,
  Form,
  InputGroup,
  Button,
  Table as BootstrapTable,
  Badge,
  Pagination,
} from "react-bootstrap";

import { Search, X } from "lucide-react";

function Table({
  columnas,
  datos,
  renderCelda,

  // Campo que identifica el registro
  campoId = null,

  // Permitir buscador
  mostrarBuscador = true,

  // Campos donde buscar
  camposBusqueda = [],

  // Texto del buscador
  placeholderBusqueda = "Buscar...",

  // Mostrar botón
  mostrarAccion = false,

  // Texto del botón
  textoAccion = "Ver",

  // Función que recibe la fila completa
  onAccion,

  // Cantidad por página
  elementosPorPagina = 5,
}) {
  const [busqueda, setBusqueda] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);

  // =====================================================
  // BUSCAR
  // =====================================================

  const datosFiltrados = useMemo(() => {
    if (!busqueda.trim()) {
      return datos;
    }

    const texto = busqueda.toLowerCase().trim();

    return datos.filter((fila) => {
      // Buscar en toda la fila

      if (camposBusqueda.length === 0) {
        return Object.values(fila).some((valor) => {
          if (valor === null || valor === undefined) {
            return false;
          }

          return String(valor).toLowerCase().includes(texto);
        });
      }

      // Buscar solamente
      // en campos seleccionados

      return camposBusqueda.some((campo) => {
        const valor = fila[campo];

        if (valor === null || valor === undefined) {
          return false;
        }

        return String(valor).toLowerCase().includes(texto);
      });
    });
  }, [datos, busqueda, camposBusqueda]);

  // =====================================================
  // PAGINACIÓN
  // =====================================================

  const totalPaginas = Math.ceil(datosFiltrados.length / elementosPorPagina);

  // Reiniciar página cuando cambia búsqueda

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  // Corregir página si los datos cambian

  useEffect(() => {
    if (paginaActual > totalPaginas && totalPaginas > 0) {
      setPaginaActual(totalPaginas);
    }
  }, [paginaActual, totalPaginas]);

  const indiceInicial = (paginaActual - 1) * elementosPorPagina;

  const indiceFinal = indiceInicial + elementosPorPagina;

  const datosPagina = datosFiltrados.slice(indiceInicial, indiceFinal);

  // =====================================================
  // CAMBIAR PÁGINA
  // =====================================================

  const cambiarPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
    }
  };

  // =====================================================
  // LIMPIAR BÚSQUEDA
  // =====================================================

  const limpiarBusqueda = () => {
    setBusqueda("");

    setPaginaActual(1);
  };

  // =====================================================
  // FORMATEAR COLUMNA
  // =====================================================

  const formatearColumna = (columna) => {
    return columna
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letra) => letra.toUpperCase());
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Card
      className="
                border-0
                shadow-sm
                rounded-3
            "
    >
      {/* =================================================
                BARRA SUPERIOR
            ================================================= */}

      {mostrarBuscador && (
        <Card.Header
          className="
                        bg-white
                        border-0
                        p-3
                    "
        >
          <div
            className="
                            d-flex
                            flex-column
                            flex-md-row
                            justify-content-between
                            align-items-md-center
                            gap-3
                        "
          >
            {/* BUSCADOR */}

            <InputGroup
              style={{
                maxWidth: "400px",
              }}
            >
              <InputGroup.Text className="bg-white">
                <Search size={18} />
              </InputGroup.Text>

              <Form.Control
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder={placeholderBusqueda}
              />

              {busqueda && (
                <Button
                  variant="outline-secondary"
                  onClick={limpiarBusqueda}
                  title="Limpiar búsqueda"
                >
                  <X size={17} />
                </Button>
              )}
            </InputGroup>

            {/* RESULTADOS */}

            <Badge
              bg="light"
              text="dark"
              className="
                                border
                                px-3
                                py-2
                            "
            >
              {datosFiltrados.length} registros
            </Badge>
          </div>
        </Card.Header>
      )}

      {/* =================================================
                TABLA
            ================================================= */}

      <div className="table-responsive">
        <BootstrapTable
          hover
          bordered
          responsive
          className="
                        align-middle
                        mb-0
                    "
        >
          {/* CABECERA */}

          <thead className="table-light">
            <tr>
              {columnas.map((columna) => (
                <th
                  key={columna}
                  className="
                                            text-nowrap
                                        "
                >
                  {formatearColumna(columna)}
                </th>
              ))}

              {mostrarAccion && (
                <th
                  className="
                                        text-center
                                        text-nowrap
                                    "
                >
                  Acción
                </th>
              )}
            </tr>
          </thead>

          {/* CUERPO */}

          <tbody>
            {datosPagina.length === 0 ? (
              <tr>
                <td
                  colSpan={columnas.length + (mostrarAccion ? 1 : 0)}
                  className="
                                        text-center
                                        text-muted
                                        py-5
                                    "
                >
                  <Search size={32} className="mb-2" />

                  <div>No se encontraron registros</div>
                </td>
              </tr>
            ) : (
              datosPagina.map((fila, indice) => (
                <tr key={campoId ? fila[campoId] : indice}>
                  {columnas.map((columna) => (
                    <td key={columna}>
                      {renderCelda
                        ? renderCelda(columna, fila[columna], fila)
                        : fila[columna]}
                    </td>
                  ))}

                  {/* ACCIÓN */}

                  {mostrarAccion && (
                    <td
                      className="
                                                    text-center
                                                "
                    >
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => onAccion && onAccion(fila)}
                        title={textoAccion}
                      >
                        {textoAccion}
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </BootstrapTable>
      </div>

      {/* =================================================
                PIE
            ================================================= */}

      {datosFiltrados.length > 0 && (
        <Card.Footer
          className="
                        bg-white
                        border-0
                        p-3
                    "
        >
          <div
            className="
                            d-flex
                            flex-column
                            flex-md-row
                            justify-content-between
                            align-items-md-center
                            gap-3
                        "
          >
            {/* INFORMACIÓN */}

            <small className="text-muted">
              Mostrando <strong>{indiceInicial + 1}</strong>
              {" - "}
              <strong>{Math.min(indiceFinal, datosFiltrados.length)}</strong>
              {" de "}
              <strong>{datosFiltrados.length}</strong>
            </small>

            {/* PAGINACIÓN */}

            {totalPaginas > 1 && (
              <Pagination className="mb-0">
                <Pagination.First
                  onClick={() => cambiarPagina(1)}
                  disabled={paginaActual === 1}
                />

                <Pagination.Prev
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                />

                {Array.from(
                  {
                    length: totalPaginas,
                  },
                  (_, indice) => {
                    const pagina = indice + 1;

                    return (
                      <Pagination.Item
                        key={pagina}
                        active={paginaActual === pagina}
                        onClick={() => cambiarPagina(pagina)}
                      >
                        {pagina}
                      </Pagination.Item>
                    );
                  },
                )}

                <Pagination.Next
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                />

                <Pagination.Last
                  onClick={() => cambiarPagina(totalPaginas)}
                  disabled={paginaActual === totalPaginas}
                />
              </Pagination>
            )}
          </div>
        </Card.Footer>
      )}
    </Card>
  );
}

export default Table;
