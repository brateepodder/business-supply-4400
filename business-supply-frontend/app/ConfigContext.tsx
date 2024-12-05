// src/context/ConfigContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface Config {
  port: string;
}

const ConfigContext = createContext<Config | undefined>(undefined);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    // Simulating fetching from an API or using environment variables
    const fetchConfig = async () => {
      setConfig({
        port: process.env.PORT || "5000", // change this to what you need
      });
    };

    fetchConfig();
  }, []);

  // While the config is loading, you can return a loading state or just null
  if (config === null) {
    return <div>Loading...</div>;  // Or you can return null to render nothing
  }

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
};
