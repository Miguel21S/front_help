const root = 'http://localhost:2025/api/'


////////////////   ROOT GET ALL BUILDING
export const rootAllBuildings = async (token) => {
    try {
        const response = await fetch(`${root}buildings/auth/admin/list`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en carregar lista de Residencias")
        }

        const data = await response.json();
        console.log('ANTES DEL DATA:', data)
        if (!data.success) {
            throw new Error(data.message);
        }
        console.log('DESPUES DEL DATA:', data)
        return data;
    } catch (error) {
        console.error("Error fetching buildings:", error.message);
        return { success: false, message: error.message };
    }
}