import { useState, useEffect } from "react";
import { useTheme }  from 'react-xnft';


export function useCustomTheme() {
    const theme = useTheme();
    const [customTheme, setCustomTheme] = useState({});
    useEffect(() => {
        console.log("theme", JSON.stringify(theme));
        const newTheme = {colors:theme.custom.colors}
        newTheme.colors.bg2 = "#272727"
        

        setCustomTheme(newTheme);
    }, [theme]);
    return customTheme; 
}

export function statusColor(status: string) {
    if (status == "active") return "#00d41c";
    if (status == "inactive") return "#b8260d";
    if (status == "deactivating" || status == "activating") return "yellow";
    
    console.log("got an unknown status: " + status);
    return "white";
  };