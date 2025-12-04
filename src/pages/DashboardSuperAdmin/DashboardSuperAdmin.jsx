
import './DashboardSuperAdmin.css'
import { BarChartComponent, DoughnutChartComponent, PieChartComponent } from './Charts/Charts';
import { useEffect, useState } from 'react';
import { dashboard } from '../../services/root';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';
import { userData } from '../../app/slices/userSlice';

export const DashboardSuperAdmin = () => {
    const navigate = useNavigate()
    const token = useSelector(userData).credentials.token || null;

    const [genderData, setGenderData] = useState([]);
    const [ageData, setAgeData] = useState([]);
    const [ageGroupData, setAgeGroupData] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);


    let decodificado = null;
    let isPermisionRoled = false;

    if (token) {
        try {
            decodificado = jwtDecode(token);
            isPermisionRoled = decodificado.roleName === 'superAdmin';

        } catch {
            isPermisionRoled = false;
        }
    }
    console.log("decodificado.roleName:", decodificado.roleName);
    console.log("isPermisionRoled:", isPermisionRoled);
    useEffect(() => {
        if (!token || !isPermisionRoled) {
            navigate("/");
        }

    }, [token, isPermisionRoled, navigate])


    useEffect(() => {

        if (!isPermisionRoled && !token) return;
        const fetchDashboard = async () => {
            try {
                const dashboardDatas = await dashboard.DashboardService(token)
                const data = dashboardDatas.data;

                setTotalUsers(data.totalUsersSystem);
                setGenderData(data.userGenderCount);
                setAgeData(data.usersForAge);
                setAgeGroupData(data.usersForAgeGroup);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        }
        if (token && isPermisionRoled) {
            fetchDashboard();
        }
    }, [token, isPermisionRoled]);

    // const chartData = {
    //     labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
    //     datasets: [
    //         {
    //             label: 'Meses',
    //             data: [245, 255, 400, 350],
    //             backgroundColor: ['#0f172a', '#22c55e', '#2563eb', '#d97706'],
    //             hoverOffset: 10,
    //         }
    //     ]
    // }

    // const gender = [
    //     { name: 'Hombre', value: 300 },
    //     { name: 'Mujer', value: 200 },
    // ];

    const genderChart = {
        labels: genderData.map(item => item.gender),
        datasets: [
            {
                label: 'Usuarios por género',
                data: genderData.map(item => Number(item.count)),
                backgroundColor: ['#0f172a', '#22c55e'],
            }
        ]
    };

    const ageGroupChart = {
        labels: ageGroupData.map(item => item.group_age),
        datasets: [
            {
                label: [`Total de usuarios ${totalUsers}`, `Usuarios por edad`],
                labele: 'Usuarios por grupo de edad',
                data: ageGroupData.map(item => Number(item.count)),
                backgroundColor: ['#0f172a', '#22c55e', '#2563eb', '#d97706'],
            }
        ]
    };

    const ageDataChart = {
        labels: ageData.map(item => item.age),
        datasets: [
            {
                label: 'Usuarios por edad',
                data: ageData.map(item => Number(item.count)),
                backgroundColor: ['#0f172a', '#22c55e', '#2563eb', '#d97706'],
            }
        ]
    }

    // const data = {
    //     labels: ['Hombres', 'Mujeres'],
    //     datasets: [
    //         {
    //             label: 'Usuarios',
    //             data: [25, 80],
    //             backgroundColor: ['#0f172a', '#22c55e'],
    //             hoverOffset: 10,
    //         },
    //     ],
    // };
    return (
        <div className="designDashboardSuperAdmin">
            <h1>Welcome to the Dash Board Page</h1>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '40px', padding: '10px' }}>

                <div style={{ width: "450px", }}>
                    <BarChartComponent data={ageGroupChart}/>
                </div>
                {/* <div style={{ width: "500px" }}>
                    <MyPieChart data={gender} />
                </div> */}
                <div style={{ width: "300px" }}>
                    <PieChartComponent data={genderChart} />
                </div>
                <div style={{ width: "400px" }}>
                    <DoughnutChartComponent data={ageDataChart} />
                </div>
            </div>
        </div>
    )
}