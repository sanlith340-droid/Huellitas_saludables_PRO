import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
    const { autenticado } = useAuth();

    if (!autenticado) {
        return <Login />;
    }

    return <Dashboard />;
}

export default App;