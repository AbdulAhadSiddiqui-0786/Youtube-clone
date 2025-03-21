import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };
    const openSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar, closeSidebar, openSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => useContext(SidebarContext);
