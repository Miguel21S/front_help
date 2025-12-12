import './BuildindsManager.css'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { userData } from "../../app/slices/userSlice";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { buildings } from "../../services/root";
import { CBotton, CInputBootstrap, CTableNormal } from "../../common/Componentes/Componentes";
import Swal from 'sweetalert2';
import { convierte, formatDate, hasEmptyFields, normalizeVariable } from '../../util/validation';

export const BuildingsManager = () => {
    const navigate = useNavigate();
    const token = useSelector(userData).credentials.token || null

    //////////////////////     Variables de estados
    const [listBuildings, setListBuildings] = useState([])
    const [editBuild, setEditBuild] = useState([])
    const [editedData, setEditedData] = useState({
        id: "true",
        address_1: "true",
        address_2: "true",
        country: "true",
        province: "true",
        city: "true",
        postal_code: "true",
        build_type: "true",
        quantity_apartment: "true",
        floor_number: "true",
        last_maintenance: "true",
        general_status: "true",
        services_available: "true",
    })
    const [addBuilding, setAddBuilding] = useState({
        address_1: "",
        address_2: "",
        country: "",
        province: "",
        city: "",
        postal_code: "",
        build_type: "",
        last_maintenance: "",
        quantity_apartment: "",
        floor_number: "",
        services_available: "",
        general_status: ""
    })

    let decodificado = null;
    let isPermisionRoled = false;

    if (token) {
        try {
            decodificado = jwtDecode(token);
            isPermisionRoled = decodificado.roleName === "superAdmin";

        } catch {
            isPermisionRoled = false
        }
    }

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

    useEffect(() => {
        if (!token || !isPermisionRoled) {
            navigate('/')
            return;
        }
    }, [token, isPermisionRoled, navigate])

    const [page, setPage] = useState(1);
    const [rowsPage] = useState(10);
    const maxPageNumbers = 10;

    const handlerChangePage = (e) => {
        setPage(e)
    }
    //////////////////////     State for input
    const handelModalAdd = (e) => {
        const { name, value } = e.target;
        setAddBuilding(prevStat => ({
            ...prevStat,
            [name]: value
        }))
    }

    //////////////////////     State for btn
    const handleInputEditChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prevStat => ({
            ...prevStat,
            [editBuild]: {
                ...prevStat[editBuild],
                [name]: value,
            }
        }))
    }

    //////////////////////     State for button in table
    const handleEditModalBtnTable = (rowId) => {
        setEditBuild(rowId);

        const selectedBuild = listBuildings.find(i => i.id === rowId)
        setEditedData(prevStat => ({
            ...prevStat,
            [rowId]: { ...selectedBuild }
        }));
    }

    //////////////////////     State for button in table
    const handleCancelEditTable = () => {
        setEditBuild(null)
        setEditedData({})
    }

    //////////////////////     List buildings
    useEffect(() => {

        if (!isPermisionRoled || !token) return;
        const listAllBuild = async () => {
            try {
                const fetchedBuildings = await buildings.rootAllBuildings(token);
                if (Array.isArray(fetchedBuildings.data)) {
                    const formatDataBuil = fetchedBuildings.data.map(build => ({
                        ...build,
                        last_maintenance: formatDate(build.last_maintenance)
                    }))
                    setListBuildings(formatDataBuil)

                } else {
                    console.error("Los datos no son array")
                    setListBuildings([])
                }
            } catch (error) {
                console.log(error.message || "Error en jsx")
            }
        }
        listAllBuild();

    }, [token, isPermisionRoled])

    //////////////////////     Add build
    const addBuild = async () => {
        if (!isPermisionRoled || !token) {
            Swal.fire("Acceso denegado", "No tienes permisos para adicionar edificio.", "error")
            return;
        }

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres adicionar este edificio?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: "Cancelar",
            focusConfirm: false,
            allowEnterKey: false
        })
        if (!result.isConfirmed) {
            setEditBuild(null);
            setEditedData({});
            return;
        }

        try {
            const emptyField = hasEmptyFields(addBuilding)
            if (emptyField) {
                Swal.fire("Debes rellenar todos los campos", "", "warning");
                return;
            }

            const fields = ["address", "number_build", "postal_code", "city", "province"];

            const existBuild = listBuildings
                .filter(build => build.id !== editBuild)
                .some(build =>
                    fields.every(field =>
                        normalizeVariable(build[field]) === normalizeVariable(addBuilding[field])
                    )
                );

            if (existBuild) {
                Swal.fire("Error", "País, Provincia, Código Postal, Ciudad, Nº de Edificio. Esta dirección ya existe en la base de dato.", "error")
                return;
            }

            const createBuild = await buildings.rootAddBuildings(addBuilding, token)

            if (!createBuild.success) {
                Swal.fire("Error", createBuild.message || "No se pudo adicionar el edificio", "error");
                return;
            }

            setAddBuilding({
                address_1: "",
                address_2: "",
                country: "",
                province: "",
                city: "",
                postal_code: "",
                build_type: "",
                last_maintenance: "",
                quantity_apartment: "",
                floor_number: "",
                services_available: "",
                general_status: ""
            })

            const reloadListBuilding = await buildings.rootAllBuildings(token);
            if (reloadListBuilding.data && Array.isArray(reloadListBuilding.data)) {
                setListBuildings(reloadListBuilding.data);
            } else {
                console.error("Datos recibidos no son un array");
                setListBuildings([]);
            }
            toast.fire("¡se han adicionado el edificio!", "", "success");

        } catch (error) {
            console.error("Error en adicionar edificio:", error);
            Swal.fire('Error', error.message || 'Ha ocurrido un error al intentar adicionar edificio.', 'error');
        }
    }

    //////////////////////     Update build
    const updateBuildings = async () => {
        if (!isPermisionRoled || !token) {
            Swal.fire("Acceso denegado", "No tienes permisos para actualizar edificio.", "error");
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
                if (!editBuild || !editedData[editBuild]) {
                    Swal.fire("Error", "No hay datos para actualizar.", "error");
                    return;
                }

                const buidingData = editedData[editBuild];


                const fields = ["address", "number_build", "postal_code", "city", "province"];
                const existBuild = listBuildings
                    .filter(build => build.id !== editBuild)
                    .some(build =>
                        fields.every(field =>
                            normalizeVariable(build[field]) === normalizeVariable(buidingData[field])
                        )
                    );

                if (existBuild) {
                    Swal.fire("Error", "Ya existe un edificio con esta dirección. País, Provincia, Código Postal, Ciudad, Nº de Edificio.", "error")
                    return;
                }
                await buildings.rootUpdateBuild(editBuild, buidingData, token);

                setListBuildings(prevBuildings =>
                    prevBuildings.map(build =>
                        build.id === editBuild ? { ...build, ...buidingData } : build
                    )
                )
                toast.fire("¡se han guardado los cambios!", "", "success");

                setEditBuild(null);
                setEditedData({});
            } catch (error) {
                console.error("Error al actualizar edificio:", error);
                Swal.fire('Error', error.message || 'Ha ocurrido un error al intentar actualizar edificio.', 'error');
            }
        } else if (result.isDenied) {
            Swal.fire("Puedes seguir editando.", "", "info");

        } else {
            setEditBuild(null);
            setEditedData({});
        }
    }

    //////////////////////     Delete build
    const deleteBuild = async (id_build) => {
        if (!isPermisionRoled || !token) {
            Swal.fire("Acceso denegado", "No tienes permisos para eliminar edificio.", "error")
            return;
        }

        try {
            const fetchedBuildings = await buildings.rootDeleteBuilding(token, id_build);

            if (!fetchedBuildings.success) {
                throw new Error(fetchedBuildings.message || "No se pudo eliminar el edificio.", "error")
            }

            const rechargeFetchedBuildings = await buildings.rootAllBuildings(token);
            if (!rechargeFetchedBuildings.success || !Array.isArray(rechargeFetchedBuildings.data)) {
                setListBuildings([]);
                return;
            }

            const newList = rechargeFetchedBuildings.data;
            const maxPages = Math.ceil(newList.length / rowsPage);

            if (page > maxPages) {
                setPage(maxPages);
            }
            setListBuildings(newList);

        } catch (error) {
            console.error("Error al eliminar building:", error);
            Swal.fire('Error', error.message || 'Ha ocurrido un error al intentar eliminar el building.', 'error');
        }
    }

    //////////////////////     Pagination
    const paginatedData = listBuildings.slice(
        (page - 1) * rowsPage,
        (page - 1) * rowsPage + rowsPage
    )

    const totalPages = Math.ceil(listBuildings.length / rowsPage);
    const currentBlock = Math.ceil(page / maxPageNumbers);
    const startPage = (currentBlock - 1) * maxPageNumbers + 1;
    const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages)

    //////////////////////     Title table
    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Address 1", accessor: "address_1" },
        { header: "Address 2", accessor: "address_2" },
        { header: "Country", accessor: "country" },
        { header: "Province", accessor: "province" },
        { header: "City", accessor: "city" },
        { header: "Postal code", accessor: "postal_code" },
        { header: "Build type", accessor: "build_type" },
        { header: "Quantity apartment", accessor: "quantity_apartment" },
        { header: "Last Maintenance", accessor: "last_maintenance", type: "date" },
        { header: "General Status", accessor: "general_status" },
        { header: "Services Available", accessor: "services_available" },
        { header: "Floor Number", accessor: "floor_number" },
    ]

    return (
        <>
            <div className="buildingDesign">
                <h1>BUILDINGS</h1>

                {/* Element table */}
                <CTableNormal columns={columns}
                    data={paginatedData}
                    editRowId={""}
                    editedData={""}
                    handleInputChange={handleInputEditChange}
                    renderActions={(row) => (
                        <div className='row'>
                            {"editBuild" === row.id ? (
                                <>
                                    <CBotton
                                        onClick={updateBuildings}
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
                                        onClick={() => handleEditModalBtnTable(row.id)}
                                    >
                                        <i className="bi bi-feather"></i>
                                    </button>
                                    <CBotton
                                        label={<i className="bi bi-trash3"></i>}
                                        type="button"
                                        customClass="btn-danger btn-table-listBuilding"
                                        onClick={() => deleteBuild(row.id)}
                                    />
                                </>
                            )
                            }
                        </div>
                    )}
                />
            </div>
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

            <button type="button" className="btn btn-primary btn-addBulding" data-bs-toggle="modal" data-bs-target="#openModalBuildingManager">
                {<span className="bi bi-arrows-fullscreen org-icon-btn-build">
                    <div className="marge-icon-btn-build" style={{ margin: "8px" }}> Adicionar edificio </div>
                </span>}
            </button>
            {/* <!-- Modal AddBuild--> */}
            <div className="modal fade" id="openModalBuildingManager" data-bs-backdrop="static" data-bs-keyboard="false"
                tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog " style={{ maxWidth: '900px', width: '100%' }}>
                    <div className="modal-content d-flex">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 " id="staticBackdropLabel">Adicionar Edificio</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-2 g-1">
                                {Object.keys(addBuilding).map((key, index) => (
                                    <div className='col' key={index}>
                                        <CInputBootstrap
                                            label={convierte(key)}
                                            type="text"
                                            name={key}
                                            placeholder=""
                                            value={addBuilding[key]}
                                            customClass="input-cardNormal-building"
                                            changeEmit={handelModalAdd}
                                        />
                                    </div>
                                ))}
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary btn-cardNormal-building" onClick={addBuild}>Guardar</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
                                {Object.entries(addBuilding).map(([key], index) => (
                                    <div className='col' key={index}>
                                        <CInputBootstrap
                                            label={convierte(key)}
                                            type="text"
                                            name={key}
                                            placeholder=""
                                            value={editedData[editBuild]?.[key] || ""}
                                            customClass={"input-cardNormal-building"}
                                            changeEmit={handleInputEditChange}
                                        />
                                    </div>
                                ))}
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={updateBuildings}>Guardar</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancelEditTable}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}