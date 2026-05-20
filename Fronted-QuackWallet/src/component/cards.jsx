import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
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
  IoTrashOutline,
  IoAddOutline,
  IoArrowBackOutline,
} from "react-icons/io5";

// API
import { cardApi } from "../api/cardApi";
import { userApi, getImageUrl } from "../api/userApi";

import logoSrc from "../assets/Logo_QuackWallet.png";

const CARD_COLORS = [
  { bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', text: '#ffffff', chip: '#f4b942' },
  { bg: 'linear-gradient(135deg, #6c3483 0%, #8e44ad 50%, #bb8fce 100%)', text: '#ffffff', chip: '#f4b942' },
  { bg: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)', text: '#ffffff', chip: '#f4b942' },
  { bg: 'linear-gradient(135deg, #7f0000 0%, #b71c1c 50%, #e53935 100%)', text: '#ffffff', chip: '#f4b942' },
  { bg: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)', text: '#ffffff', chip: '#f4b942' },
  { bg: 'linear-gradient(135deg, #e65100 0%, #ef6c00 50%, #f57c00 100%)', text: '#ffffff', chip: '#f4b942' },
  { bg: 'linear-gradient(135deg, #004d40 0%, #00695c 50%, #00796b 100%)', text: '#ffffff', chip: '#f4b942' },
  { bg: 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 50%, #8e24aa 100%)', text: '#ffffff', chip: '#f4b942' },
];

const GRAY_CARD = { bg: 'linear-gradient(135deg, #555 0%, #777 50%, #999 100%)', text: '#ddd', chip: '#aaa' };

function CreditCardView({ card, onClick, style, inactive, actionLabel, onAction }) {
  const colorIndex = card.ID_Tarjetas ? card.ID_Tarjetas % CARD_COLORS.length : 0;
  const colors = inactive ? GRAY_CARD : CARD_COLORS[colorIndex];
  const lastFour = card.Numero ? card.Numero.slice(-4) : '****';

  return (
    <div
      onClick={onClick}
      style={{
        width: '100%',
        aspectRatio: '1.586 / 1',
        borderRadius: '16px',
        background: colors.bg,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
        }
      }}
    >
      {/* Chip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: '45px', height: '34px',
          borderRadius: '6px',
          background: `linear-gradient(135deg, ${colors.chip}, #d4a017)`,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'rgba(255,255,255,0.15)', clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
        </div>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: colors.text, fontSize: '11px', fontWeight: '700', padding: '2px 10px', borderRadius: '10px', letterSpacing: '0.5px', textAlign: 'center' }}>{card.Tipo_tarjeta || 'Tarjeta'}<br /><span style={{ fontSize: '10px', fontWeight: '400', opacity: 0.8 }}>{card.Nombre}</span></div>
      </div>

      {/* Número */}
      <div style={{ color: colors.text, fontSize: '22px', letterSpacing: '3px', fontWeight: '500', fontFamily: 'monospace', textAlign: 'center', marginTop: '8px' }}>
        **** **** **** {lastFour}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ color: colors.text, fontSize: '10px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Titular</div>
          <div style={{ color: colors.text, fontSize: '15px', fontWeight: '600' }}>{card.Nombre}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: colors.text, fontSize: '10px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Saldo</div>
          <div style={{ color: colors.text, fontSize: '16px', fontWeight: '700' }}>${card.Saldo ? Number(card.Saldo).toLocaleString() : '0.00'}</div>
        </div>
      </div>
      {actionLabel && onAction && (
        <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 48px)' }}>
          <button onClick={(e) => { e.stopPropagation(); onAction(card.ID_Tarjetas); }} style={{ width: '100%', padding: '8px', backgroundColor: '#f4b942', border: 'none', borderRadius: '8px', color: '#0b1e3d', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}

// Sidebar + secciones
const SECCIONES = [
  { title: "Seguridad", icon: IoShieldCheckmarkOutline, path: "/security" },
  { title: "Consultas", icon: IoAnalyticsOutline, path: "/reports" },
  { title: "Novedades", icon: IoBulbOutline, path: "/news" },
  { title: "Conexiones", icon: IoPeopleOutline, path: "/connections" },
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
      scrollbarWidth: 'thin',
      scrollbarColor: '#f4b942 #0b1e3d',
    }}>
      {/* Header con logo */}
      <div style={{ 
        display: 'flex', alignItems: 'center', 
        padding: '14px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <img src={logoSrc} alt="QuackWallet" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', marginRight: '10px' }} />
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
        <small style={{color: '#8899aa'}}>ID: {user?.id}</small>
      </div>

      <Nav className="flex-column p-3 flex-grow-1">
        {menuLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Nav.Link
              key={link.path}
              onClick={() => navigate(link.path)}
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

        <h6 className="px-3 mt-2 mb-2 small fw-bold text-uppercase" style={{color: '#8899aa'}}>Funciones rápidas</h6>

        {SECCIONES.map((sec) => {
          const isActive = location.pathname === sec.path;
          return (
            <Nav.Link
              key={sec.path}
              onClick={() => navigate(sec.path)}
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
      <style>{`
        .sidebar::-webkit-scrollbar { width: 6px; }
        .sidebar::-webkit-scrollbar-track { background: #0b1e3d; }
        .sidebar::-webkit-scrollbar-thumb { background: #f4b942; border-radius: 3px; }
        .sidebar::-webkit-scrollbar-thumb:hover { background: #d4a017; }
      `}</style>
    </div>
  );
}

// Modal para agregar tarjeta
function AddCardModal({ show, onHide, onAddCard, isLoading }) {
  const [formData, setFormData] = useState({
    Nombre: "",
    Tipo_tarjeta:"",
    Banco: "",
    Numero: "",
    Saldo: ""
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.Nombre.trim()) {
      newErrors.Nombre = "Ingresa un nombre para la tarjeta";
    }
    if (!formData.Tipo_tarjeta.trim()) {
      newErrors.Tipo_tarjeta = "Selecciona el tipo de tarjeta";
    }
    if (!formData.Banco.trim()) {
      newErrors.Banco = "Ingresa el nombre del banco";
    }
    if (!formData.Numero.trim() || formData.Numero.length !== 16) {
      newErrors.Numero = "El número de tarjeta debe tener 16 dígitos";
    }
    if (!formData.Saldo || parseFloat(formData.Saldo) < 0) {
      newErrors.Saldo = "Ingresa un saldo válido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAddCard({
      ...formData,
      Saldo: parseFloat(formData.Saldo)
    });
    setFormData({ 
      Nombre: "", 
      Tipo_tarjeta: "", 
      Banco: "", 
      Numero: "", 
      Saldo: "" 
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "Numero") {
      const numericValue = value.replace(/\D/g, '').slice(0, 16);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else if (name === "Saldo") {
      const numericValue = value.replace(/[^\d.]/g, '');
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Nueva Tarjeta</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de la Tarjeta</Form.Label>
            <Form.Control
              type="text"
              name="Nombre"
              placeholder="Ej: Tarjeta Principal"
              value={formData.Nombre}
              onChange={handleChange}
              isInvalid={!!errors.Nombre}
            />
            <Form.Control.Feedback type="invalid">
              {errors.Nombre}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo de Tarjeta</Form.Label>
            <Form.Select
              name="Tipo_tarjeta"
              value={formData.Tipo_tarjeta}
              onChange={handleChange}
              isInvalid={!!errors.Tipo_tarjeta}
            >
              <option value="">Selecciona el tipo</option>
              <option value="Débito">Débito</option>
              <option value="Crédito">Crédito</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.Tipo_tarjeta}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Banco</Form.Label>
            <Form.Control
              type="text"
              name="Banco"
              placeholder="Ej: Bancolombia, BBVA, etc."
              value={formData.Banco}
              onChange={handleChange}
              isInvalid={!!errors.Banco}
            />
            <Form.Control.Feedback type="invalid">
              {errors.Banco}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Número de Tarjeta</Form.Label>
            <Form.Control
              type="text"
              name="Numero"
              placeholder="1234567890123456"
              value={formData.Numero}
              onChange={handleChange}
              isInvalid={!!errors.Numero}
              maxLength={16}
            />
            <Form.Control.Feedback type="invalid">
              {errors.Numero}
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              16 dígitos sin espacios
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Saldo Inicial</Form.Label>
            <Form.Control
              type="text"
              name="Saldo"
              placeholder="0.00"
              value={formData.Saldo}
              onChange={handleChange}
              isInvalid={!!errors.Saldo}
            />
            <Form.Control.Feedback type="invalid">
              {errors.Saldo}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="warning" type="submit" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : "Agregar Tarjeta"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default function Cards() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState(null);
  const [tarjetas, setTarjetas] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [deletedCards, setDeletedCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Cargar tarjetas al montar el componente
  const loadUserProfile = useCallback(async () => {
    if (!user) return;
    try {
      const response = await userApi.getCompleteProfile(user.id);
      setUserProfile(response.data);
    } catch (err) {
      console.error("Error al cargar perfil en Cards:", err);
    }
  }, [user]);

  const loadCards = useCallback(async () => {
  if (!user) return; 
  try {
    setIsLoading(true);
    const response = await cardApi.getCards(user.id);
    setTarjetas(response.data);
    setError("");
  } catch (err) {
    console.error("Error al cargar tarjetas:", err);
    setError("Error al cargar las tarjetas");
  } finally {
    setIsLoading(false);
  }
}, [user]);

useEffect(() => {
  if (user) {
    loadCards();
  }
}, [user, loadCards]);

useEffect(() => {
  if (!user) navigate("/login");
}, [user, navigate]);

useEffect(() => {
  if (user) {
    loadUserProfile();
  }
}, [loadUserProfile]);

  const handleAddCard = async (cardData) => {
    try {
      setIsLoading(true);
      await cardApi.addCard(user.id, cardData);
      setSuccess("Tarjeta agregada exitosamente");
      setShowAddModal(false);
      await loadCards(); // Recargar la lista
    } catch (err) {
      console.error("Error al agregar tarjeta:", err);
      setError(err.response?.data?.message || "Error al agregar tarjeta");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta tarjeta?")) {
      return;
    }

    try {
      setIsLoading(true);
      await cardApi.deleteCard(cardId);
      setSuccess("Tarjeta eliminada exitosamente");
      
      // Si la tarjeta eliminada era la seleccionada, limpiar selección
      if (selectedCard && selectedCard.ID_Tarjetas === cardId) {
        setSelectedCard(null);
      }
      
      await loadCards(); // Recargar la lista
    } catch (err) {
      console.error("Error al eliminar tarjeta:", err);
      setError(err.response?.data?.message || "Error al eliminar tarjeta");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDeleted = async () => {
    try {
      setIsLoading(true);
      const response = await cardApi.getInactiveCards(user.id);
      setDeletedCards(response.data || []);
      setShowDeleted(true);
      setSelectedCard(null);
    } catch (err) {
      console.error("Error al cargar tarjetas eliminadas:", err);
      setError("Error al cargar tarjetas eliminadas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivate = async (cardId) => {
    try {
      setIsLoading(true);
      await cardApi.reactivateCard(cardId);
      setSuccess("Tarjeta reactivada exitosamente");
      setDeletedCards((prev) => prev.filter((c) => c.ID_Tarjetas !== cardId));
      await loadCards();
    } catch (err) {
      console.error("Error al reactivar tarjeta:", err);
      setError(err.response?.data?.message || "Error al reactivar tarjeta");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const nombreUsuario = userProfile?.Nombre_Usuario || user.nombre;
  const imagenPerfil = userProfile?.Imagen_Perfil || user?.Imagen_Perfil || null;

  return (
    <div className="d-flex w-100 vh-100">
      <Sidebar
        user={user}
        navigate={navigate}
        location={location}
        nombreUsuario={nombreUsuario}
        handleLogout={logout}
        imagenPerfil={imagenPerfil}
      />

      <div
        className="content-area flex-grow-1"
        style={{
          marginLeft: "280px",
          height: "100vh",
          overflow: "auto",
          paddingBottom: "80px",
          backgroundColor: "#fff",
        }}
      >
        <Container fluid className="p-4 p-lg-5" style={{ paddingBottom: '100px' }}>
          {/* Header con título y botón */}
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              {showDeleted ? (
                <h1 className="fw-bold mb-0">Tarjetas Eliminadas</h1>
              ) : (
                <h1 className="fw-bold mb-0">Mis Tarjetas</h1>
              )}
            </div>
            <div className="d-flex gap-2">
              {!selectedCard && !showDeleted && (
                <Button variant="warning" className="fw-bold" onClick={() => setShowAddModal(true)}>
                  <IoAddOutline className="me-1" size={18} />
                  Añadir tarjeta
                </Button>
              )}
              <Button variant={showDeleted ? "success" : "danger"} className="fw-bold" onClick={showDeleted ? () => setShowDeleted(false) : handleViewDeleted}>
                {showDeleted ? <IoArrowBackOutline className="me-1" size={18} /> : <IoTrashOutline className="me-1" size={18} />}
                {showDeleted ? 'Activas' : 'Eliminadas'}
              </Button>
            </div>
          </div>

          {/* Alertas */}
          {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

          {showDeleted ? (
            deletedCards.length === 0 ? (
              <div className="text-center mt-5">
                <IoCardOutline size={60} className="text-muted mb-3" />
                <p className="text-muted fs-5">No tienes tarjetas eliminadas</p>
              </div>
            ) : (
              <Row className="g-4">
                {deletedCards.map((tarjeta) => (
                  <Col xs={12} sm={6} lg={4} xl={3} key={tarjeta.ID_Tarjetas}>
                    <CreditCardView card={tarjeta} inactive actionLabel="Reactivar" onAction={handleReactivate} />
                  </Col>
                ))}
              </Row>
            )
          ) : isLoading && tarjetas.length === 0 ? (
            <div className="text-center mt-5">
              <Spinner animation="border" variant="warning" />
              <p className="mt-2 text-muted">Cargando tarjetas...</p>
            </div>
          ) : tarjetas.length === 0 && !selectedCard ? (
            <div className="text-center mt-5">
              <IoCardOutline size={60} className="text-muted mb-3" />
              <p className="text-muted fs-5">No tienes tarjetas registradas</p>
              <Button variant="warning" className="fw-bold mt-2" onClick={() => setShowAddModal(true)}>
                <IoAddOutline className="me-2" />
                Agregar tu primera tarjeta
              </Button>
            </div>
          ) : selectedCard ? (
            /* Vista detalle */
            <div>
              <Button variant="outline-secondary" className="mb-4 d-flex align-items-center" onClick={() => setSelectedCard(null)}>
                <IoArrowBackOutline className="me-2" size={18} />
                Volver
              </Button>
              
              <Row className="g-4">
                <Col xs={12} md={7}>
                  <CreditCardView card={selectedCard} style={{ maxWidth: '450px' }} />
                  
                  <div className="mt-4">
                    <Button variant="danger" onClick={() => handleDeleteCard(selectedCard.ID_Tarjetas)} disabled={isLoading}>
                      {isLoading ? <Spinner size="sm" /> : <><IoTrashOutline className="me-1" /> Eliminar tarjeta</>}
                    </Button>
                  </div>
                </Col>
                <Col xs={12} md={5}>
                  <div style={{ backgroundColor: '#f8f9fa', borderRadius: '12px', padding: '24px' }}>
                    <h5 className="fw-bold mb-3">Detalles de la Tarjeta</h5>
                    <div className="mb-2"><strong>Banco:</strong> {selectedCard.Banco}</div>
                    <div className="mb-2"><strong>Tipo:</strong> {selectedCard.Tipo_tarjeta || 'No especificado'}</div>
                    <div className="mb-2"><strong>Número:</strong> **** **** **** {selectedCard.Numero ? selectedCard.Numero.slice(-4) : '****'}</div>
                    <div className="mb-2"><strong>Saldo:</strong> ${selectedCard.Saldo ? Number(selectedCard.Saldo).toLocaleString() : '0.00'}</div>
                    <div className="mb-0"><strong>Estado:</strong> <span className="badge bg-success">{selectedCard.Estado}</span></div>
                  </div>
                </Col>
              </Row>
            </div>
          ) : (
            /* Grid de tarjetas */
            <Row className="g-4">
              {tarjetas.map((tarjeta) => (
                <Col xs={12} sm={6} lg={4} xl={3} key={tarjeta.ID_Tarjetas}>
                  <CreditCardView card={tarjeta} onClick={() => setSelectedCard(tarjeta)} />
                </Col>
              ))}
            </Row>
          )}
        </Container>

        {/* Modal para agregar tarjeta */}
        <AddCardModal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          onAddCard={handleAddCard}
          isLoading={isLoading}
        />

        {/* FOOTER FIJO */}
        <footer
          className="text-center text-muted border-top py-3"
          style={{
            backgroundColor: "#f8f9fa",
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
          }}
        >
          <small>
            &copy; {new Date().getFullYear()} QuackWallet. Todos los derechos reservados.
          </small>
        </footer>
      </div>
    </div>
  );
}