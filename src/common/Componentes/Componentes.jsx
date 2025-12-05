import './Componentes.css'

//////////////////////////   Component Input
export const CInputBootstrap = ({ label, id, type, name, placeholder, value, changeEmit, customClass }) => {

    return (
        <div className="col-md-6">
            <div className="form-floating mb-3">
                <input
                    className={`form-control ${customClass}`}
                    type={type}
                    name={name}
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => changeEmit(e)}
                />

                <label
                    htmlFor={id}>
                    {label}
                </label>
            </div>
        </div>
    )
}

//////////////////////////   Component TextArea
export const CTextAreaBootstrap = ({ label, id, type, name, placeholder, value, changeEmit, customClass }) => {

    return (
        <div className="col-md-4" >
            <div className="form-floating mb-3">
                <textarea
                    className={`form-control component-txtarea ${customClass}`}
                    type={type}
                    name={name}
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => changeEmit(e)}
                />

                <label
                    htmlFor={id}>
                    {label}
                </label>
            </div>
        </div>
    )
}

//////////////////////////   Component Botton
export const CBotton = ({ label, onClick, type = "button", customClass, disabled = false, children, ...rest }) => {
    return (
        <button
            type={type}
            className={`btn-component btn ${customClass}`}
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </button>
    )
}

//////////////////////////   Component Selector  
export const CSelectorImage = ({ value, options = [], changeEmit, customClass }) => {
    return (
        <select
            className={`selector-design ${customClass}`}
            aria-label="Default select example"
            value={value}
            onChange={(e) => changeEmit(e)}
            name="gender"
        >
            <option value="" disabled>Seleccione Local</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    );
};

//////////////////////////   Componente Table
export const CTableNormal = ({ columns, data, customClass, renderActions }) => {
    return (
        <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table className={`table table-striped table-bordered table-complet ${customClass}`}>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index}>{column.header}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map((row) => (
                            <tr key={row.id}>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex}>
                                        {column.Cell
                                            ? column.Cell({ value: row[column.accessor], row })
                                            : column.render
                                                ? column.render(row)
                                                : row[column.accessor]}

                                    </td>
                                ))}
                                <td className='renderActionsBTN'>{renderActions(row)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length + 1} className="text-center">No hay datos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};