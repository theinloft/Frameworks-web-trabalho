import { useCallback, useEffect, useState } from 'react';

export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [erro, setErro] = useState('');

  const fetchDados = useCallback(() => {
    const token = localStorage.getItem('token');
    return fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao buscar dados');
        return res.json();
      })
      .then(setData)
      .catch((e) => setErro(e.message));
  }, [url]);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  return { data, erro, setData, refetch: fetchDados };
}
