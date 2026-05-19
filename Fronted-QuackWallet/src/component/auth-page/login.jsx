import { useState, useContext } from "react";
import { loginUser, resendVerificationEmail } from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Logo_QuackWallet from '../../assets/Logo_QuackWallet.png';
import './../../App.css'

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowResend(false);
    setIsLoading(true);

    try {
      const response = await loginUser(correo, password);
      if (response && response.token && response.user) {
        login(response.user, response.token);
        navigate("/home");
      } else {
        setError("Respuesta del servidor inválida");
      }
    } catch (err) {
      console.error("Error en login:", err);

      // Manejo mejorado de errores de login.jsx
      if (err.response?.status === 400) {
        const msg = err.response?.data?.message;
        if (msg === "Usuario no encontrado") setError("Correo no registrado");
        else if (msg === "Contraseña incorrecta") setError("Contraseña incorrecta");
        else setError(msg || "Credenciales incorrectas");
      } else if (err.message === "Email no verificado") {
        setError("Tu correo no ha sido verificado. Por favor, verifica tu correo.");
        setShowResend(true);
      } else {
        setError("Error de conexión. Intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerificationEmail(correo);
      setError("Correo de verificación enviado. Por favor, revisa tu bandeja de entrada.");
      setShowResend(false);
    } catch {
      setError("Error al reenviar el correo de verificación. Intenta nuevamente más tarde.");
    }
  };

  return (
    <div className="app-wrapper" aria-live="polite">
      <div className="login-card" role="region" aria-label="Login">

        {/* Logo: centrado por CSS */}
        <img src={Logo_QuackWallet} alt="QuackWallet logo" className="logo" />

        <h2 className="login-title">Iniciar sesión</h2>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-group">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="login-input"
              required
              autoComplete="email"
              aria-label="Correo electrónico"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
              autoComplete="current-password"
              aria-label="Contraseña"
            />
          </div>

          {/* Mensaje de error */}
          {error && <div className="form-error" role="alert">{error}</div>}

          {/* Reenviar verificación - versión mejorada */}
          {showResend && (
            <div style={{display:'flex',justifyContent:'center'}}>
              <button
                type="button"
                onClick={handleResendVerification}
                className="resend-btn text-sm text-blue-600 underline"
              >
                Reenviar correo de verificación
              </button>
            </div>
          )}

          {/* Botón principal */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              aria-busy={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Entrar"}
            </button>
          </div>
        </form>

        {/* Footer / registro */}
        <div className="form-footer">
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="btn btn-secondary"
          >
            Regístrate aquí
          </button>
        </div>
      </div>
    </div>
  );
}