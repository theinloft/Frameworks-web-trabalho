//export const API_URL = import.meta.env.VITE_API_URL; //versão anterior

const bases: string[] = [
  import.meta.env.VITE_API_URL,
  import.meta.env.VITE_API_URL_BACKUP,
]
  .filter((u): u is string => Boolean(u))
  .map((u) => u.replace(/\/+$/, '')); // remove barra final

export const API_URLS = bases;
export const API_URL = bases[0];

let indiceAtivo = 0;

export async function fetchComFallback(
  url: string,
  init: RequestInit = {},
  timeoutMs = 8000,
): Promise<Response> {
  const base = API_URLS.find((b) => url.startsWith(b));

  // sem backup configurado (ou URL externa): comportamento normal
  if (!base || API_URLS.length < 2) return fetch(url, init);

  const caminho = url.slice(base.length);
  let ultimoErro: unknown = new Error('Falha ao conectar');

  for (let i = 0; i < API_URLS.length; i++) {
    const idx = (indiceAtivo + i) % API_URLS.length;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const resp = await fetch(`${API_URLS[idx]}${caminho}`, {
        ...init,
        signal: controller.signal,
      });
      if ([502, 503, 504].includes(resp.status)) {
        ultimoErro = new Error(`HTTP ${resp.status}`);
        continue;
      }
      indiceAtivo = idx; // lembra qual backend respondeu
      return resp;
    } catch (e) {
      ultimoErro = e;
    } finally {
      clearTimeout(timer);
    }
  }
  throw ultimoErro;
}
