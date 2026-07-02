import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Menu.css";
function Menu() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    function handleStorage() {
      setToken(localStorage.getItem("token"));
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    function handleClickFora(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener("click", handleClickFora);
    return () => document.removeEventListener("click", handleClickFora);
  }, []);

  useEffect(() => {
    function handleResize() {
      //por exemplo, se por um acaso, o menu sanduiche tiver aberto, ele irá fechar em 740px, para o layout não ficar com dois menus na transição.
      if (window.innerWidth > 740) {
        setMenuAberto(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <nav className="menu">
        <div className="lista-responsive" ref={menuRef}>
          <button
            type="button"
            className="menu-button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuAberto(!menuAberto);
            }}
          >
            <span className="material-icons">dehaze</span>
          </button>
        </div>

        <div className="logo">
          <Link to={"/"}>SHRED_LAB</Link>
        </div>

        <div className="lista">
          <ul className="nav-links">
            <li>TUTORIAIS</li>
            <li>
              <Link to={"/cases-clientes"}>CASE DE CLIENTES</Link>{" "}
            </li>
            <li>
              <Link to={"/fale-conosco"}>FALE CONOSCO</Link>
            </li>
          </ul>
        </div>

        <a className="material-icons">search</a>

        {token ? (
          <div className="perfil-wrapper">
            <span
              className="material-icons perfil-icon"
              onClick={() => setPerfilAberto((prev) => !prev)}
            >
              account_circle
            </span>
            {perfilAberto && (
              <div className="perfil-dropdown">
                <button
                  className="perfil-sair"
                  onClick={() => {
                    localStorage.removeItem("token");
                    setToken(null);
                    setPerfilAberto(false);
                    window.location.href = "/login";
                  }}
                >
                  SAIR
                </button>
                <button
                  className="perfil-sair"
                  onClick={() => {
                    setPerfilAberto(false);
                    window.location.href = "/painel";
                  }}
                >
                  PAINEL
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="material-icons">
            account_circle
          </Link>
        )}
      </nav>

      {menuAberto && (
        <div className="menu-mobile">
          <ul>
            <li>TUTORIAIS</li>
            <li>CASE DE CLIENTES</li>
            <li>
              <Link to={"/fale-conosco"}>FALE CONOSCO</Link>
            </li>
          </ul>
        </div>
      )}

      <hr className="linha-divisor" />
    </>
  );
}

export default Menu;
