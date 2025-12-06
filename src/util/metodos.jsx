export const normalizeVariable = (str) => {
    if (!str) return "";
    return str
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[\s\-_.]+/g, "")
        .toLowerCase();
}

export const isEmptyValue = (value) => !value || value.toString().trim() === "";

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);