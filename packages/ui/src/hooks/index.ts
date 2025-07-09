"use client";
import { useRef } from "react";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";

function usePrevious<T>(value: T): T | undefined {
	const currentRef = useRef<T>(value);
	const previousRef = useRef<T | undefined>(undefined);

	if (currentRef.current !== value) {
		previousRef.current = currentRef.current;
		currentRef.current = value;
	}

	return previousRef.current;
}

export { useLocalStorage, useReadLocalStorage, usePrevious };
