"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { BiMoon, BiSun } from "react-icons/bi";

export const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme, resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && resolvedTheme) {
            document.documentElement.classList.remove("dark", "light");
            document.documentElement.classList.add(resolvedTheme);
        }
    }, [mounted, resolvedTheme]);

    if (!mounted) return null;

    return (
        <div className="flex items-center justify-center mx-4">
            {resolvedTheme === "light" ? (
                <BiSun
                    className="cursor-pointer text-black dark:text-white"
                    size={25}
                    onClick={() => setTheme("dark")}
                />
            ) : (
                <BiMoon
                    className="cursor-pointer text-black dark:text-white"
                    size={25}
                    onClick={() => setTheme("light")}
                />
            )}
        </div>
    );
};