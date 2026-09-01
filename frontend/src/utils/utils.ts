//paginar
export function paginar<T>(lista: T[], pagina: number, porPagina: number) {
  const inicio = (pagina - 1) * porPagina;
  return lista.slice(inicio, inicio + porPagina);
}

export function getImagemUrl(imagem?: string | null): string | undefined {
  if (!imagem) return undefined;
  return imagem;
}