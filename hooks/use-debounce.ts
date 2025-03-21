import { useEffect, useState, useRef } from "react";

export const useDebounce = <T>(value: T, delay: number = 500): T => {
    const [debounceValue, setDebounceValue] = useState<T>(value);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setDebounceValue(value);
        }, delay);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [value, delay]);

    return debounceValue;
};

