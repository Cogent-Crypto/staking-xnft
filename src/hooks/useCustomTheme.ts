import { useState, useEffect } from "react";
import { useTheme } from 'react-xnft';


// "colors": {
//     "background": "#18181b",
//     "nav": "#27272a",
//     "fontColor": "#FFFFFF",
//     "fontColor2": "#D4D4D8",
//     "border": "#393C43",
//     "activeNavButton": "#47dfbe",
//     "hamburger": "#71717A",
//     "scrollbarTrack": "#18181b",
//     "scrollbarThumb": "rgb(153 164 180)",
//     "tabIconBackground": "#71717A",
//     "tabIconSelected": "#47dfbe",
//     "secondary": "#71717A",
//     "positive": "#35A63A",
//     "negative": "#E95050",
//     "primaryButton": "#47dfbe",
//     "secondaryButton": "#3F3F46",
//     "dangerButton": "#DC2626",
//     "buttonFontColor": "#FFFFFF",
//     "sendGradient": "linear-gradient(180deg, #18181b 0%, rgba(27, 29, 35, 0) 100%)",
//     "swapGradient": "linear-gradient(180deg, #27272a 0%, rgba(41, 44, 51, 0) 100%)",
//     "drawerGradient": "linear-gradient(180deg, #27272a 0%, rgba(41, 44, 51, 0) 100%)",
//     "alpha": "#D4D4D8",
//     "bg2": "#272727",
//     "border1": "#52525B",
//     "disabledButton": "#47dfbe",
//     "subtext": "#A1A1AA"
// }

const LightModeTheme = {
    fontColor: "#000000",
    // secondary: "#333333",
    bg2: "#fff",
    lightMode: true
}

const DarkModeTheme = {
    bg2: "#272727",
    // fontColor: "#ffffff",
    secondary: "#ffffff",
    lightMode: false
}

export function useCustomTheme() {
    const theme = useTheme();
    const [customTheme, setCustomTheme] = useState({});
    useEffect(() => {
        const { isDarkMode } = window.xnft?.metadata

        const modeThemeOverrides = isDarkMode ? DarkModeTheme : LightModeTheme

        const newTheme = { colors: { ...theme.custom.colors, ...modeThemeOverrides } }

        setCustomTheme(newTheme);
    }, [theme]);

    // console.log("theme", customTheme);

    return customTheme;
}

export function statusColor(status: string) {
    if (status == "active") return "#00d41c";
    if (status == "inactive") return "#b8260d";
    if (status == "deactivating" || status == "activating") return "rgb(225 29 72)";

    console.log("got an unknown status: " + status);
    return "white";
};