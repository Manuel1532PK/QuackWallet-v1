import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Bootstrap
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

// Iconos
import {
  IoCardOutline,
  IoShieldCheckmarkOutline,
  IoAnalyticsOutline,
  IoBulbOutline,
  IoPersonCircleOutline,
  IoLogOutOutline,
  IoSettingsOutline,
  IoHomeOutline,
  IoPeopleOutline,
  IoCameraOutline,
  IoPencilOutline,
} from "react-icons/io5";

// API
import { userApi, getImageUrl } from "../../api/userApi";

// Sidebar + secciones (mantén igual)
const SECCIONES = [
  {
    title: "Seguridad",
    text: "Configuración de PIN, protección más avanzada de tus tarjetas.",
    icon: IoShieldCheckmarkOutline,
    color: "success",
    path: "/security",
  },
  {
    title: "Consultas",
    text: "Revisa los movimientos recientes de tus tarjetas y cuentas.",
    icon: IoAnalyticsOutline,
    color: "info",
    path: "/reports",
  },
  {
    title: "Novedades",
    text: "Últimas funcionalidades y actualizaciones.",
    icon: IoBulbOutline,
    color: "warning",
    path: "/news",
  },
  {
    title: "Conexiones",
    text: "Nuestros aliados y socios.",
    icon: IoPeopleOutline,
    color: "primary",
    path: "/connections",
  },
];

function Sidebar({ user, navigate, handleLogout, nombreUsuario, location, imagenPerfil }) {
  const menuLinks = [
    { name: "Inicio", path: "/home", icon: IoHomeOutline },
    { name: "Tarjetas", path: "/cards", icon: IoCardOutline },
    { name: "Perfil", path: "/profile", icon: IoPersonCircleOutline },
    { name: "Configuración", path: "/configuracion", icon: IoSettingsOutline },
  ];

  return (
    <div
      className="sidebar d-flex flex-column bg-white border-end shadow-lg"
      style={{
        width: "250px",
        minWidth: "250px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <div className="p-4 border-bottom text-center fs-3 fw-bold">
        <span className="text-warning me-1"></span>Quack
        <span className="fw-normal">Wallet</span>
      </div>

      {/* User */}
      <div className="p-3 text-center border-bottom bg-light">
        {imagenPerfil ? (
          <img
            src={getImageUrl(imagenPerfil)}
            alt="Perfil"
            className="rounded-circle mb-1"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
        ) : (
          <IoPersonCircleOutline size={30} className="text-secondary mb-1" />
        )}
        <p className="mb-0 fw-bold">{nombreUsuario}</p>
        <small className="text-muted">
          ID: {user?.id || "No disponible"}
        </small>
      </div>

      <Nav className="flex-column p-3 flex-grow-1" activeKey={location.pathname}>
        {menuLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Nav.Link
              key={link.path}
              onClick={() => navigate(link.path)}
              href={link.path}
              className={`d-flex align-items-center mb-1 rounded py-2 ${isActive
                  ? "bg-warning-subtle text-dark fw-bold border-start border-4 border-warning"
                  : "text-dark-50 hover-link-sidebar"
                }`}
            >
              <link.icon size={20} className="me-3" />
              {link.name}
            </Nav.Link>
          );
        })}

        <hr className="my-3" />

        <h6 className="px-3 mt-3 text-muted small fw-bold text-uppercase">
          Funciones rápidas
        </h6>

        {SECCIONES.map((sec) => {
          const isActive = location.pathname === sec.path;
          return (
            <Nav.Link
              key={sec.path}
              onClick={() => navigate(sec.path)}
              href={sec.path}
              className={`d-flex align-items-center mb-1 rounded py-2 ${isActive
                  ? "bg-warning-subtle text-dark fw-bold border-start border-4 border-warning"
                  : "text-dark-50 hover-link-sidebar"
                }`}
            >
              <sec.icon size={20} className="me-3" />
              {sec.title}
            </Nav.Link>
          );
        })}
      </Nav>

      <div className="p-3 border-top">
        <Button
          variant="danger"
          onClick={handleLogout}
          className="w-100 d-flex align-items-center justify-content-center"
        >
          <IoLogOutOutline size={20} className="me-2" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}

// Modal para editar perfil
function EditProfileModal({ show, onHide, user, onUpdateProfile, isLoading }) {
  const [formData, setFormData] = useState({
    Nombre_Usuario: "",
    Correo: "",
    Telefono: ""
  });
  const [imagen, setImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState("");
  const [errors, setErrors] = useState({});

  // Cargar datos del usuario cuando se abre el modal
  useEffect(() => {
    if (user && show) {
      setFormData({
        Nombre_Usuario: user.Nombre_Usuario || user.nombre || "",
        Correo: user.Correo || user.correo || "",
        Telefono: user.Telefono || ""
      });
      setPreviewImagen(user.Imagen_Perfil || "");
    }
  }, [user, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.Nombre_Usuario.trim()) {
      newErrors.Nombre_Usuario = "El nombre es requerido";
    }
    if (!formData.Correo.trim()) {
      newErrors.Correo = "El correo es requerido";
    }
    if (!formData.Telefono.trim()) {
      newErrors.Telefono = "El teléfono es requerido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onUpdateProfile(formData, imagen);
      setImagen(null);
      setPreviewImagen("");
      setErrors({});
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagen(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Perfil</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={4} className="text-center">
              <div className="mb-3">
                {previewImagen ? (
                  <img
                    src={getImageUrl(previewImagen)}
                    alt="Preview"
                    className="rounded-circle"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                  />
                ) : (
                  <IoPersonCircleOutline size={150} className="text-secondary" />
                )}
              </div>

              <Form.Group>
                <Form.Label className="btn btn-outline-primary cursor-pointer">
                  <IoCameraOutline className="me-2" />
                  Cambiar Foto
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImagenChange}
                    style={{ display: 'none' }}
                  />
                </Form.Label>
              </Form.Group>
            </Col>

            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  name="Nombre_Usuario"
                  value={formData.Nombre_Usuario}
                  onChange={handleChange}
                  isInvalid={!!errors.Nombre_Usuario}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.Nombre_Usuario}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Correo *</Form.Label>
                <Form.Control
                  type="email"
                  name="Correo"
                  value={formData.Correo}
                  onChange={handleChange}
                  isInvalid={!!errors.Correo}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.Correo}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Teléfono *</Form.Label>
                <Form.Control
                  type="tel"
                  name="Telefono"
                  value={formData.Telefono}
                  onChange={handleChange}
                  isInvalid={!!errors.Telefono}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.Telefono}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="warning" type="submit" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : "Guardar Cambios"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default function Profile() {
  const { user, logout, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [userProfile, setUserProfile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Cargar perfil completo del usuario
  const loadUserProfile = useCallback(async () => {
    if (!user) return null;

    try {
      setIsLoading(true);
      const response = await userApi.getCompleteProfile(user.id);
      setUserProfile(response.data);
      setError("");
      return response.data;
    } catch (err) {
      console.error("Error al cargar perfil:", err);
      setError("Error al cargar el perfil");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [loadUserProfile]);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleUpdateProfile = async (formData, imagen) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      console.log('Enviando datos al backend:', formData);
      console.log('ID del usuario:', user.id);
      console.log('¿Hay imagen?:', !!imagen);

      // 1. Primero actualizar los datos básicos
      const response = await userApi.updateProfile(user.id, {
        Nombre_Usuario: formData.Nombre_Usuario,
        Correo: formData.Correo,
        Telefono: formData.Telefono
      });

      console.log('Respuesta del backend (datos):', response.data);

      // 2. Si hay imagen, actualizarla por separado
      if (imagen) {
        console.log('Subiendo imagen...');
        try {
          const imageResponse = await userApi.updateProfileImage(user.id, imagen);
          console.log('Respuesta del backend (imagen):', imageResponse.data);
        } catch (imageError) {
          console.error('Error subiendo imagen:', imageError);
          // No lanzar error aquí para no interrumpir la actualización de datos
        }
      }

      // 3. Recargar perfil completo para obtener los últimos datos
      const profileData = await loadUserProfile();

      // 4. Actualizar el contexto global con los datos frescos del backend
      if (profileData) {
        updateUser({
          nombre: profileData.Nombre_Usuario,
          correo: profileData.Correo,
          Telefono: profileData.Telefono,
          Imagen_Perfil: profileData.Imagen_Perfil
        });
      }

      setSuccess("Perfil actualizado correctamente");
      setShowEditModal(false);

    } catch (err) {
      console.error("Error completo al actualizar perfil:", err);
      console.error("Respuesta del error:", err.response);

      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Error al actualizar el perfil";

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh", backgroundColor: "#fef5da" }}
      >
        <div className="spinner-border text-warning"></div>
      </div>
    );
  }

  const profileData = userProfile || user;
  const nombreUsuario = profileData.Nombre_Usuario || profileData.nombre;
  const imagenPerfil = profileData.Imagen_Perfil || user?.Imagen_Perfil || null;

  return (
    <div className="d-flex w-100 vh-100" style={{ backgroundColor: "#fef5da" }}>
      <Sidebar
        user={user}
        navigate={navigate}
        location={location}
        nombreUsuario={nombreUsuario}
        handleLogout={logout}
        imagenPerfil={imagenPerfil}
      />

      <div
        className="content-area flex-grow-1 d-flex flex-column bg-white"
        style={{ marginLeft: "250px", height: "100vh" }}
      >
        <Container fluid className="p-4 p-lg-5 flex-grow-1">
          <h1 className="fw-bold mb-3">Mi Perfil</h1>
          <p className="text-muted">Gestiona tu información personal.</p>

          {/* Alertas */}
          {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

          {isLoading && !userProfile ? (
            <div className="text-center">
              <Spinner animation="border" variant="warning" />
              <p className="mt-2 text-muted">Cargando perfil...</p>
            </div>
          ) : (
            /* Card perfil */
            <Card className="p-4 shadow-sm border-0">
              <Row>
                {/* Lado izquierdo: imagen y botón */}
                <Col
                  xs={12}
                  md={4}
                  className="d-flex flex-column align-items-center justify-content-center mb-4 mb-md-0"
                >
                  {profileData.Imagen_Perfil ? (
                    <img
                      src={getImageUrl(profileData.Imagen_Perfil)}
                      alt="Perfil"
                      className="rounded-circle mb-3"
                      style={{ width: "120px", height: "120px", objectFit: "cover" }}
                    />
                  ) : (
                    <IoPersonCircleOutline size={120} className="text-secondary mb-3" />
                  )}

                  <Button
                    variant="warning"
                    className="fw-bold px-4"
                    onClick={() => setShowEditModal(true)}
                  >
                    <IoPencilOutline className="me-2" />
                    Editar perfil
                  </Button>
                </Col>

                {/* Lado derecho: datos personales */}
                <Col xs={12} md={8}>
                  <h4 className="fw-bold mb-3">Datos Personales</h4>

                  <p>
                    <strong>Nombre:</strong> {nombreUsuario}
                  </p>
                  <p>
                    <strong>Correo:</strong> {profileData.Correo || profileData.correo}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {profileData.Telefono || "No especificado"}
                  </p>
                  <p>
                    <strong>ID:</strong> {user.id}
                  </p>
                  <p>
                    <strong>Fecha de Registro:</strong> {profileData.Fecha_Registro ?
                      new Date(profileData.Fecha_Registro).toLocaleDateString() : "No disponible"}
                  </p>
                  <p>
                    <strong>Estado:</strong> <span className="badge bg-success">{profileData.Estado || "Activo"}</span>
                  </p>
                </Col>
              </Row>
            </Card>
          )}
        </Container>

        {/* Modal para editar perfil */}
        <EditProfileModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          user={profileData}
          onUpdateProfile={handleUpdateProfile}
          isLoading={isLoading}
        />

        {/* FOOTER */}
        <footer
          className="text-center text-muted py-3 border-top"
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <small>
            &copy; {new Date().getFullYear()} QuackWallet. Todos los derechos reservados.
          </small>
        </footer>
      </div>
    </div>
  );
}