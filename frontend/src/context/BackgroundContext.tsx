import React, { createContext, useContext, useState, useEffect } from "react";

type BackgroundContextType = {
  bgUrl: string | null;
};

const BackgroundContext = createContext<BackgroundContextType>({ bgUrl: null });

export const useBackground = () => useContext(BackgroundContext);

export const BackgroundProvider = ({ children }: { children: React.ReactNode }) => {
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  useEffect(() => {
    const cached = sessionStorage.getItem("bgUrl");
    if (cached) {
      setBgUrl(cached);
      return;
    }

    const img = new Image();
    const url = "https://unsplash.it/1920/1080";
    img.src = url;

    img.onload = () => {
      sessionStorage.setItem("bgUrl", img.src);
      setBgUrl(img.src);
    };

    img.onerror = () => {
      console.warn("Erreur de chargement de l'image de fond.");
      setBgUrl(null);
    };
  }, []);

  return (
    <BackgroundContext.Provider value={{ bgUrl }}>
      {children}
    </BackgroundContext.Provider>
  );
};