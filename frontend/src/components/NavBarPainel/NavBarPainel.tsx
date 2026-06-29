import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./NavbarPainel.module.css";

export default function NavbarPainel() {
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  function sair() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav className={styles.nav}>
      <span className={styles.logo}>PAINEL</span>

      {/* hamburguer — só aparece no mobile */}
      <button
        className={styles.hamburguer}
        onClick={() => setMenuAberto((prev) => !prev)}
      >
        {menuAberto ? "✕" : "☰"}
      </button>

      {/* links — desktop sempre visível, mobile só quando aberto */}
      <div className={`${styles.links} ${menuAberto ? styles.aberto : ""}`}>
        <NavLink
          to="/painel"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.ativo}` : styles.link
          }
          onClick={() => setMenuAberto(false)}
        >
          PAINEL
        </NavLink>
        <NavLink
          to="/produtos"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.ativo}` : styles.link
          }
          onClick={() => setMenuAberto(false)}
        >
          PRODUTOS
        </NavLink>
        <NavLink
          to="/clientes"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.ativo}` : styles.link
          }
          onClick={() => setMenuAberto(false)}
        >
          CLIENTES
        </NavLink>
        <NavLink
          to="/pedidos"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.ativo}` : styles.link
          }
          onClick={() => setMenuAberto(false)}
        >
          PEDIDOS
        </NavLink>
      </div>
    </nav>
  );
}
