import { createContext } from "react";

const PlayerTimesContext = createContext(null);

export const PlayerTimesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <PlayerTimesContext.Provider value={null}>
      {children}
    </PlayerTimesContext.Provider>
  );
};

export default PlayerTimesContext;
