import { useState } from "react";
import "./Demopedidos.css";
import { Link } from "react-router-dom";

const guias = [
    {
        id: "One",
        titulo: "Criar Pedido",
        texto: "Para criar um pedido, dentro do painel interno, você deve clicar no botão Pedidos.",
    },
    {
        id: "Two",
        titulo: "Novo Pedido",
        texto: "Ao clicar no botão, + Novo Pedido, selecionar o cliente que já deve estar cadastrado.",
    },
    {
        id: "Three",
        titulo: "Selecionar o produto e a quantidade",
        texto: "O campo de produtos possui autocompletar para facilitar na busca do produto. Após selecionar o produto, inserir a qunatidade desejada.",
    },
    {
        id: "Four",
        titulo: "Pedido criado",
        texto: "Com o pedido já criado, você terá as opções de concluir, editar ou cancelar o pedido. ",
    },

];

export default function Demopedidos() {
    const [aberto, setAberto] = useState<string | null>(null);

    const toggle = (id: string) => {
        setAberto((atual) => (atual === id ? null : id));
    };

    return (
        <section id="demopedidos">
            
            <h2>Pedidos</h2>
            <div className="imagem">
                <picture>
                    <source media="(max-width: 768px)" srcSet="/demopedidos/demopedidos-pequena.jpg" />
                    <img src="/demopedidos/demopedidos.jpg" alt="imagem do painel de clientes" />
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