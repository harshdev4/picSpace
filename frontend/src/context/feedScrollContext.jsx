import { createContext, useRef, useState } from "react";

export const ScrollContext = createContext({
    scrollPosition: 0,
});

const ScrollContextProvider = ({children}) => {
    const scrollPosition = useRef(0);
    return(
        <ScrollContext.Provider value={{scrollPosition}}>
            {children}
        </ScrollContext.Provider>
    )
}

export default ScrollContextProvider;