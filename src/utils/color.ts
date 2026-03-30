function hexToInt(hexColor: string) {
    const hex = hexColor.startsWith("#") ? hexColor.substring(1) : hexColor;

    return parseInt(hex, 16);
}

export const colors = {
    success: hexToInt("#F5EE25"),
    error: hexToInt("#F52F25"),
};
