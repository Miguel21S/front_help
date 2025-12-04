
import './DashboardSuperAdmin.css'
import { BarChartComponent, LineChartComponent, DoughnutChartComponent, PieChartComponent } from './Charts/Charts';
import { useEffect, useState } from 'react';
import { dashboard } from '../../services/root';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';
import { userData } from '../../app/slices/userSlice';

export const DashboardSuperAdmin = () => {
    const navigate = useNavigate()
    const token = useSelector(userData).credentials.token || null;

    const [totalUsers, setTotalUsers] = useState(0);
    const [genderData, setGenderData] = useState([]);
    const [ageData, setAgeData] = useState([]);
    const [ageGroupData, setAgeGroupData] = useState([]);
    const [usersForRolData, setUsersForRolData] = useState([]);
    const [usersAgeGenderData, setUsersAgeGenderData] = useState([]);
    const [usersNationalityData, setUsersNationalityData] = useState([]);

    const [dashboardData, setDashboardData] = useState(null);


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

    useEffect(() => {
        if (!token || !isPermisionRoled) {
            navigate("/");
        }

    }, [token, isPermisionRoled, navigate])


    useEffect(() => {

        if (!isPermisionRoled && !token) return;
        const fetchDashboard = async () => {
            try {
                const dashboardDatas = await dashboard.rootDashboard(token)
                const data = dashboardDatas.data;
                setDashboardData(data);

                setTotalUsers(data.totalUsersSystem);
                setGenderData(data.userGenderCount);
                setAgeData(data.usersForAge);
                setAgeGroupData(data.usersForAgeGroup);
                setUsersForRolData(data.totalUsersForRol);
                setUsersAgeGenderData(data.usersForAgeAndGenderGroup);
                setUsersNationalityData(data.usersForNationality);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        }
        if (token && isPermisionRoled) {
            fetchDashboard();
        }
    }, [token, isPermisionRoled]);

    // const gender = [
    //     { name: 'Hombre', value: 300 },
    //     { name: 'Mujer', value: 200 },
    // ];

    const randomColor = (index) => `hsl(${index * 50}, 70%, 50%)`;
    const generateColors = (length) =>
        Array.from({ length }, (_, i) => randomColor(i));


    const ageGroupChart = {
        labels: ageGroupData?.map(item => item.group_age) || [],
        datasets: [
            {
                label: [`Usuarios por edad`],
                data: ageGroupData?.map(item => Number(item.count)) || [],
                backgroundColor: generateColors(ageGroupData?.length || 0),
            }
        ]
    };

    const genderChart = {
        labels: genderData.map(item => item.gender) || [],
        datasets: [
            {
                label: 'Usuarios por género',
                data: genderData?.map(item => Number(item.count)) || [],
                backgroundColor: generateColors(genderData?.length || 0),
            }
        ]
    };

    const ageDataChart = {
        labels: ageData?.map(item => item.age) || [],
        datasets: [
            {
                label: 'Usuarios por edad',
                data: ageData?.map(item => Number(item.count)) || [],
                backgroundColor: generateColors(ageData?.length || 0),
            }
        ]
    }

    const roleDataChart = {
        labels: usersForRolData?.map(item => item.roleName) || [],
        datasets: [
            {
                label: ['Total de usuarios por rol'],
                data: usersForRolData?.map(item => Number(item.count)) || [],
                backgroundColor: generateColors(usersForRolData?.length || 0),
            }
        ]
    }

    const nationalityDataChart = {
        labels: usersNationalityData?.map(item => item.nationality) || [],
        datasets: [
            {
                label: ['Total de usuarios por nacionalidad'],
                data: usersNationalityData?.map(item => Number(item.count)) || [],
                backgroundColor: generateColors(usersNationalityData?.length || 0),
            }
        ]
    }

    const ageGroups = [...new Set(usersAgeGenderData?.map(i => i.group_age))];
    const genders = [...new Set(usersAgeGenderData?.map(i => i.gender))];
    const genderColors = generateColors(genders.length);

    const datasets = genders.map((gender, index) => ({
        label: gender,
        backgroundColor: genderColors[index],
        data: ageGroups.map(
            age =>
                Number(
                    usersAgeGenderData.find(
                        item => item.group_age === age && item.gender === gender
                    )?.count || 0
                )
        ),
    }));
    const AgeGenderDataChart = {
        labels: ageGroups,
        datasets: datasets
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
        },
        scales: {
            x: { stacked: true },
            y: { stacked: true },
        },
    };

    return (
        <div className="designDashboardSuperAdmin">
            <h1>Welcome to the Dash Board Page</h1>
            <h2>Total Users in the System: {totalUsers}</h2>
            <div class="container text-center">
                <div className="row">
                    <div className="col-6 col-sm-4">
                        <div className='card text-bg-dark mb-3' style={{ maxWidth: '20rem' }}>
                            <div style={{ width: "300px", }}>
                                <BarChartComponent data={ageGroupChart} />
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-sm-4">
                        <div className='card text-bg-dark mb-3' style={{ maxWidth: '20rem' }}>
                            <div style={{ width: "300px" }}>
                                <DoughnutChartComponent data={genderChart} />
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-sm-4">
                        <div className='card text-bg-dark mb-3' style={{ maxWidth: '20rem' }}>
                            <div style={{ width: "280px" }}>
                                <LineChartComponent data={ageDataChart} />
                            </div>
                        </div>
                    </div>

                    {/* <!-- Force next columns to break to new line at md breakpoint and up --> */}
                    <div className="w-100 d-none d-md-block"></div>

                    <div className="col-6 col-sm-4">
                        <div className='card text-bg-dark mb-3' style={{ maxWidth: '20rem' }}>
                            <div style={{ width: "300px" }}>
                                <DoughnutChartComponent data={roleDataChart} />
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-sm-4">
                        <div className='card text-bg-dark mb-3' style={{ maxWidth: '20rem' }}>
                            <div style={{ width: "300px" }}>
                                <BarChartComponent data={nationalityDataChart} />
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-sm-4">
                        <div className='card text-bg-dark mb-3' style={{ maxWidth: '22rem' }}>
                            <div style={{ width: "300px" }}>
                                <BarChartComponent data={AgeGenderDataChart} options={options} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* <div className='row row-cols-1 row-cols-md-2 row-cols-xl-2 g-1'>
                <div className=' ' style={{ display: 'flex', alignItems: 'center', gap: '40px', padding: '10px' }}> */}

        </div>
    )
}