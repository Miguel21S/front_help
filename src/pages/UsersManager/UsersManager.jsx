import { useSelector } from 'react-redux'
import './UsersManager.css'
import { useEffect, useState } from 'react'
import { users } from '../../services/root'
import { userData } from '../../app/slices/userSlice'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Swal from 'sweetalert2'
import { CBotton, CTableNormal } from '../../common/Componentes/Componentes'

export const UsersManager = () => {
    const navigate = useNavigate();
    const token = useSelector(userData).credentials.token || null;

    //////////////////////     Variables de estados
    const [listUsers, setListUsers] = useState([]);
    const [addUser, setAddUser] = useState({})
    const [editUser, setEditUser] = useState([])
    const [editedData, setEditedData] = useState({
        id: "",
        name: "",
        lastName: "",
        date_born: "",
        gender: "",
        nationality: "",
        special_situation: "",
        phone: "",
        email: "",
        date_entry_apartment: "",
        building_id: ""
    })

    const [page, setPage] = useState(1);
    const [rowsPage] = useState(10);
    const maxPageNumbers = 10;

    //////////////////////     
    const handlerChangePage = (e) => {
        setPage(e)
    }

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
            navigate('/')
            return;
        }
    }, [token, isPermisionRoled, navigate])

    //////////////////////     sweetalert2
    const toast = Swal.mixin({
        toast: true,
        position: 'center',
        iconColor: 'white',
        customClass: {
            popup: 'colored-toast',
        },
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
    })

    //////////////////////     State for input
    const handleInputChangeAdd = (e) => {
        setAddUser(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    //////////////////////     State for btn
    const handleInputChangeEdid = (e) => {
        setEditedData(prevState => ({
            ...prevState,
            [editUser]: {
                ...prevState[editUser],
                [e.target.name]: e.target.value
            }
        }))
    }

    //////////////////////     State for button in table
    const handleEditBtnTable = (rowId) => {
        setEditUser(rowId);

        const selectUser = listUsers.find(i => i.id === rowId)
        setEditedData(prevState => ({
            ...prevState,
            [rowId]: { ...selectUser }
        }))
    }

    //////////////////////     State for button in table
    const handleCancelEditTable = () => {
        setEditUser(null)
        setEditedData({})
    }

    //////////////////////     List all users
    useEffect(() => {
        const listarU = async () => {
            try {
                const fetched = await users.rootListAllUsers(token)
                if (fetched.data && Array.isArray(fetched.data)) {
                    setListUsers(fetched.data)
                } else {
                    setListUsers([])
                    console.log("Los datos no son array")
                }

            } catch (error) {
                console.log(error.message || "Error en jsx")
            }
        }
        listarU()
    }, [token])

    //////////////////////     Delete users
    const deleteUser = async (id) => {
        if (!token || !isPermisionRoled) {
            Swal.fire("Acceso denegado", "No tienes permisos para eliminar usuario.", "error")
            return;
        }

        try {
            const fetchedUserDelete = await users.rootDeleteUser(id, token);

            if (!fetchedUserDelete.success) {
                throw new Error(fetchedUserDelete.message || "No se pudo eliminar usuario.", "error")
            }

            const reloadListUsers = await users.rootListAllUsers(token);
            if (!reloadListUsers.success || !Array.isArray(reloadListUsers.data)) {
                setListUsers([]);
                return;
            }

            const newList = reloadListUsers.data
            const maxPages = Math.ceil(newList.length / rowsPage)

            if (page > maxPages) {
                setPage(maxPages)
            }
            setListUsers(newList)
        } catch (error) {
            console.error("Error al eliminar building:", error);
            Swal.fire('Error', error.message || 'Ha ocurrido un error al intentar eliminar el building.', 'error');
        }
    }

    //////////////////////     Pagination
    const paginatedData = listUsers.slice(
        (page - 1) * rowsPage,
        (page - 1) * rowsPage + rowsPage
    )

    const totalPages = Math.ceil(listUsers.length / rowsPage);
    const currentBlock = Math.ceil(page / maxPageNumbers);
    const startPage = (currentBlock - 1) * maxPageNumbers + 1;
    const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages)

    //////////////////////     Title table
    const columns = [
        { header: "Id", accessor: "id" },
        { header: "Name", accessor: "name" },
        { header: "Last name", accessor: "lastName" },
        { header: "Email", accessor: "email" },
        { header: "Phone", accessor: "phone" },
        { header: "Date born", accessor: "date_born" },
        { header: "Gender", accessor: "gender" },
        { header: "Nationality", accessor: "nationality" },
        { header: "Special situation", accessor: "special_situation" },
        { header: "Date entry apartment", accessor: "date_entry_apartment" },
        { header: "Buiding", accessor: "building_id" },
        { header: "Role", accessor: "role_id" },
    ]

    return (
        <>
            <div className='usersDesign'>
                <h1>Wolcome to Users page</h1>
                <CTableNormal columns={columns}
                    data={paginatedData}
                    editRowId={""}
                    editedData={""}
                    handleInputChange={handleInputChangeEdid}
                    renderActions={(row) => (
                        <div className='row'>
                            {"editBuild" === row.id ? (
                                <>
                                    <CBotton
                                        // onClick={updateBuildings}
                                        label={<i className="bi bi-check2"></i>}
                                        customClass="btn-success btn-table-listBuilding"
                                    />
                                    <CBotton
                                        onClick={() => handleCancelEditTable()}
                                        label={<i className="bi bi-x"></i>}
                                        customClass="btn-secondary btn-table-listBuilding"
                                    />
                                </>
                            ) : (
                                <>
                                    <button
                                        className="btn btn-warning btn-table-listDisease"
                                        data-bs-toggle="modal"
                                        data-bs-target="#modalEditBuild"
                                        onClick={() => handleEditBtnTable(row.id)}
                                    >
                                        <i className="bi bi-feather"></i>
                                    </button>
                                    <CBotton
                                        label={<i className="bi bi-trash3"></i>}
                                        type="button"
                                        customClass="btn-danger btn-table-listBuilding"
                                        onClick={() => deleteUser(row.id)}
                                    />
                                </>
                            )
                            }
                        </div>
                    )}
                />
                <div className="content-pagination-building">
                    <nav>
                        <ul className='pagination justify-content-center mt-3'>
                            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                <button className='page-link' onClick={() => handlerChangePage(1)}>
                                    «
                                </button>
                            </li>
                            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                <button className='page-link' onClick={() => handlerChangePage(page - 1)}>
                                    ‹
                                </button>
                            </li>

                            {[...Array(endPage - startPage + 1)].map((_, index) => {
                                const pageNumber = startPage + index;
                                return (
                                    <li key={pageNumber} className={`page-item ${page === pageNumber ? "active" : ""}`}>
                                        <button className="page-link" onClick={() => handlerChangePage(pageNumber)}>
                                            {pageNumber}
                                        </button>
                                    </li>
                                );
                            })}

                            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => handlerChangePage(page + 1)}>
                                    ›
                                </button>
                            </li>
                            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => handlerChangePage(totalPages)}>
                                    »
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )
}

