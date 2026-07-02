import './service.css';
import image1 from './img/produtos-m.png';
import image2 from './img/clientes-m.png';
import image3 from './img/pedidos-m.png';
import image4 from './img/painel-m.png';
import { Link } from 'react-router-dom';


export function Service() {
    return (
        <section className="projects" id="projects">
            <div className="project imagem1">
                <Link to={"/fale-conosco"}>
                    <img src={image1} alt="imagem de produtos"></img>
                    <p>produtos</p>
                </Link>
            </div>
            <div className="project imagem2">
                <a href="">
                    <img src={image2} alt="imagem de clientes"></img>
                    <p>clientes</p>
                </a>
            </div>
            <div className="project imagem3">
                <a href="">
                    <img src={image3} alt="imagem de pedidos"></img>
                    <p>Pedidos</p>
                </a>
            </div>
            <div className="project imagem4">
                <a href="">
                    <img src={image4} alt="imagem de painel"></img>
                    <p>painel</p>
                </a>
            </div>
        </section>
    )
}

export default Service;