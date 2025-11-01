"use client";

import { useEffect, useState } from "react";

export default function ClientApkPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const download = async () => {
      try {
        const res = await fetch("/client.apk");
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "client.apk";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (e: any) {
        setError(e?.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    download();
  }, []);

  return (
    <div style={{padding:20,fontFamily:'sans-serif'}}>
      {loading && <p>Préparation du téléchargement de l'APK...</p>}
      {error && (
        <div>
          <p>Échec du téléchargement : {error}</p>
          <p>
            Si l'erreur persiste, vérifie que le fichier existe dans le volume partagé
            et que le serveur web peut y accéder.
          </p>
          <button onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      )}
      {!loading && !error && <p className="text-4xl flex justify-center items-center py-20">Download successful! Thank you for your trust.</p>}
    </div>
  );
}
