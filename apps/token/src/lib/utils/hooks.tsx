import amountCalculatorService from "@/services/pricefeeds/amount.service";
import { yupResolver } from "@hookform/resolvers/yup";
import { zodResolver } from "@hookform/resolvers/zod";
import { Currency } from "@prisma/client";
import { useEffect, useReducer, useState } from "react";
import {
	DefaultValues,
	FieldValues,
	UseFormReturn,
	useForm,
} from "react-hook-form";
import { toast } from "react-toastify";

function useKeyPress(targetKey) {
	const [keyPressed, setKeyPressed] = useState(false);
	function downHandler({ key }) {
		if (key === targetKey) {
			setKeyPressed(true);
		}
	}
	const upHandler = ({ key }) => {
		if (key === targetKey) {
			setKeyPressed(false);
		}
	};
	useEffect(() => {
		window.addEventListener("keydown", downHandler);
		window.addEventListener("keyup", upHandler);
		return () => {
			window.removeEventListener("keydown", downHandler);
			window.removeEventListener("keyup", upHandler);
		};
	}, []);
	return keyPressed;
}

const useOffsetScroll = () => {
	const [offset, setOffset] = useState([0]);
	useEffect(() => {
		function updateSize() {
			setOffset([window.scrollY]);
		}
		window.addEventListener("scroll", updateSize);
		updateSize();
		return () => window.removeEventListener("resize", updateSize);
	}, []);
	return offset;
};

const actionTypes = {
	toggle: "TOGGLE",
	on: "ON",
	off: "OFF",
} as const;

function toggleReducer(state, action) {
	switch (action.type) {
		case actionTypes.toggle: {
			return { on: !state.on };
		}
		case actionTypes.on: {
			return { on: true };
		}
		case actionTypes.off: {
			return { on: false };
		}
		default: {
			throw new Error(`Unhandled type: ${action.type}`);
		}
	}
}
function useToggle(
	{ reducer = toggleReducer, initialState } = { initialState: false },
) {
	const [{ on }, dispatch] = useReducer(reducer, { on: initialState });

	const toggle = (state?: boolean) =>
		dispatch({ type: actionTypes.toggle, payload: state });
	const setOn = () => dispatch({ type: actionTypes.on });
	const setOff = () => dispatch({ type: actionTypes.off });

	return { on, toggle, setOn, setOff, toggleReducer };
}

function useDarkMode() {
	const [enabledState, setEnabledState] = useLocalStorage(
		"dark-mode-enabled",
		undefined,
	);
	const prefersDarkMode = usePrefersDarkMode();
	const enabled =
		typeof enabledState !== "undefined" ? enabledState : prefersDarkMode;
	return [enabled, setEnabledState];
}

function useLocalStorage(key, initialValue) {
	// State to store our value
	// Pass initial state function to useState so logic is only executed once
	const [storedValue, setStoredValue] = useState(() => {
		if (typeof window === "undefined") {
			return initialValue;
		}
		try {
			// Get from local storage by key
			const item = window.localStorage.getItem(key);
			// Parse stored json or if none return initialValue
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			// If error also return initialValue
			console.error(error);
			return initialValue;
		}
	});
	// Return a wrapped version of useState's setter function that ...
	// ... persists the new value to localStorage.
	const setValue = (value) => {
		try {
			// Allow value to be a function so we have same API as useState
			const valueToStore =
				value instanceof Function ? value(storedValue) : value;
			// Save state
			setStoredValue(valueToStore);
			// Save to local storage
			if (typeof window !== "undefined") {
				window.localStorage.setItem(key, JSON.stringify(valueToStore));
			}
		} catch (error) {
			// A more advanced implementation would handle the error case
			console.error(error);
		}
	};
	return [storedValue, setValue];
}

function usePrefersDarkMode() {
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = (e) => {
			setDarkMode(e.matches ? true : false);
		};
		mediaQuery.addListener(handleChange);
		handleChange(mediaQuery);
		return () => {
			mediaQuery.removeListener(handleChange);
		};
	}, []);
	return !!darkMode;
}

function useConditionalForm<T extends FieldValues>(
	defaultValues?: DefaultValues<T>,
	shouldUnregister = false,
	schema?: any, // Ajusta según el tipo específico de tu esquema
	resolver: "yup" | "zod" = "yup",
): UseFormReturn<T> {
	const methods = useForm<T>({
		resolver: resolver === "yup" ? yupResolver(schema) : zodResolver(schema),
		shouldUnregister,
		defaultValues,
	});

	useEffect(() => {
		if (defaultValues) {
			methods.reset(defaultValues);
		}
	}, [defaultValues]);

	return methods;
}

export {
	useKeyPress,
	useToggle,
	useDarkMode,
	useOffsetScroll,
	useConditionalForm,
};

export const useBeforeUnload = () => {
	useEffect(() => {
		if (typeof window === "undefined") return;
		const onBeforeUnload = (e: BeforeUnloadEvent) => {
			toast.info(
				"Please confirm or cancel the transaction before closing the page",
				{
					autoClose: false,
				},
			);
			e.preventDefault();
			const message = "Are you sure you want to close?";
			e.returnValue = message; //Gecko + IE
			return message;
		};
		window.addEventListener("beforeunload", onBeforeUnload);
		return function cleanupListener() {
			window.removeEventListener("beforeunload", onBeforeUnload);
		};
	}, []);
	return null;
};

interface usePricePerUnitProps {
	from: Currency | null;
	to: Currency | null;
	onError?: () => void;
	shouldFetch?: boolean;
	base: number;
	addManagementFee?: boolean;
	isSiwe: boolean;
	precision?: number;
}
export const usePricePerUnit = ({
	from,
	to,
	onError,
	base,
	shouldFetch,
	isSiwe,
	precision,
	...rest
}: usePricePerUnitProps) => {
	const [pricePerUnit, setPricePerUnit] = useState<string | null>(
		base ? String(base) : null,
	);
	const trigger = !!from && !!to && shouldFetch;

	useEffect(() => {
		const fetchData = async () => {
			if (isSiwe && from && to) {
				try {
					const { pricePerUnit } =
						await amountCalculatorService.getAmountAndPricePerUnit({
							initialCurrency: from,
							currency: to,
							quantity: 0,
							base: base,
							precision,
							...rest,
						});
					setPricePerUnit(pricePerUnit);
				} catch (error) {
					toast.error("Ops! someting wrong.");
					onError?.();
				}
			}
		};
		if (trigger) {
			fetchData();
		}
	}, [trigger]);

	return [pricePerUnit, setPricePerUnit] as const;
};
