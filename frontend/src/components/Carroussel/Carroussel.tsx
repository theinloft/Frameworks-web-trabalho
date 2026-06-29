import { useState, useEffect } from "react";
import styles from "./Carroussel.module.css";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    id: 1,
    imagem: "/firmbee-com-SpVHcbuKi6E-unsplash.jpg",
    classe: styles.gestaoClientes,
    tag: "GESTÃO DE CLIENTES (CRM)",
    titulo: "Conheça cada cliente profundamente",
  },
  {
    id: 2,
    imagem: "/jessie-mccall-guXX_Wm-wnY-unsplash.jpg",
    classe: styles.gestaoProdutos,
    tag: "GESTÃO DE PRODUTOS",
    titulo: "Gerencie seu estoque de forma inteligente",
    subtitulo: "Gerenciador de produtos",
  },
  {
    id: 3,
    imagem: "/spoton-fgnYjaLsWDk-unsplash.jpg",
    classe: styles.gestaoPedidos,
    tag: "GERENCIAMENTO DE PEDIDOS",
    titulo: "Gerencie facilmente seus pedidos",
    subtitulo: "Pedidos em um só lugar",
  },
];

function Carroussel() {
  const [slideIndex, setSlideIndex] = useState(0);

  const navigate = useNavigate();

  const anterior = () => {
    setSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const proximo = () => {
    setSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setInterval(proximo, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[slideIndex];

  return (
    <div className={styles.hero}>
      <img
        src={slide.imagem}
        alt={slide.titulo}
        className={`${styles.bg} ${slide.classe}`}
      />
      <div className={styles.overlay} />

      <div className={styles.content}>
        <span className={styles.tag}>{slide.tag}</span>
        <h1 className={styles.titulo}>
          {slide.titulo}
          <span className={styles.destaque}>{slide.subtitulo}</span>
        </h1>
        <div className={styles.btnGroup}>
          {(() => {
            return (
              <button
                className={styles.btnFill}
                onClick={() => navigate("/cadastro-cliente")}
              >
                Cadastra-se
              </button>
            );
          })()}

          {(() => {
            return (
              <button
                onClick={() => navigate("/login")}
                className={styles.btnStroke}
              >
                Já tem conta? Faça Login
              </button>
            );
          })()}
        </div>
      </div>

      <button className={styles.navAnterior} onClick={anterior}>
        &#8249;
      </button>
      <button className={styles.navProximo} onClick={proximo}>
        &#8250;
      </button>

      <div className={styles.dots}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={i === slideIndex ? styles.dotAtivo : styles.dot}
            onClick={() => setSlideIndex(i)}
          />
        ))}
      </div>

      <span className={styles.contador}>
        {String(slideIndex + 1).padStart(2, "0")} /{" "}
        {String(slides.length).padStart(2, "0")}
      </span>
    </div>
  );
}

export default Carroussel;
