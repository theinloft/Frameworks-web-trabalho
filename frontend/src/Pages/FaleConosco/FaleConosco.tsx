import "./FaleConosco.css";
export default function FaleConosco() {
    function handleSubmit(e: any) {
        e.preventDefault();
        alert("Mensagem enviada com sucesso!");
    }
    return (
        <section className="contato">
            <div className="mapa">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.9239414968174!2d-51.19101452474843!3d-30.03903983102531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x951978253ac0e4b1%3A0xce5eb0f3e484ffa5!2sAv.%20Lavras%2C%20329%20-%20Petr%C3%B3polis%2C%20Porto%20Alegre%20-%20RS%2C%2090460-040!5e0!3m2!1spt-BR!2sbr!4v1782511851944!5m2!1spt-BR!2sbr"></iframe>
            </div>
            <div className="form_contato">
                <h1>Contato online</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nome" className="input">Nome completo:</label>
                    <input id="nome" type="text" name="nome" className="input" placeholder="Nome Completo" required autoFocus />
                    <label htmlFor="cel" className="input">Telefone para contato:</label>
                    <input id="cel" type="tel" name="cel" className="input" placeholder="(51)XXXXX-XXXX" required />
                    <label htmlFor="cep" className="input">CEP:</label>
                    <input id="cep" type="text" name="cep" className="input" placeholder="Sem ponto e sem hífen" required />
                    <label htmlFor="endereco" className="input">Endereço:</label>
                    <input id="endereco" type="text" name="endereco" className="input" placeholder="Campo obrigatório" required />
                    <label htmlFor="numero" className="input">Número:</label>
                    <input id="numero" type="number" name="numero" className="input" min="0" required />
                    <label htmlFor="complemento" className="input">Complemento:</label>
                    <input id="complemento" type="text" name="complemento" className="input" />
                    <label htmlFor="cidade" className="input">Cidade:</label>
                    <input id="cidade" type="text" name="cidade" className="input" placeholder="Campo obrigatório" required />
                    <span className="obs">Observações:</span>
                    <textarea
                        name="obs"
                        rows="10"
                        minLength={0}
                        maxLength={30}
                        placeholder="Escreva observações, mensagens ou pedidos especiais, se necessário."
                    />
                    <input type="submit" className="botao" value="Enviar" />
                </form>
            </div>
             

        </section>
    );
}