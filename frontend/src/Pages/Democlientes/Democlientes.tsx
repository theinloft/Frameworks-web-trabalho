import { useState } from "react";
import "./Democlientes.css";
import { Link } from "react-router-dom";

const guias = [
    {
        id: "One",
        titulo: "Cadastrar Clientes",
        texto: "Painel de cadastro simples e de fácil compreensão.",
    },
    {
        id: "Two",
        titulo: "Novo Clientes",
        texto: "Ao clicar no botão, + Novo Cliente, adicionar as informções Nome e Email.",
    },
    {
        id: "Three",
        titulo: "Editar ou excluir informações do cliente",
        texto: "Ficam sempre disponíveis as opções de editar ou excluir clinete.",
    },
];

export default function Democlientes() {
    const [aberto, setAberto] = useState<string | null>(null);

    const toggle = (id: string) => {
        setAberto((atual) => (atual === id ? null : id));
    };

    return (
        <section id="democlientes">

            <h2>Clientes</h2>
            <div className="imagem">
                <picture>
                    <source media="(max-width: 768px)" srcSet="/democlientes/democlientes-pequena.jpg" />
                    <img src="/democlientes/democlientes.jpg" alt="imagem do painel de clientes" />
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