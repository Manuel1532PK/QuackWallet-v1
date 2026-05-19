import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Bootstrap
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
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

import logoSrc from "../../assets/Logo_QuackWallet.png";

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

  const linkStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    color: isActive ? '#0b1e3d' : '#c0c8d4',
    backgroundColor: isActive ? '#f4b942' : 'transparent',
    borderRadius: '8px',
    marginBottom: '4px',
    padding: '8px 12px',
    fontWeight: isActive ? '700' : '400',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  });

  return (
    <div className="sidebar" style={{ 
      width: '280px', 
      minWidth: '280px', 
      height: '100vh', 
      position: 'fixed', 
      left: 0, 
      top: 0, 
      zIndex: 1000,
      backgroundColor: '#0b1e3d',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      {/* Header con logo */}
      <div style={{ 
        display: 'flex', alignItems: 'center', 
        padding: '14px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <img src={logoSrc} alt="QuackWallet" style={{ height: '38px', marginRight: '10px' }} />
        <div>
          <span style={{ color: '#f4b942', fontSize: '20px', fontWeight: '700' }}>Quack</span>
          <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: '300' }}>Wallet</span>
        </div>
      </div>

      {/* User */}
      <div className="p-3 text-center" style={{borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
        {imagenPerfil ? (
          <img
            src={getImageUrl(imagenPerfil)}
            alt="Perfil"
            className="rounded-circle mb-1"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
        ) : (
          <IoPersonCircleOutline size={30} style={{color: '#8899aa'}} />
        )}
        <p className="mb-0 fw-bold" style={{color: '#ffffff'}}>{nombreUsuario}</p>
        <small style={{color: '#8899aa'}}>
          ID: {user?.id || "No disponible"}
        </small>
      </div>

      <Nav className="flex-column p-3 flex-grow-1">
        {menuLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Nav.Link
              key={link.path}
              onClick={() => navigate(link.path)}
              href={link.path}
              style={linkStyle(isActive)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.target.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#c0c8d4';
                }
              }}
            >
              <link.icon size={20} className="me-3" />
              {link.name}
            </Nav.Link>
          );
        })}

        <hr style={{borderColor: 'rgba(255,255,255,0.1)', margin: '12px 0'}} />

        <h6 className="px-3 mt-2 mb-2 small fw-bold text-uppercase" style={{color: '#8899aa'}}>
          Funciones rápidas
        </h6>

        {SECCIONES.map((sec) => {
          const isActive = location.pathname === sec.path;
          return (
            <Nav.Link
              key={sec.path}
              onClick={() => navigate(sec.path)}
              href={sec.path}
              style={linkStyle(isActive)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.target.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#c0c8d4';
                }
              }}
            >
              <sec.icon size={20} className="me-3" />
              {sec.title}
            </Nav.Link>
          );
        })}
      </Nav>

      {/* Cerrar sesión */}
      <div className="p-3" style={{borderTop: '1px solid rgba(255,255,255,0.1)'}}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#f4b942',
            border: 'none',
            borderRadius: '8px',
            color: '#0b1e3d',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          <IoLogOutOutline className="me-2" size={20} /> Cerrar Sesión
        </button>
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
        style={{ marginLeft: "280px", height: "100vh" }}
      >
        <Container fluid className="p-4 p-lg-5 flex-grow-1">
          {/* Titulo en cuadro amarillo fuerte */}
          <div className="mb-5 p-4" style={{ backgroundColor: '#f9d976', borderRadius: '16px' }}>
            <h1 className="fw-bold mb-1">Mi Perfil</h1>
            <p className="text-muted mb-0">Gestiona tu información personal.</p>
          </div>

          {/* Alertas */}
          {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

          {isLoading && !userProfile ? (
            <div className="text-center">
              <Spinner animation="border" variant="warning" />
              <p className="mt-2 text-muted">Cargando perfil...</p>
            </div>
          ) : (
            <Row className="g-4">
              {/* Editar Perfil */}
              <Col xs={12} md={5}>
                <div className="profile-data-box p-4" style={{ backgroundColor: '#f9d976', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
                  <h5 className="fw-bold mb-4 text-center">Editar Perfil</h5>
                  <div className="d-flex flex-column align-items-center">
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
                  </div>
                </div>
              </Col>

              {/* Datos del Perfil */}
              <Col xs={12} md={7}>
                <div className="profile-data-box p-4" style={{ backgroundColor: '#f9d976', borderRadius: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
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
                </div>
              </Col>
            </Row>
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

        <style>{`
          .profile-data-box {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .profile-data-box:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          }
        `}</style>
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