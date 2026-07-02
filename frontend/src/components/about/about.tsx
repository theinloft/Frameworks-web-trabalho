import './about.css';
import image1 from './img/image1.svg'
import image1comprimida from './img/image1comprimida.svg'
import image1pequena from './img/image1pequena.svg'
import contacts1 from './img/Contacts1.svg'
import contacts2 from './img/Contacts2.svg'
import contacts3 from './img/Contacts3.svg'

export function About() {
    return (
        <section className="about">
            <div className="item">
                <h3>Tire proveito dos insights de vendas para impulsionar sua estratégia</h3>
                <p>Explore relatórios de vendas em tempo real e fique por dentro de tudo que acontece no seu funil de vendas com as sugestões da IA. As ferramentas de previsão, definição de metas, monitoramento de equipes e análise de métricas avançadas do Pipedrive ajudam a acelerar e a fundamentar sua tomada de decisão.</p>
                <a href="" className="btn-know-more">Saiba mais</a>
            </div>
            <div className="image right">
                <picture>
                    <source media="(min-width: 768px)" srcSet={image1} />
                    <source media="(min-width: 465px)" srcSet={image1comprimida} />
                    <img src={image1pequena} alt="imagem placeholder 300x300"></img>
                </picture>
            </div>
            <div className="image left">
                <picture>
                    <source media="(min-width: 768px)" srcSet={contacts1} />
                    <source media="(min-width: 465px)" srcSet={contacts2} />
                    <img src={contacts3}alt="imagem placeholder 300x300"></img>
                </picture>
            </div>
            <div className="item">
                <h3>O CRM de vendas feito sob medida para seu negócio</h3>
                <p>Migre facilmente para uma ferramenta adequada para cada etapa da jornada dos seus clientes. O Shred_lab é muito mais que um funil de vendas.</p>
                <a href="" className="btn-know-more">Saiba mais</a>
            </div>
        </section>
    )
}

export default About;