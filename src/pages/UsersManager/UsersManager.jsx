import { useSelector } from 'react-redux'
import './UsersManager.css'
import { useEffect, useState } from 'react'
import { reports, users } from '../../services/root'
import { userData } from '../../app/slices/userSlice'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Swal from 'sweetalert2'
import { CBotton, CInputBootstrap, CTableNormal } from '../../common/Componentes/Componentes'
import { convierte, formatDate, userIsActive } from '../../util/validation'
import { Register } from '../Register/Register'

export const UsersManager = () => {
    const navigate = useNavigate();
    const token = useSelector(userData).credentials.token || null;

    //////////////////////     Variables de estados
    const [listUsers, setListUsers] = useState([]);
    const [editUser, setEditUser] = useState([])
    const [editedData, setEditedData] = useState({
        id: "",
        name: "",
        lastName: "",
        date_born: "",
        gender: "",
        nationality: "",
        email: "",
        type_document: "",
        number_document: "",
        phone: "",
        special_situation: "",
        date_entry_apartment: "",
        building_id: "",
    })
    const [addUser, setAddUser] = useState({
        name: "",
        lastName: "",
        date_born: "",
        gender: "",
        nationality: "",
        email: "",
        type_document: "",
        number_document: "",
        phone: "",
        isActive: "",
        special_situation: "",
        date_entry_apartment: "",
        building_id: "",
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
    /*  const handleInputChangeAdd = (e) => {
         setAddUser(prevState => ({
             ...prevState,
             [e.target.name]: e.target.value
         }))
     } */

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
                if (Array.isArray(fetched.data)) {
                    // setListUsers(fetched.data)

                    const formatDataUser = fetched.data.map(user => ({
                        ...user,
                        date_born: formatDate(user.date_born),
                        date_entry_apartment: formatDate(user.date_entry_apartment),
                        last_login: formatDate(user.last_login),
                    }))
                    setListUsers(formatDataUser);

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

    //////////////////////     Update users
    const UpdateUser = async () => {
        if (!token || !isPermisionRoled) {
            Swal.fire("Acceso denegado", "No tienes permisos para actualizar usuario.", "error")
            return;
        }
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres actualizar este edificio?',
            icon: 'warning',
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: 'Sí, guardar',
            denyButtonText: "No guardar",
            cancelButtonText: "Cancelar",
            focusConfirm: false,
            allowEnterKey: false,
        })

        if (result.isConfirmed) {
            try {
                if (!editUser || !editedData[editUser]) {
                    Swal.fire("Error", "No hay datos para actualizar.", "error");
                    return;
                }

                const userData = editedData[editUser];

                const originalUser = listUsers.find(u => u.id === editUser);
                const newEmail = userData.email;

                if (newEmail !== originalUser.email) {
                    const emailExists = listUsers.some(
                        user => user.email === newEmail && user.id !== originalUser.id
                    );

                    if (emailExists) {
                        Swal.fire("Error", "Ya existe este Email.", "error");
                        return;
                    }
                }

                await users.rootUpdateUser(editUser, userData, token)

                setListUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id === editUser ? { ...user, ...userData } : user
                    )
                )
                toast.fire("¡se han guardado los cambios!", "", "success");

                setEditUser(null);
                setEditedData({});
            } catch (error) {
                console.error("Error al actualizar usuario:", error);
                Swal.fire('Error', error.message || 'Ha ocurrido un error al intentar actualizar usuario.', 'error');
            }
        } else if (result.isDenied) {
            Swal.fire("Puedes seguir editando.", "", "info");

        } else {
            setEditUser(null);
            setEditedData({});
        }
    }

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

    //////////////////////     Generete PDF users
    const usersPDF = async () => {
        try {
            const datosPDF = await reports.rootGetReportUsers(token)
            const url = window.URL.createObjectURL(datosPDF);
            const a = document.createElement("a");
            a.href = url;
            a.download = "usersInfo.pdf";
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log(error.message || "Error en generar PDF")
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
        { header: "Date born", accessor: "date_born", type: "date" },
        { header: "Gender", accessor: "gender" },
        { header: "Nationality", accessor: "nationality" },
        { header: "Type document", accessor: "type_document" },
        { header: "Number document", accessor: "number_document" },
        { header: "Special situation", accessor: "special_situation" },
        { header: "Date entry apartment", accessor: "date_entry_apartment", type: "date" },
        { header: "isActive", accessor: "isActive", render: row => userIsActive(row.isActive) },
        { header: "Buiding", accessor: "building_id" },
        { header: "Role", accessor: "role_id" },
        { header: "last Login", accessor: "last_login", type: "date" },
    ]

    return (
        <>
            <div className='usersDesign'>
                <h1>Wolcome to Users page</h1>
                <button type="button" className="btn btn-primary btn-addUser" data-bs-toggle="modal" data-bs-target="#openModalUsergManager">
                    {<span className="bi bi-arrows-fullscreen org-icon-btn-user">
                        <div className="marge-icon-btn-user" style={{ margin: "8px" }}> Adicionar edificio </div>
                    </span>}user
                </button>

                <CBotton
                    label={"PDF"}
                    type='button'
                    onClick={usersPDF}
                    customClass={""}

                />

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
                                        onClick={UpdateUser}
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

                {/* Modal Add */}
                <div className="modal fade" id="openModalUsergManager" data-bs-backdrop="static" data-bs-keyboard="false"
                    tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog" style={{ maxWidth: '900px', width: '100%' }}>
                        <div className="modal-content">
                            <div className="modal-header ">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Actualizar Edificio</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCancelEditTable}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-2 g-1">
                                    <Register />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={UpdateUser}>Guardar</button>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancelEditTable}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Update */}
                <div className="modal fade" id="modalEditBuild" data-bs-backdrop="static" data-bs-keyboard="false"
                    tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog" style={{ maxWidth: '900px', width: '100%' }}>
                        <div className="modal-content">
                            <div className="modal-header ">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Actualizar Edificio</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCancelEditTable}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-2 g-1">
                                    {Object.entries(addUser).map(([key], index) => (
                                        <div className='col' key={index}>
                                            <CInputBootstrap
                                                label={convierte(key)}
                                                type="text"
                                                name={key}
                                                placeholder=""
                                                value={editedData[editUser]?.[key] || ""}
                                                customClass="input-cardNormal-user"
                                                changeEmit={handleInputChangeEdid}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={UpdateUser}>Guardar</button>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancelEditTable}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

