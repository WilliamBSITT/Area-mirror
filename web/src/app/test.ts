import { useState } from "react";

export function useFetchBack() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/test");
      if (!res.ok) throw new Error("Erreur serveur");
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError("Impossible de contacter le back");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, handleClick };
}