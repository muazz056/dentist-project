import React, { createContext, useContext, useState, useEffect } from "react";
import { siteConfig as initialConfig, SiteConfig } from "../config/site";

interface ConfigContextType {
  config: SiteConfig;
  loading: boolean;
}

const ConfigContext = createContext<ConfigContextType>({
  config: initialConfig,
  loading: true,
});

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchConfig() {
      try {
        const res = await fetch("/api/config");
        if (res.ok) {
          const data = await res.json();
          if (active) {
            setConfig((prev) => ({
              ...prev,
              ...data,
              // Keep static office hours unless customized
              officeHours: prev.officeHours,
            }));
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic configuration from server. Falling back to environment defaults.", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchConfig();

    return () => {
      active = false;
    };
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loading }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
export default ConfigProvider;
