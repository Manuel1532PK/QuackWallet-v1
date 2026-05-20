import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { userApi, getImageUrl } from "../api/userApi";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
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
  IoLogoGooglePlaystore,
  IoCloudDownloadOutline,
} from "react-icons/io5";

import logoSrc from "../assets/Logo_QuackWallet.png";

const SECCIONES = [
  { title: "Seguridad", icon: IoShieldCheckmarkOutline, path: "/security" },
  { title: "Consultas", icon: IoAnalyticsOutline, path: "/reports" },
  { title: "Novedades", icon: IoBulbOutline, path: "/news" },
  { title: "Conexiones", icon: IoPeopleOutline, path: "/connections" },
];

const linkStyle = (isActive) => ({
  display: "flex",
  alignItems: "center",
  color: isActive ? "#0b1e3d" : "#c0c8d4",
  backgroundColor: isActive ? "#f4b942" : "transparent",
  borderRadius: "8px",
  marginBottom: "4px",
  padding: "8px 12px",
  fontWeight: isActive ? "700" : "400",
  textDecoration: "none",
  cursor: "pointer",
  transition: "all 0.2s ease",
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
      width: "280px", minWidth: "280px", height: "100vh",
      position: "fixed", left: 0, top: 0, zIndex: 1000,
      backgroundColor: "#0b1e3d", display: "flex", flexDirection: "column",
      overflowY: "auto", overflowX: "hidden",
      scrollbarWidth: "thin", scrollbarColor: "#f4b942 #0b1e3d",
    }}>
      <div style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <img src={logoSrc} alt="QuackWallet" style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover", marginRight: "10px" }} />
        <div>
          <span style={{ color: "#f4b942", fontSize: "20px", fontWeight: "700" }}>Quack</span>
          <span style={{ color: "#ffffff", fontSize: "20px", fontWeight: "300" }}>Wallet</span>
        </div>
      </div>

      <div className="p-3 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        {imagenPerfil ? (
          <img src={getImageUrl(imagenPerfil)} alt="Perfil" className="rounded-circle mb-1"
            style={{ width: "40px", height: "40px", objectFit: "cover" }} />
        ) : (
          <IoPersonCircleOutline size={30} style={{ color: "#8899aa" }} />
        )}
        <p className="mb-0 fw-bold" style={{ color: "#ffffff" }}>{nombreUsuario}</p>
        <small style={{ color: "#8899aa" }}>ID: {user?.id}</small>
      </div>

      <Nav className="flex-column p-3 flex-grow-1">
        {menuLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Nav.Link key={link.path} onClick={() => navigate(link.path)}
              style={linkStyle(isActive)}
              onMouseEnter={(e) => { if (!isActive) { e.target.style.backgroundColor = "rgba(255,255,255,0.1)"; e.target.style.color = "#ffffff"; } }}
              onMouseLeave={(e) => { if (!isActive) { e.target.style.backgroundColor = "transparent"; e.target.style.color = "#c0c8d4"; } }}>
              <link.icon size={20} className="me-3" />
              {link.name}
            </Nav.Link>
          );
        })}

        <hr style={{ borderColor: "rgba(255,255,255,0.1)", margin: "12px 0" }} />
        <h6 className="px-3 mt-2 mb-2 small fw-bold text-uppercase" style={{ color: "#8899aa" }}>Funciones rápidas</h6>

        {SECCIONES.map((sec) => {
          const isActive = location.pathname === sec.path;
          return (
            <Nav.Link key={sec.path} onClick={() => navigate(sec.path)}
              style={linkStyle(isActive)}
              onMouseEnter={(e) => { if (!isActive) { e.target.style.backgroundColor = "rgba(255,255,255,0.1)"; e.target.style.color = "#ffffff"; } }}
              onMouseLeave={(e) => { if (!isActive) { e.target.style.backgroundColor = "transparent"; e.target.style.color = "#c0c8d4"; } }}>
              <sec.icon size={20} className="me-3" />
              {sec.title}
            </Nav.Link>
          );
        })}
      </Nav>

      <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <button onClick={handleLogout} style={{
          width: "100%", padding: "10px", backgroundColor: "#f4b942",
          border: "none", borderRadius: "8px", color: "#0b1e3d",
          fontWeight: "700", display: "flex", alignItems: "center",
          justifyContent: "center", cursor: "pointer", fontSize: "16px",
        }}>
          <IoLogOutOutline className="me-2" size={20} /> Cerrar Sesión
        </button>
      </div>
      <style>{`
        .sidebar::-webkit-scrollbar { width: 6px; }
        .sidebar::-webkit-scrollbar-track { background: #0b1e3d; }
        .sidebar::-webkit-scrollbar-thumb { background: #f4b942; border-radius: 3px; }
        .sidebar::-webkit-scrollbar-thumb:hover { background: #d4a017; }
      `}</style>
    </div>
  );
}

const PAGE_CONFIG = {
  "/configuracion": {
    title: "Configuración",
    description: "Ajusta las preferencias de tu cuenta.",
  },
  "/security": {
    title: "Seguridad",
    description: "Protege tu cuenta y tus tarjetas.",
  },
  "/news": {
    title: "Novedades",
    description: "Enterate de las últimas actualizaciones.",
  },
  "/connections": {
    title: "Conexiones",
    description: "Administra tus conexiones y vinculaciones.",
  },
};

function SecurityContent() {
  return (
    <div className="d-flex justify-content-center">
      <div className="coming-soon-card p-4 d-flex flex-column align-items-center justify-content-center text-center"
        style={{ backgroundColor: "#f9d976", borderRadius: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", minHeight: "200px", maxWidth: "400px", width: "100%" }}>
        <IoLogoGooglePlaystore size={48} className="mb-3" />
        <h5 className="fw-bold mb-2">Uso de App Móvil</h5>
        <p className="mb-0 text-muted small">Próximamente</p>
      </div>
    </div>
  );
}

function ConnectionsContent() {
  const items = [
    { title: "Conexiones", desc: "Próximamente" },
    { title: "Conexiones", desc: "Próximamente" },
    { title: "Conexiones", desc: "Próximamente" },
  ];
  return (
    <Row className="g-4">
      {items.map((item, i) => (
        <Col key={i} xs={12} md={6} lg={4}>
          <div className="coming-soon-card p-4 d-flex flex-column align-items-center justify-content-center text-center"
            style={{ backgroundColor: "#f9d976", borderRadius: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", minHeight: "180px" }}>
            <IoPeopleOutline size={48} className="mb-3 text-dark" />
            <h5 className="fw-bold mb-1">{item.title}</h5>
            <p className="mb-0 text-muted small">{item.desc}</p>
          </div>
        </Col>
      ))}
    </Row>
  );
}

export default function ComingSoon() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState(null);

  const loadUserProfile = useCallback(async () => {
    if (!user) return;
    try {
      const response = await userApi.getCompleteProfile(user.id);
      setUserProfile(response.data);
    } catch (err) {
      console.error("Error al cargar perfil:", err);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadUserProfile();
  }, [loadUserProfile]);

  useEffect(() => {
    if (user === null) navigate("/login");
  }, [user, navigate]);

  const handleLogout = () => {
    if (logout) logout();
    navigate("/login");
  };

  if (user === null) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", backgroundColor: "#fef5da" }}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  const nombreUsuario = userProfile?.Nombre_Usuario || user?.nombre || "Usuario";
  const imagenPerfil = userProfile?.Imagen_Perfil || user?.Imagen_Perfil || null;
  const config = PAGE_CONFIG[location.pathname] || { title: "", description: "" };

  return (
    <div className="d-flex w-100 vh-100" style={{ backgroundColor: "#ffffff" }}>
      <Sidebar user={user} navigate={navigate} handleLogout={handleLogout}
        nombreUsuario={nombreUsuario} location={location} imagenPerfil={imagenPerfil} />

      <div className="content-area flex-grow-1 d-flex flex-column bg-white"
        style={{ marginLeft: "280px", height: "100vh" }}>
        <div className="d-block d-lg-none p-3 border-bottom bg-white shadow-sm">
          <span className="fw-bolder text-dark">
            <span className="text-warning me-2"></span>QuackWallet
          </span>
          <small className="ms-3 text-muted">Dashboard Móvil</small>
        </div>

        <Container fluid className="p-4 p-lg-5 flex-grow-1">
          <div className="mb-5 p-4" style={{ backgroundColor: "#f9d976", borderRadius: "16px" }}>
            <h1 className="fw-bold mb-1">{config.title}</h1>
            <p className="text-muted mb-0">{config.description}</p>
          </div>

          {location.pathname === "/security" && <SecurityContent />}
          {location.pathname === "/connections" && <ConnectionsContent />}
          {location.pathname !== "/security" && location.pathname !== "/connections" && (
            <div className="text-center mt-5 pt-5">
              <h3 className="fw-bold text-dark mb-2">Próximamente</h3>
              <p className="text-muted">Estamos trabajando en esta funcionalidad.</p>
            </div>
          )}
        </Container>

        <style>{`
          .coming-soon-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .coming-soon-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
          }
          @media (max-width: 991.98px) {
            .sidebar { display: none !important; }
            .content-area { margin-left: 0 !important; }
            .d-block.d-lg-none { position: fixed; top: 0; left: 0; right: 0; z-index: 999; }
          }
        `}</style>

        <div className="mt-auto p-3 text-center text-muted border-top" style={{ backgroundColor: "#f8f9fa" }}>
          <small>&copy; {new Date().getFullYear()} QuackWallet. Todos los derechos reservados.</small>
        </div>
      </div>
    </div>
  );
}
