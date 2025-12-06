import './Buildinds.css'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { userData } from "../../app/slices/userSlice";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { buildings } from "../../services/root";
import { CBotton, CTableNormal } from "../../common/Componentes/Componentes";
import Swal from 'sweetalert2';


export const Buildings = () => {
    const navigate = useNavigate();
    const token = useSelector(userData).credentials.token || null

    const [listBuildings, setListBuildings] = useState([])
    const [editedData, setEditedData] = useState([])

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
    // const handleInput = (e) => {
    //     const { name, value } = e.target;
    //     setEditedData(prevStat => ({
    //         ...prevStat,
    //         [__a]: {
    //             prevStat(__a),
    //             [name]: value,
    //         }
    //     }))
    // }

    //////////////////////     List buiding
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

    //////////////////////     List buiding
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

                {/* element table */}
                <CTableNormal columns={columns}
                    data={paginatedData}
                    editRowId={""}
                    editedData={""}
                    handleInputChange={""}
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
                                        // onClick={() => handleCancelEdit()}
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
                                    // onClick={() => handleEditModal(row.id)}
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
        </>
    )
}