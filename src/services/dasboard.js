const root = 'http://localhost:2025/api/';

export const DashboardService = async(token) =>{
    try {
        const response = await fetch(`${root}users/auth/dashboard/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })

        if(!response.ok){
            throw new Error('Error fetching dashboard data');
        }

        const data = await response.json();
        if(!data.success){
            throw new Error(data.message || 'Failed to fetch dashboard data');
        }
        return data;

    } catch (error) {
        throw new Error(error.message || 'An unexpected error occurred');
    }
}