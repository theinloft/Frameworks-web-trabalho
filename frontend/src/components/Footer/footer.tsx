import './footer.css';
import IonIcon from '@reacticons/ionicons';

export function Footer() {
    return (
        <footer className="foot">
            <section className="area-footer">

                <address>
                    <p className="titulo">Contato: </p>
                    <p>Avenida Lavras, 329 - Petrópolis</p>
                    <p> Porto Alegre - RS Telefone: (51) 3215-1111</p>
                </address>

                <nav>
                    <ul className="social-nav">
                        <li>
                            <a href="https://www.facebook.com"><IonIcon className="facebook" name="logo-facebook"></IonIcon></a>
                        </li>
                        <li>
                            <a href="https://www.pinterest.com"><IonIcon className="pinterest" name="logo-pinterest"></IonIcon></a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com"><IonIcon className="instagram" name="logo-instagram"></IonIcon></a>
                        </li>
                        <li>
                            <a href="https://www.google.com.br"><IonIcon className="google" name="logo-google"></IonIcon></a>
                        </li>
                    </ul>
                </nav>
            </section>
        </footer>
    )

}

export default Footer;