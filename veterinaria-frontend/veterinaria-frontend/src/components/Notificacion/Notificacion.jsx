import { Alert } from "react-bootstrap";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

function Notificacion({ mostrar, tipo = "info", titulo, mensaje, onCerrar }) {
  if (!mostrar) {
    return null;
  }

  // =====================================================
  // ICONOS
  // =====================================================

  const iconos = {
    success: <CheckCircle size={24} />,
    danger: <XCircle size={24} />,
    warning: <AlertTriangle size={24} />,
    info: <Info size={24} />,
  };

  return (
    <Alert variant={tipo} dismissible onClose={onCerrar} className="shadow-sm">
      <div className="d-flex align-items-start gap-2">
        <div>{iconos[tipo]}</div>

        <div>
          {titulo && (
            <Alert.Heading className="fs-6 mb-1">{titulo}</Alert.Heading>
          )}

          <div>{mensaje}</div>
        </div>
      </div>
    </Alert>
  );
}

export default Notificacion;
