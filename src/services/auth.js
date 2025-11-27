
const root = 'http://localhost:2025/api/'

export const rootLogin = async(user) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    };

    try {
        const response = await fetch(`${root}auth/login`, options);
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la solicitud de login');
        }

        const data = await response.json();
        if(!data.success){
            throw new Error(data.message || 'Error en la respuesta de login');
        }
        return data;
    } catch (error) {
        throw new Error(error.message || 'Error de red o del servidor');
    
    }
}