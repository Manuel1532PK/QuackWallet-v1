import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { userApi, getImageUrl } from "../api/userApi";
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

import logoSrc from "../assets/Logo_QuackWallet.png";

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

function Sidebar({ user, navigate, handleLogout, nombreUsuario, location, imagenPerfil }) {
    
    const menuLinks = [
        { name: "Inicio", path: "/home", icon: IoHomeOutline },
        { name: "Tarjetas", path: "/cards", icon: IoCardOutline }, 
        { name: "Perfil", path: "/profile", icon: IoPersonCircleOutline },
        { name: "Configuración", path: "/configuracion", icon: IoSettingsOutline },
    ];

    return (
        <div className="sidebar" style={{ 
            width: '280px', 
            minWidth: '280px', 
            height: '100vh', 
            position: 'fixed', 
            zIndex: 1000,
            left: 0, 
            top: 0,
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

            {/* Usuario */}
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
                <small style={{color: '#8899aa'}}>ID: {user?.id || 'No disponible'}</small>
            </div>

            {/* Menú */}
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
                
                {SECCIONES.map((seccion) => {
                    const isActive = location.pathname === seccion.path;
                    return (
                        <Nav.Link
                            key={seccion.path}
                            onClick={() => navigate(seccion.path)}
                            href={seccion.path}
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
                            <seccion.icon size={20} className="me-3" />
                            {seccion.title}
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

  const SIDEBAR_W = '280px';
  const nombreUsuario = userProfile?.Nombre_Usuario || user?.nombre || "Usuario";
  const imagenPerfil = userProfile?.Imagen_Perfil || user?.Imagen_Perfil || null; 
  const accentBgColor = '#fef5da';

  return (
    <div 
        className="d-flex w-100 vh-100 dashboard-wrapper" 
        style={{ backgroundColor: accentBgColor }} 
    > 
        <Sidebar 
            user={user} 
            navigate={navigate} 
            handleLogout={handleLogout} 
            nombreUsuario={nombreUsuario}
            location={location}
            imagenPerfil={imagenPerfil}
        />

        <div 
            className="content-area d-flex flex-column overflow-auto flex-grow-1 bg-white" 
            style={{ 
                marginLeft: SIDEBAR_W, 
                width: `calc(100% - ${SIDEBAR_W})`,
                height: '100vh',
            }} 
        >
            {/* Barra superior visible solo en móvil */}
            <div className="d-block d-lg-none p-3 border-bottom bg-white shadow-sm">
                <span className="fw-bolder text-dark">
                    <span className="text-warning me-2"></span>QuackWallet
                </span>
                <small className="ms-3 text-muted">Dashboard Móvil</small>
            </div>

            {/* Contenedor principal con espaciado ajustado */}
            <Container fluid className="p-4 p-lg-5 p-xl-6 flex-grow-1"> 
              <div className="mb-5 p-4" style={{ backgroundColor: '#f9d976', borderRadius: '16px' }}>
                <h1 className="display-5 fw-bold text-dark mb-1">
                  Bienvenido de nuevo, {nombreUsuario}!
                </h1>
                <p className="lead text-muted mb-0">
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
      
        <style>
          {`
            .card-hover {
              transition: all 0.3s ease;
            }
            .card-hover:hover {
              transform: translateY(-5px);
              box-shadow: 0 1rem 3rem rgba(0,0,0,.175) !important;
            }

            @media (max-width: 991.98px) {
              .sidebar {
                  display: none !important;
              }
              .content-area {
                  margin-left: 0 !important;
              }
              .dashboard-wrapper {
                  padding-top: 55px; 
              }
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