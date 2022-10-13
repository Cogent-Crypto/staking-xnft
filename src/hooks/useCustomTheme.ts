import { useState, useEffect } from "react";
import { useTheme }  from 'react-xnft';


export function useCustomTheme() {
    const theme = useTheme();
    const [customTheme, setCustomTheme] = useState({});
    useEffect(() => {

        const newTheme = {colors:theme.custom.colors}
        newTheme.colors.bg2 = "#272727"
        

        setCustomTheme(newTheme);
    }, [theme]);
    return customTheme; 
}