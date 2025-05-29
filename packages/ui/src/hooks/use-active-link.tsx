"use client";
import { ReactNode, createContext, useContext, useState } from "react";

/**
 * Context for managing active link state across components
 */
interface ActiveLinkContextType {
	activeLink: string;
	setActiveLink: (link: string) => void;
}

const ActiveLinkContext = createContext<ActiveLinkContextType | undefined>(
	undefined,
);

/**
 * Props for the ActiveLinkProvider component
 */
interface ActiveLinkProviderProps {
	children: ReactNode;
	initialActiveLink?: string;
}

/**
 * Provider component that manages active link state and provides it to child components
 * @param children - Child components that can access the active link context
 * @param initialActiveLink - Optional initial active link value
 */
export const ActiveLinkProvider = ({
	children,
	initialActiveLink = "",
}: ActiveLinkProviderProps) => {
	const [activeLink, setActiveLink] = useState<string>(initialActiveLink);

	return (
		<ActiveLinkContext.Provider value={{ activeLink, setActiveLink }}>
			{children}
		</ActiveLinkContext.Provider>
	);
};

/**
 * Hook to access and manage active link state
 * @returns Object containing activeLink string and setActiveLink function
 * @throws Error if used outside of ActiveLinkProvider
 */
export const useActiveLink = (): ActiveLinkContextType => {
	const context = useContext(ActiveLinkContext);

	if (context === undefined) {
		throw new Error("useActiveLink must be used within an ActiveLinkProvider");
	}

	return context;
};
