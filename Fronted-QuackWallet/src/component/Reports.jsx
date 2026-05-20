import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { userApi, getImageUrl } from "../api/userApi";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
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
  IoWalletOutline,
  IoArrowUpOutline,
  IoArrowDownOutline,
} from "react-icons/io5";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import axios from "axios";
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

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const PIE_COLORS = ["#0b1e3d","#f4b942","#2d6a4f","#b71c1c","#1565c0","#e65100","#6a1b9a","#00838f"];

function formatMonth(key) {
  const [, mm] = (key || "").split("-");
  return MONTHS[parseInt(mm) - 1] || key;
}

export default function Reports() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState(null);
  const [cardsTotal, setCardsTotal] = useState(0);
  const [cardsBreakdown, setCardsBreakdown] = useState([]);
  const [cardsCount, setCardsCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = 'http://localhost:3000/api';

  const loadData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [profileRes, reportRes] = await Promise.all([
        userApi.getCompleteProfile(user.id),
        axios.get(`${API_URL}/reports/${user.id}`),
      ]);
      setUserProfile(profileRes.data);
      setCardsTotal(reportRes.data.cardsTotal || 0);
      setCardsCount(reportRes.data.cardsCount || 0);
      setCardsBreakdown(reportRes.data.cardsBreakdown || []);
      setTransactions(reportRes.data.monthlyData || []);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("Error al cargar los datos de consultas");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => { if (user === null) navigate("/login"); }, [user, navigate]);

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
  const totalIngresos = transactions.reduce((s, t) => s + (t.ingresos || 0), 0);
  const totalGastos = transactions.reduce((s, t) => s + (t.gastos || 0), 0);
  const chartData = transactions.map(t => ({ ...t, mes: formatMonth(t.mes) }));

  const statCards = [
    { title: "Saldo Total", value: `$${Number(cardsTotal).toLocaleString()}`, icon: IoWalletOutline, color: "#0b1e3d" },
    { title: "Ingresos", value: `$${totalIngresos.toLocaleString()}`, icon: IoArrowUpOutline, color: "#2d6a4f" },
    { title: "Gastos", value: `$${totalGastos.toLocaleString()}`, icon: IoArrowDownOutline, color: "#b71c1c" },
    { title: "Tarjetas", value: cardsCount, icon: IoCardOutline, color: "#f4b942" },
  ];

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
            <h1 className="fw-bold mb-1">Consultas</h1>
            <p className="text-muted mb-0">Resumen de tus finanzas.</p>
          </div>

          {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}

          {isLoading ? (
            <div className="text-center mt-5">
              <Spinner animation="border" variant="warning" />
              <p className="mt-2 text-muted">Cargando datos...</p>
            </div>
          ) : (
            <>
              <Row className="g-4 mb-5">
                {statCards.map((card, i) => (
                  <Col xs={12} sm={6} lg={3} key={i}>
                    <div className="stat-card p-4 d-flex align-items-center"
                      style={{ backgroundColor: "#fef5da", borderRadius: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                      <div className="me-3 p-3 rounded-circle" style={{ backgroundColor: `${card.color}15` }}>
                        <card.icon size={28} style={{ color: card.color }} />
                      </div>
                      <div>
                        <p className="text-muted small mb-0">{card.title}</p>
                        <h4 className="fw-bold mb-0">{card.value}</h4>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>

              {cardsBreakdown.length > 0 && (
                <Row className="g-4 mb-5">
                  <Col xs={12} md={6}>
                    <div className="p-4" style={{ backgroundColor: "#fef5da", borderRadius: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                      <h5 className="fw-bold mb-4">Distribución por Tarjeta</h5>
                      <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                          <Pie data={cardsBreakdown} dataKey="saldo" nameKey="nombre" cx="50%" cy="50%" outerRadius={90} innerRadius={40} label={({ nombre, porcentaje }) => `${nombre} ${porcentaje}%`}>
                            {cardsBreakdown.map((_, i) => (
                              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(val) => `$${Number(val).toLocaleString()}`} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mt-3">
                        {cardsBreakdown.map((c, i) => (
                          <div key={i} className="d-flex justify-content-between align-items-center mb-1 small">
                            <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: PIE_COLORS[i % PIE_COLORS.length], marginRight: 6 }}></span>{c.nombre} (**** {c.lastFour})</span>
                            <span className="fw-bold">${Number(c.saldo).toLocaleString()} ({c.porcentaje}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Col>

                  <Col xs={12} md={6}>
                    <div className="p-4" style={{ backgroundColor: "#fef5da", borderRadius: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                      <h5 className="fw-bold mb-4">Análisis de Saldo</h5>
                      {cardsBreakdown.map((c, i) => (
                        <div key={i} className="mb-3">
                          <div className="d-flex justify-content-between small mb-1">
                            <span className="fw-bold">{c.nombre}</span>
                            <span>${Number(c.saldo).toLocaleString()} — {c.porcentaje}%</span>
                          </div>
                          <div style={{ height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ width: `${c.porcentaje}%`, height: '100%', backgroundColor: PIE_COLORS[i % PIE_COLORS.length], borderRadius: 4, transition: 'width 0.5s ease' }}></div>
                          </div>
                        </div>
                      ))}
                      <div className="border-top pt-2 mt-2 d-flex justify-content-between fw-bold">
                        <span>Total</span>
                        <span>${Number(cardsTotal).toLocaleString()}</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              )}

              {chartData.length > 0 && (
                <div className="p-4" style={{ backgroundColor: "#fef5da", borderRadius: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                  <h5 className="fw-bold mb-4">Movimientos Mensuales</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="mes" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip />
                      <Line type="monotone" dataKey="ingresos" stroke="#2d6a4f" strokeWidth={2} name="Ingresos" />
                      <Line type="monotone" dataKey="gastos" stroke="#b71c1c" strokeWidth={2} name="Gastos" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </Container>

        <style>{`
          .stat-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .stat-card:hover {
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
