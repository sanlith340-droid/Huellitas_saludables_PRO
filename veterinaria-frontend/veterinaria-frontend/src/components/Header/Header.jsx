import { useAuth } from "../../context/AuthContext";
import "./Header.css";

function Header() {

    const { usuario } = useAuth();

    return (
        <header className="header">

            <div>
                <h2>Sistema Veterinario</h2>
            </div>

            <div className="user-info">

                <div>
                    <strong>
                        {usuario.nombre} {usuario.apellidos}
                    </strong>

                    <small>
                        {usuario.rol}
                    </small>
                </div>

                <div className="avatar">
                    {usuario.nombre?.charAt(0)}
                </div>

            </div>

        </header>
    );
}

export default Header;