import { useState } from "react";
import "./Demoprodutos.css";
import { Link } from "react-router-dom";

const guias = [
    {
        id: "One",
        titulo: "Cadastrar Produto",
        texto: "Cadastro de produtos rápido e intuitivo. Porém, antes de cadastrar um produto uma categoria deve ser cadastrada.",
    },
    {
        id: "Two",
        titulo: "Novo Produto",
        texto: "Ao clicar no botão, + Novo Produto, adicionar as informções Nome, Preço, Categoria e selecionar uma imagem do produto.",
    },
    {
        id: "Three",
        titulo: "Editar informações do produto",
        texto: "Para editar um produto, clicar no botao editar na mesma linha do produto. Informar as novas informações, imagem e salvar. ",
    },
    {
        id: "Four",
        titulo: "Excluir informações do produto",
        texto: "Para excluir um produto, clicar no botao excluir na mesma linha do produto. Uma caixa de confirmação será aberta e após confirmado, a exclusão será permanente. ",
    },

];

export default function Demoprodutos() {
    const [aberto, setAberto] = useState<string | null>(null);

    const toggle = (id: string) => {
        setAberto((atual) => (atual === id ? null : id));
    };

    return (
        <section id="demoprodutos">
            
            <h2>Produtos</h2>
            <div className="imagem">
                <picture>
                    <source media="(max-width: 768px)" srcSet="/demoprodutos/demoprodutos-pequena.jpg" />
                    <img src="/demoprodutos/demoprodutos.jpg" alt="imagem do painel de clientes" />
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