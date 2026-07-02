import "./CaseClientes.css";

const cases = [
  {
    src: "/cases_clientes/centre-for-ageing-better-UZCqtOcY8b4-unsplash.jpg",
    alt: "Maria Moda",
    nome: "Maria Silva",
    texto:
      "O resultado superou nossas expectativas, a equipe foi muito atenciosa.",
    empresa: "Maria Modas",
  },
  {
    src: "/cases_clientes/kelvin-zyteng-JGT4JGuBdTs-unsplash.jpg",
    alt: "Confeitaria Santo Quitute",
    nome: "Gilda Fernandes",
    texto:
      "Vejo que sempre posso organizar minhas rotinas de pedidos, isso facilitou, saindo do papel e anotações.",
    empresa: "Confeitaria Santo Quitute",
  },
];

export default function GaleriaCases() {
  return (
    <div className="galeria-wrapper">
      <h1 className="galeria-titulo">CASES DE CLIENTES - DEPOIMENTOS</h1>

      <div className="galeria-section">
        <div className="galeria-grid">
          {cases.map((item, i) => (
            <div key={i} className="card">
              <img src={item.src} alt={item.alt} className="galeria-img" />
              <p className="texto">"{item.texto}"</p>
              <p className="nome">{item.nome}</p>
              <p className="empresa">{item.empresa}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
