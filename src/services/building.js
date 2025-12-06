const root = 'http://localhost:2025/api/buildings/'

////////////////   ROOT GET ALL BUILDING
export const rootAllBuildings = async (token) => {
    try {
        const response = await fetch(`${root}auth/admin/list`, {
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

////////////////   ROOT UPDATE BUILDING BY ID
export const rootUpdateBuild = async (id, dato, token) => {
    try {
        const response = await fetch(`${root}auth/admin/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dato)
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en actualizar edificio");
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message);
        }
        return data;

    } catch (error) {
        console.error("Error fetching buildings:", error.message);
        return { success: false, message: error.message };
    }
}

////////////////   ROOT DELETE BUILDING BY ID
export const rootDeleteBuilding = async (token, id) => {
    const options = {
        method: 'DELETE',
        headers: {
            'content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    try {
        const response = await fetch(`${root}auth/admin/delete/${id}`, options)
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Error en la eliminar edificio')
        }

        const data = await response.json()
        if (!data.success) {
            throw new Error(data.message);
        }

        return data
    } catch (error) {
        console.error("Error fetching buildings:", error.message);
        return { success: false, message: error.message };
    }
}