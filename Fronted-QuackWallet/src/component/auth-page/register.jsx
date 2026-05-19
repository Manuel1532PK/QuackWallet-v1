import { useState } from "react";
import { registerUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import Logo_QuackWallet from "../../assets/Logo_QuackWallet.png";
import "../../App.css";

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    pin: "",
    confirmPin: ""
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldError, setFieldError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateFields = (data) => {
    const fe = {};

    if (!data.nombre.trim()) fe.nombre = "Ingresa tu nombre";
    if (!data.correo.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)) fe.correo = "Correo inválido";
    if (!data.telefono.trim() || data.telefono.length < 7) fe.telefono = "Teléfono inválido";
    if (data.password.length < 6) fe.password = "La contraseña debe tener al menos 6 caracteres";
    if (data.password !== data.confirmPassword) fe.confirmPassword = "Las contraseñas no coinciden";
    if (!/^\d{4}$/.test(data.pin)) fe.pin = "El PIN debe ser 4 dígitos numéricos";
    if (data.pin !== data.confirmPin) fe.confirmPin = "Los PINs no coinciden";

    return fe;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Para campos numéricos (PIN), solo permitir números
    if (name === "pin" || name === "confirmPin") {
      if (!/^\d*$/.test(value) && value !== "") return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldError(prev => ({ ...prev, [name]: "" }));
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setFieldError({});

    const fe = validateFields(formData);
    if (Object.keys(fe).length > 0) {
      setFieldError(fe);
      return;
    }

    setIsLoading(true);
    try {
      await registerUser({
        Nombre_Usuario: formData.nombre,
        correo: formData.correo,
        Telefono: formData.telefono,
        Hash_Password: formData.password,
        Pin_Seguridad: formData.pin
      });

      // Mensaje de éxito mejorado
      setSuccessMessage("Te hemos enviado un correo de verificación. Por favor, verifica tu cuenta antes de iniciar sesión.");
      
      // Redirección después de mostrar el mensaje
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err) {
      // Manejo de errores mejorado
      const serverMsg = err?.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else {
        setError("Error al registrar usuario. Intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-wrapper" aria-live="polite">
      <div className="login-card" role="region" aria-label="Registro">

        {/* Logo centrado */}
        <img src={Logo_QuackWallet} alt="QuackWallet logo" className="logo" />

        <h2 className="login-title">Crear Cuenta</h2>

        <form onSubmit={handleSubmit} className="login-form" noValidate>

          {/* Nombre */}
          <div className="form-group">
            <input
              name="nombre"
              type="text"
              placeholder="Nombre completo"
              value={formData.nombre}
              onChange={handleChange}
              className="login-input"
              aria-invalid={!!fieldError.nombre}
              aria-describedby={fieldError.nombre ? "err-nombre" : undefined}
              required
            />
            {fieldError.nombre && <small id="err-nombre" className="field-error">{fieldError.nombre}</small>}
          </div>

          {/* Correo */}
          <div className="form-group">
            <input
              name="correo"
              type="email"
              placeholder="Correo electrónico"
              value={formData.correo}
              onChange={handleChange}
              className="login-input"
              aria-invalid={!!fieldError.correo}
              aria-describedby={fieldError.correo ? "err-correo" : undefined}
              required
            />
            {fieldError.correo && <small id="err-correo" className="field-error">{fieldError.correo}</small>}
          </div>

          {/* Teléfono */}
          <div className="form-group">
            <input
              name="telefono"
              type="tel"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              className="login-input"
              aria-invalid={!!fieldError.telefono}
              aria-describedby={fieldError.telefono ? "err-telefono" : undefined}
              required
            />
            {fieldError.telefono && <small id="err-telefono" className="field-error">{fieldError.telefono}</small>}
          </div>

          {/* Password */}
          <div className="form-group">
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className="login-input"
              aria-invalid={!!fieldError.password}
              aria-describedby={fieldError.password ? "err-password" : undefined}
              required
            />
            {fieldError.password && <small id="err-password" className="field-error">{fieldError.password}</small>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="login-input"
              aria-invalid={!!fieldError.confirmPassword}
              aria-describedby={fieldError.confirmPassword ? "err-confirmPassword" : undefined}
              required
            />
            {fieldError.confirmPassword && <small id="err-confirmPassword" className="field-error">{fieldError.confirmPassword}</small>}
          </div>

          {/* PINs en grid */}
          <div className="pins-grid">
            <div className="form-group">
              <input
                name="pin"
                type="password"
                inputMode="numeric"
                placeholder="PIN (4 dígitos)"
                value={formData.pin}
                onChange={handleChange}
                className="login-input"
                maxLength="4"
                pattern="\d{4}"
                aria-invalid={!!fieldError.pin}
                aria-describedby={fieldError.pin ? "err-pin" : undefined}
                required
              />
              {fieldError.pin && <small id="err-pin" className="field-error">{fieldError.pin}</small>}
            </div>

            <div className="form-group">
              <input
                name="confirmPin"
                type="password"
                inputMode="numeric"
                placeholder="Confirmar PIN"
                value={formData.confirmPin}
                onChange={handleChange}
                className="login-input"
                maxLength="4"
                pattern="\d{4}"
                aria-invalid={!!fieldError.confirmPin}
                aria-describedby={fieldError.confirmPin ? "err-confirmPin" : undefined}
                required
              />
              {fieldError.confirmPin && <small id="err-confirmPin" className="field-error">{fieldError.confirmPin}</small>}
            </div>
          </div>

          {/* Mensajes globales */}
          {error && <div className="form-error" role="alert">{error}</div>}
          {successMessage && <div className="form-success" role="alert">{successMessage}</div>}

          {/* Botón de registro */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              aria-busy={isLoading}
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="form-footer">
          ¿Ya tienes cuenta?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="btn btn-secondary"
          >
            Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
}