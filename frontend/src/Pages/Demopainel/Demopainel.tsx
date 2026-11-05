import { useState } from "react";
import "./Demopainel.css";
import { Link } from "react-router-dom";

const guias = [
    {
        id: "One",
        titulo: "Painel - Dashboard de clientes",
        texto: "Dashboard conciso e prático, seguimentado em 4 partes.",
    },
    {
        id: "Two",
        titulo: "Gráfico",
        texto: "Aboradagem gráfica sobre os pedidos de acordo com o status de cada um.",
    },
    {
        id: "Three",
        titulo: "Tabela de Pedidos recentes",
        texto: "Tabela dos pedidos recentes com o código (id) de cada.",
    },
    {
        id: "Four",
        titulo: "Tabela de clientes",
        texto: "Tabela com uma lista dos últimos clientes adicionados.",
    },
    {
        id: "Five",
        titulo: "Tabela de produtos",
        texto: "Últimos produtos adicionados, contendo nome e preço.",
    },
];

export default function Demopainel() {
    const [aberto, setAberto] = useState<string | null>(null);

    const toggle = (id: string) => {
        setAberto((atual) => (atual === id ? null : id));
    };

    return (
        <section id="demopainel">
            
            <h2>Painel</h2>
            <div className="imagem">
                <picture>
                    <source media="(max-width: 768px)" srcSet="/demopainel/demopainel-pequena.jpg" />
                    <img src="/demopainel/demopainel.jpg" alt="imagem do painel de clientes" />
                </picture>
            </div>
            <div className="accordion" id="accordionExample">
                {guias.map(({ id, titulo, texto }) => {
                    const estaAberto = aberto === id;
                    return (
                        <div className="cardcli" key={id}>
                            <div className="card-header" id={`heading${id}`}>
                                <h5 className="mb-0">
                                    <button
                                        className={`btn btn-link ${estaAberto ? "" : "collapsed"}`}
                                        type="button"
                                        onClick={() => toggle(id)}
                                        aria-expanded={estaAberto}
                                        aria-controls={`collapse${id}`}
                                    >
                                        {titulo}
                                    </button>
                                </h5>
                            </div>

                            <div
                                id={`collapse${id}`}
                                className={`collapse ${estaAberto ? "show" : ""}`}
                                aria-labelledby={`heading${id}`}
                            >
                                <div className="card-body">{texto}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="return">
                <Link to={"/"} className="btn-know-more">Voltar</Link>
            </div>            
        </section>
    );
}