import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
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
} from "react-icons/io5";

// API
import { cardApi } from "../api/cardApi";

// Sidebar + secciones
const SECCIONES = [
  { title: "Seguridad", icon: IoShieldCheckmarkOutline, path: "/security" },
  { title: "Consultas", icon: IoAnalyticsOutline, path: "/reports" },
  { title: "Novedades", icon: IoBulbOutline, path: "/news" },
  { title: "Conexiones", icon: IoPeopleOutline, path: "/connections" },
];

function Sidebar({ user, navigate, handleLogout, nombreUsuario, location }) {
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
      <div className="p-4 border-bottom text-center fs-3 fw-bold">
        Quack<span className="fw-normal">Wallet</span>
      </div>

      <div className="p-3 text-center border-bottom bg-light">
        <IoPersonCircleOutline size={30} className="text-secondary mb-1" />
        <p className="mb-0 fw-bold">{nombreUsuario}</p>
        <small className="text-muted">ID: {user?.id}</small>
      </div>

      <Nav className="flex-column p-3 flex-grow-1" activeKey={location.pathname}>
        {menuLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Nav.Link
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`d-flex align-items-center mb-1 rounded py-2 ${
                isActive
                  ? "bg-warning-subtle border-start border-4 border-warning fw-bold"
                  : "text-dark-50"
              }`}
            >
              <link.icon size={20} className="me-3" />
              {link.name}
            </Nav.Link>
          );
        })}

        <hr />

        <h6 className="px-3 text-muted small fw-bold text-uppercase">Funciones rápidas</h6>

        {SECCIONES.map((sec) => {
          const isActive = location.pathname === sec.path;
          return (
            <Nav.Link
              key={sec.path}
              onClick={() => navigate(sec.path)}
              className={`d-flex align-items-center mb-1 rounded py-2 ${
                isActive
                  ? "bg-warning-subtle border-start border-4 border-warning fw-bold"
                  : "text-dark-50"
              }`}
            >
              <sec.icon size={20} className="me-3" />
              {sec.title}
            </Nav.Link>
          );
        })}
      </Nav>

      <div className="p-3 border-top">
        <Button variant="danger" className="w-100" onClick={handleLogout}>
          <IoLogOutOutline className="me-2" size={20} />
          Cerrar sesión
        </Button>
      </div>
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

  const [tarjetas, setTarjetas] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Cargar tarjetas al montar el componente
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

  if (!user) return null;

  const nombreUsuario = user.nombre;

  return (
    <div className="d-flex w-100 vh-100">
      <Sidebar
        user={user}
        navigate={navigate}
        location={location}
        nombreUsuario={nombreUsuario}
        handleLogout={logout}
      />

      <div
        className="content-area flex-grow-1"
        style={{
          marginLeft: "250px",
          height: "100vh",
          overflow: "auto",
          paddingBottom: "80px",
          backgroundColor: "#fff",
        }}
      >
        <Container fluid className="p-4 p-lg-5">
          <h1 className="fw-bold mb-4">Mis Tarjetas</h1>

          {/* Alertas */}
          {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

          <Row>
            {/* COLUMNA IZQUIERDA */}
            <Col md={4}>
              <Button 
                variant="warning" 
                className="fw-bold w-100 mb-4"
                onClick={() => setShowAddModal(true)}
              >
                <IoAddOutline className="me-2" />
                Añadir tarjeta
              </Button>

              {isLoading && tarjetas.length === 0 ? (
                <div className="text-center">
                  <Spinner animation="border" variant="warning" />
                  <p className="mt-2 text-muted">Cargando tarjetas...</p>
                </div>
              ) : tarjetas.length === 0 ? (
                <Card className="p-4 text-center border-0 bg-light">
                  <IoCardOutline size={40} className="text-muted mb-3" />
                  <p className="text-muted">No tienes tarjetas registradas</p>
                </Card>
              ) : (
                tarjetas.map((tarjeta) => (
                  <Card
                    key={tarjeta.ID_Tarjetas}
                    className={`p-3 mb-3 shadow-sm border-0 card-hover ${
                      selectedCard?.ID_Tarjetas === tarjeta.ID_Tarjetas ? "border border-warning" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedCard(tarjeta)}
                  >
                    <h5 className="fw-bold">{tarjeta.Nombre}</h5>
                    <p className="text-muted mb-1">
                    **** **** **** {tarjeta.Numero ? tarjeta.Numero.slice(-4) : '****'}
                    </p>
                    <small className="text-muted">
                      {tarjeta.Banco} • {tarjeta.Tipo_tarjeta}
                    </small>
                  </Card>
                ))
              )}
            </Col>

            {/* COLUMNA DERECHA */}
            <Col md={8}>
              {selectedCard ? (
                <Card className="p-4 shadow-sm border-0">
                  <h3 className="fw-bold mb-3">{selectedCard.Nombre}</h3>
                  <p className="mb-1">
                    <strong>Número:</strong> **** **** **** {selectedCard.Numero ? selectedCard.Numero.slice(-4) : '****'}
                  </p>
                  <p className="mb-1">
                    <strong>Tipo:</strong> {selectedCard.Tipo_tarjeta}
                  </p>
                  <p className="mb-1">
                    <strong>Banco:</strong> {selectedCard.Banco}
                  </p>
                  <p className="mb-3">
                    <strong>Saldo:</strong> ${selectedCard.Saldo ? selectedCard.Saldo.toLocaleString() : '0.00'}
                  </p>
                  <p className="mb-3">
                    <strong>Estado:</strong> {selectedCard.Estado}
                  </p>

                  {/* BOTÓN ELIMINAR */}
                  <div className="d-flex justify-content-end mt-3">
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDeleteCard(selectedCard.ID_Tarjetas)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Spinner size="sm" />
                      ) : (
                        <>
                          <IoTrashOutline className="me-1" />
                          Eliminar tarjeta
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="text-muted text-center mt-5">
                  <IoCardOutline size={50} className="mb-3 opacity-25" />
                  <p>Selecciona una tarjeta para ver sus detalles</p>
                </div>
              )}
            </Col>
          </Row>
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