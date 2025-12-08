const root = 'http://localhost:2025/api/users/'

////////////////   ROOT GET ALL LIST USERS
export const rootListAllUsers = async (token) => {
    try {
        const response = await fetch(`${root}auth/admin/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/josn',
                'Authorization': `Bearer ${token}`
            }
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Error en listar usuarios")
        }

        const data = await response.json()
        if (!data.success) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error("Error fetching users:", error.message);
        return { success: false, message: error.message };

    }
}

////////////////   ROOT UPDATE USER BY ID
export const rootUpdateUser = async (id, datos, token) => {
    try {
        const response = await fetch(`${root}auth/admin/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datos)
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Error en editar usuarios")
        }

        const data = await response.json()
        if (!data.success) {
            throw new Error(data.message);
        }
        return data;
        
    } catch (error) {
        console.error("Error fetching users:", error.message);
        return { success: false, message: error.message };

    }
}

////////////////   ROOT DELETE USER BY ID
export const rootDeleteUser = async (id, token) => {
    try {
        const response = await fetch(`${root}auth/admin/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/josn',
                'Authorization': `Bearer ${token}`
            },
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Error en eliminar usuarios")
        }

        const data = await response.json()
        if (!data.success) {
            throw new Error(data.message);
        }
        return data;

    } catch (error) {
        console.error("Error fetching users:", error.message);
        return { success: false, message: error.message };

    }
}

////////////////   ROOT COMPARE EMAIL
export const rootCompareEmail = async (email) => {
    try {
        const response = await fetch(`${root}auth/email?email=${decodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Error en eoncotrar email");
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message);
        }
        return data.exists;

    } catch (error) {
        console.error("Error fetching email:", error.message);
        return false;
    }
}

////////////////   ROOT COMPARING THE USER'S EMAIL ADDRESS BELONGS TO USER_ID WITH THE EMAIL RELATED TO THE DATA TO BE UPDATED
export const rootCheckEmailOfUser = async (id, inputEmail, token) => {
    try {
        const response = await fetch(`${root}auth/comapremail/user/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "No se pudo verificar el email")
        }

        const data = await response.json()
        const normalizedInput = inputEmail?.toLowerCase().trim();
        const normalizedData = data.email?.toLowerCase().trim();
        if (!data.success) {
            throw new Error(data.message)
        }

        return normalizedData === normalizedInput
    } catch (error) {
        console.error("Error en validar email:", error);
        return { success: false, message: error.message };
    }
}