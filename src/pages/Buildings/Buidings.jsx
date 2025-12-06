import './Buildinds.css'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { userData } from "../../app/slices/userSlice";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { buildings } from "../../services/root";
import { CBotton, CInputBootstrap, CTableNormal } from "../../common/Componentes/Componentes";
import Swal from 'sweetalert2';
import { normalizeVariable } from '../../util/metodos';


export const Buildings = () => {
    const navigate = useNavigate();
    const token = useSelector(userData).credentials.token || null

    const [listBuildings, setListBuildings] = useState([])
    const [editBuild, setEditBuild] = useState([])
    const [editedData, setEditedData] = useState({
        id: "true",
        address: "true",
        number_build: "true",
        postal_code: "true",
        city: "true",
        province: "true",
        quantity_apartment: "true",
        build_type: "true",
        floor_number: "true",
    })

    const [addBuilding, setAddBuilding] = useState({})

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
                if (fetchedBuildings.success && Array.isArray(fetchedBuildings.data)) {
                    setListBuildings(fetchedBuildings.data)
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

                const existBuild = listBuildings.some(build =>
                    normalizeVariable(build.address) === normalizeVariable(buidingData.address) &&
                    normalizeVariable(build.number_build) === normalizeVariable(buidingData.number_build) &&
                    normalizeVariable(build.postal_code) === normalizeVariable(buidingData.postal_code) &&
                    normalizeVariable(build.city) === normalizeVariable(buidingData.city) &&
                    normalizeVariable(build.province) === normalizeVariable(buidingData.province) &&
                    normalizeVariable(build.id) !== normalizeVariable(editBuild)
                )
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

    const paginatedData = listBuildings.slice(
        (page - 1) * rowsPage,
        (page - 1) * rowsPage + rowsPage
    )

    const totalPages = Math.ceil(listBuildings.length / rowsPage);
    const currentBlock = Math.ceil(page / maxPageNumbers);
    const startPage = (currentBlock - 1) / maxPageNumbers + 1;
    const endPage = Math.min(startPage + maxPageNumbers - 1, totalPages)

    //////////////////////     Title table
    const columns = [
        { header: "ID", accessor: "id" },
        { header: "Address", accessor: "address" },
        { header: "Number", accessor: "number_build" },
        { header: "Country", accessor: "country" },
        { header: "Province", accessor: "province" },
        { header: "City", accessor: "city" },
        { header: "Postal code", accessor: "postal_code" },
        { header: "Build type", accessor: "build_type" },
        { header: "Quantity apartment", accessor: "quantity_apartment" },
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
                            <>
                                <div className="row">
                                    <div className='col'>
                                        <CInputBootstrap
                                            label="Dirección"
                                            type="address"
                                            name="address"
                                            placeholder=""
                                            value={editedData[editBuild]?.address || ""}
                                            customClass={"input-cardNormal-building"}
                                            changeEmit={handleInputEditChange}
                                        />
                                        <CInputBootstrap
                                            label="Código Posta"
                                            type="postal_code"
                                            name="postal_code"
                                            placeholder=""
                                            value={editedData[editBuild]?.postal_code || ""}
                                            customClass={"input-cardNormal-building"}
                                            changeEmit={handleInputEditChange}
                                        />
                                        <CInputBootstrap
                                            label="Provincia"
                                            type="province"
                                            name="province"
                                            placeholder=""
                                            value={editedData[editBuild]?.province || ""}
                                            customClass={"input-cardNormal-building"}
                                            changeEmit={handleInputEditChange}
                                        />
                                        <CInputBootstrap
                                            label="Total de apartamentos"
                                            type="Number"
                                            name="quantity_apartment"
                                            placeholder=""
                                            value={editedData[editBuild]?.quantity_apartment || ""}
                                            customClass={"input-cardNormal-building"}
                                            changeEmit={handleInputEditChange}
                                        />
                                    </div>
                                    <div className='col'>

                                        <CInputBootstrap
                                            label="Nº Edificio"
                                            type="number_build"
                                            name="number_build"
                                            placeholder=""
                                            value={editedData[editBuild]?.number_build || ""}
                                            customClass={"input-cardNormal-building"}
                                            changeEmit={handleInputEditChange}
                                        />
                                        <CInputBootstrap
                                            label="Ciudad"
                                            type="city"
                                            name="city"
                                            placeholder=""
                                            value={editedData[editBuild]?.city || ""}
                                            customClass={"input-cardNormal-building"}
                                            changeEmit={handleInputEditChange}
                                        />
                                        <CInputBootstrap
                                            label="Tipo de Edificio"
                                            type="build_type"
                                            name="build_type"
                                            placeholder=""
                                            value={editedData[editBuild]?.build_type || ""}
                                            customClass={"input-cardNormal-building"}
                                            changeEmit={handleInputEditChange}
                                        />
                                        <CInputBootstrap
                                            label="Nº Piso"
                                            type="Number"
                                            name="floor_number"
                                            placeholder=""
                                            value={editedData[editBuild]?.floor_number || ""}
                                            customClass={"input-cardNormal-building"}
                                            changeEmit={handleInputEditChange}
                                        />

                                    </div>
                                </div>
                            </>
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