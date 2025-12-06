///////////////  Normaliza string
export const normalizeVariable = (str) => {
    if (!str) return "";
    return str
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[\s\-_.]+/g, "")
        .toLowerCase();
}

///////////////  Normaliza objeto completo
export const normalizeObject = (obj) => {
    const normalized = {};

    Object.keys(obj).forEach((key) => {
        const value = obj[key];

        normalized[key] = typeof value === "string"
            ? normalizeVariable(value)
            : value;
    });

    return normalized;
};

///////////////  Valida por valor (vacio)
export const isEmptyValue = (value) => value === null || value === undefined || value.toString().trim() === "";

///////////////  Valida objeto
export const hasEmptyFields = (obj) => Object.values(obj).some(v => isEmptyValue(v));

///////////////  Valida email
export const isValidEmail = (email) => /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);

///////////////  Valida números
export const isNumber = (value) => /^[0-9]+$/.test(value.toString().trim());


// export const hasEmptyRequired = (obj, fields) => fields.some(field => isEmptyValue(obj[field]));
// Ej:
/* const emptyField = hasEmptyRequired(addBuilding, [
    "address",
    "city",
    "province"
]); */