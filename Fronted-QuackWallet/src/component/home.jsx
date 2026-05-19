import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { userApi } from "../api/userApi";
// Importaciones de React-Bootstrap
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

// Importación de Iconos de React-Icons (usando el set Io5)
import { 
  IoCardOutline, 
  IoShieldCheckmarkOutline, 
  IoAnalyticsOutline, 
  IoBulbOutline, 
  IoPersonCircleOutline, 
  IoLogOutOutline, 
  IoSettingsOutline,
  IoHomeOutline,
  IoPeopleOutline 
} from 'react-icons/io5';

// Definición de las secciones/tarjetas principales
// Usando colores de Bootstrap para los estilos de íconos y botones
const SECCIONES = [
  {
    title: "Seguridad",
    text: "Configuración de PIN, proteccion mas avanzada de tus tarjetas.",
    icon: IoShieldCheckmarkOutline,
    color: "success",
    path: "/security"
  },
  {
    title: "Consultas",
    text: "Aca puedes revisar los movimientos recientes de tus tarjetas y cuentas.",
    icon: IoAnalyticsOutline,
    color: "info",
    path: "/reports"
  },
  {
    title: "Novedades",
    text: "Descubre las últimas funcionalidades y las actualizaciones de QuackWallet.",
    icon: IoBulbOutline,
    color: "warning",
    path: "/news"
  },
  {
    title: "Conexiones",
    text: "Nuestros aliados y socios de QuackWallet.",
    icon: IoPeopleOutline,
    color: "primary",
    path: "/connections"
  }
];

/**
 * Componente que representa la barra de navegación lateral (Sidebar).
 * @param {object} props - Propiedades del componente.
 */
function Sidebar({ user, navigate, handleLogout, nombreUsuario, location, imagenPerfil }) {
    
    // Lista de enlaces principales del menú lateral con RUTAS CORREGIDAS
    const menuLinks = [
        { name: "Inicio", path: "/home", icon: IoHomeOutline },
        { name: "Tarjetas", path: "/cards", icon: IoCardOutline }, 
        { name: "Perfil", path: "/profile", icon: IoPersonCircleOutline },
        { name: "Configuración", path: "/configuracion", icon: IoSettingsOutline },
    ];
    
    // Clase de Bootstrap para el acento de enlace activo (el borde)
    const activeBorderColor = 'border-warning'; 

    return (
        // Sidebar con fondo blanco (bg-white) - Revertido del color fijo
        <div 
            className={`sidebar d-flex flex-column bg-white border-end shadow-lg`} 
            style={{ 
                width: '250px', 
                minWidth: '250px', 
                height: '100vh', 
                position: 'fixed', 
                zIndex: 1000,
                left: 0, 
                top: 0,
            }}
        >
            {/* Logo/Marca: Fondo blanco, texto oscuro */}
            <div className="p-4 border-bottom d-flex align-items-center justify-content-center" style={{height: '80px'}}>
                <span className="fw-bolder fs-3 text-dark text-decoration-none">
                    <span className="text-warning me-1"></span>Quack<span className="fw-normal">Wallet</span>
                </span>
            </div>
            
            {/* Información del Usuario: Fondo gris claro, texto oscuro */}
            <div className="p-3 text-center border-bottom" style={{backgroundColor: '#f8f9fa'}}>
                {imagenPerfil ? (
                  <img
                    src={imagenPerfil}
                    alt="Perfil"
                    className="rounded-circle mb-1"
                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                  />
                ) : (
                  <IoPersonCircleOutline size={30} className="text-secondary mb-1" />
                )}
                <p className="mb-0 fw-bold fs-6 text-dark">{nombreUsuario}</p>
                <small className="text-muted">ID: {user?.id || 'No disponible'}</small>
            </div>

            {/* Enlaces Principales del Menú */}
            <Nav className="flex-column p-3 flex-grow-1" activeKey={location.pathname}>
                {menuLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Nav.Link 
                            key={link.path} 
                            onClick={() => navigate(link.path)} 
                            href={link.path}
                            // Estilo de enlace activo/inactivo (revertido a sutil)
                            className={`d-flex align-items-center mb-1 rounded py-2 ${
                                isActive 
                                    ? `bg-warning-subtle text-dark fw-bold border-start border-4 ${activeBorderColor}` // Activo: fondo sutil, texto oscuro
                                    : 'text-dark-50 hover-link-sidebar' // Inactivo: texto atenuado, hover sutil
                            }`}
                        >
                            <link.icon className="me-3" size={20} />
                            {link.name}
                        </Nav.Link>
                    );
                })}

                {/* Separador */}
                <hr className="my-3"/>
                
                {/* Título de Funciones */}
                <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase small fw-bold">
                    <span>Funciones Rápidas</span>
                </h6>
                
                {/* Enlaces de Funcionalidad Adicional */}
                {SECCIONES.map((seccion) => {
                    const isActive = location.pathname === seccion.path;
                    return (
                        <Nav.Link
                            key={seccion.path}
                            onClick={() => navigate(seccion.path)}
                            href={seccion.path}
                            // Estilo de enlace activo/inactivo (revertido a sutil)
                            className={`d-flex align-items-center mb-1 rounded py-2 ${
                                isActive 
                                    ? `bg-warning-subtle text-dark fw-bold border-start border-4 ${activeBorderColor}`
                                    : 'text-dark-50 hover-link-sidebar'
                            }`}
                        >
                            <seccion.icon className="me-3" size={20} />
                            {seccion.title}
                        </Nav.Link>
                    );
                })}
            </Nav>

            {/* Footer del Sidebar: Botón de Salir */}
            <div className="p-3 border-top">
                <Button 
                    variant="danger" 
                    onClick={handleLogout} 
                    className="w-100 d-flex align-items-center justify-content-center"
                >
                    <IoLogOutOutline className="me-2" size={20} /> Cerrar Sesión
                </Button>
            </div>
        </div>
    );
}


export default function Home() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState(null);

  // Cargar perfil completo desde el backend
  const loadUserProfile = useCallback(async () => {
    if (!user) return;
    try {
      const response = await userApi.getCompleteProfile(user.id);
      setUserProfile(response.data);
    } catch (err) {
      console.error("Error al cargar perfil en Home:", err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [loadUserProfile]);

  // Lógica de protección: Redirigir a login si no hay usuario
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Manejador de cierre de sesión
  const handleLogout = () => {
    if (logout) {
      logout();
    }
    navigate("/login");
  };

  // Prevenir la renderización si el usuario aún no se ha verificado
  if (user === null) {
    const mainBgColor = '#fef5da'; 
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: mainBgColor }}>
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );
  }

  const nombreUsuario = userProfile?.Nombre_Usuario || user?.nombre || "Usuario";
  const imagenPerfil = userProfile?.Imagen_Perfil || user?.Imagen_Perfil || null; 
  const sidebarWidth = '250px';
  const accentBgColor = '#fef5da'; // Color de acento para el fondo general (QuackWallet color)

  return (
    // Wrapper principal: Ocupa todo el viewport, con el color de acento
    <div 
        className="d-flex w-100 vh-100 dashboard-wrapper" 
        style={{ backgroundColor: accentBgColor }} 
    > 
        {/* Sidebar Fijo (bg-white) */}
        <Sidebar 
            user={user} 
            navigate={navigate} 
            handleLogout={handleLogout} 
            nombreUsuario={nombreUsuario}
            location={location}
            imagenPerfil={imagenPerfil}
        />

        {/* ---------------------------------------------------- */}
        {/* Contenido Principal (Main) - Empujado por el Sidebar */}
        {/* ---------------------------------------------------- */}
        <div 
            className="content-area d-flex flex-column overflow-auto flex-grow-1 bg-white" 
            style={{ 
                marginLeft: sidebarWidth, 
                width: `calc(100% - ${sidebarWidth})`,
                height: '100vh',
            }} 
        >
            {/* Barra superior visible solo en móvil (Bootstrap d-block d-lg-none) */}
            <div className="d-block d-lg-none p-3 border-bottom bg-white shadow-sm">
                <span className="fw-bolder text-dark">
                    <span className="text-warning me-2"></span>QuackWallet
                </span>
                <small className="ms-3 text-muted">Dashboard Móvil</small>
            </div>

            {/* Contenedor principal con espaciado ajustado */}
            <Container fluid className="p-4 p-lg-5 p-xl-6 flex-grow-1"> 
              <div className="mb-5">
                <h1 className="display-5 fw-bold text-dark mb-1">
                  Bienvenido de nuevo, {nombreUsuario}!
                </h1>
                <p className="lead text-muted">
                  Aca puedes revisar y gestionar todas las funcionalidades de tu QuackWallet.
                </p>
              </div>

              {/* Secciones y Tarjetas de Funcionalidades */}
              <Row xs={1} md={2} lg={3} className="g-4"> 
                {SECCIONES.map((seccion, index) => (
                  <Col key={index}>
                    <Card 
                      // Fondo blanco y estilos hover (Revertido de color fijo)
                      className={`h-100 shadow-sm border-0 bg-white p-3 card-hover`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(seccion.path)}
                    >
                      <Card.Body className="d-flex flex-column align-items-center text-center">
                        {/* El color de la sección solo afecta al ícono */}
                        <seccion.icon size={50} className={`text-${seccion.color} mb-3`} /> 
                        <Card.Title className="fw-bold text-dark">{seccion.title}</Card.Title>
                        <Card.Text className="text-muted">
                          {seccion.text}
                        </Card.Text>
                        {/* El color de la sección solo afecta al botón de contorno */}
                        <Button 
                            variant={`outline-${seccion.color}`} 
                            size="sm" 
                            className="mt-auto"
                        >
                          Ir a {seccion.title}
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>

            {/* Footer con un fondo ligeramente diferente para separación visual */}
            <div className="mt-auto p-3 text-center text-muted border-top" style={{ backgroundColor: '#f8f9fa' }}>
                <small>&copy; {new Date().getFullYear()} QuackWallet. Todos los derechos reservados.</small>
            </div>
        </div>
      
        {/* Estilos CSS personalizados para el hover y responsividad */}
        <style global jsx>
          {`
            /* Estilo del link al pasar el ratón en el Sidebar (fondo blanco) */
            .hover-link-sidebar:hover {
                background-color: #f0f0f0 !important; 
                color: #000 !important;
            }

            /* Estilo de la tarjeta */
            .card-hover {
              transition: all 0.3s ease;
            }
            .card-hover:hover {
              transform: translateY(-5px);
              box-shadow: 0 1rem 3rem rgba(0,0,0,.175) !important;
            }
            
            /* RESPONSIVIDAD: Ocultar el Sidebar en pantallas pequeñas (<992px) */
            @media (max-width: 991.98px) {
              .sidebar {
                  display: none !important; /* Oculta el sidebar fijo */
              }
              /* Ajusta el contenido principal para que no tenga margen izquierdo */
              .content-area {
                  margin-left: 0 !important;
              }
              /* Añade un padding superior para compensar la barra móvil */
              .dashboard-wrapper {
                  padding-top: 55px; 
              }
              /* Fija la barra superior móvil para que no se desplace */
              .d-block.d-lg-none {
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  z-index: 999;
              }
            }
          `}
        </style>
    </div>
  );
}