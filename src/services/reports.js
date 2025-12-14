const root = 'http://localhost:2025/api/';

export const rootGetReportUsers = async (token) => {
    try {
        const response = await fetch(`${root}users/auth/admin/list?pdf=true`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const blob = await response.blob();
        return blob;
    } catch (error) {
        throw new Error(error.message || 'Something went wrong while fetching PDF users')

    }
}