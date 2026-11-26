import { useCallback, useEffect, useState } from 'react';
import { fetchComFallback } from '../config/api';   // novo

export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [erro, setErro] = useState('');

  const fetchDados = useCallback(() => {
    const token = localStorage.getItem('token');
    return fetchComFallback(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao buscar dados');
        return res.json();
      })
      .then((json) => {
        setData(json);
        setErro('');
      })
      .catch((e) => {
  setData(null);
  setErro(e.message);
});
  }, [url]);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  return { data, erro, setData, refetch: fetchDados };
}
