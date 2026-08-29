import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";

import "./styles/global.css";

ReactDOM.createRoot(
    document.getElementById("root")
).render(

    <React.StrictMode>

        <AuthProvider>
            <App />
        </AuthProvider>

    </React.StrictMode>
);