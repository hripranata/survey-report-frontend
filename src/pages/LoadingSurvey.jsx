import { useState } from "react"
import axios from "axios";
import { useAuth } from "../context/Auth";
import { useNavigate } from 'react-router-dom';

function TableRows({rowsData, deleteTableRows, handleChange}) {
    return (
        rowsData.map((data, index)=>{
            const {lo_number, qty } = data;
            return(
                <tr key={index}>
                    <td><input type="text" value={lo_number} onChange={(evnt)=>(handleChange(index, evnt))} name="lo_number" className="form-control"/></td>
                    <td><input type="number" min="0" value={qty}  onChange={(evnt)=>(handleChange(index, evnt))} name="qty" className="form-control"/> </td>
                    <td className="align-middle text-center"><button type="button" className="btn btn-sm btn-danger" onClick={()=>(deleteTableRows(index))}>x</button></td>
                </tr>
            )
        })
    )
}

export default function LoadingSurvey() {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [rowsData, setRowsData] = useState([{
        lo_number: "",
        qty: 0,
    }]);

    const datetimeNowID = (selector) => {
        const now = new Date()
        let datetime = now.toLocaleString('id-ID', {
            hour12: false, 
            hourCycle: 'h23',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })
        if (selector == 0) {
            return datetime.split(', ')[0].split("/").reverse().join("-")
        } else {
            return datetime.split(', ')[1].substring(0,5).replace(".",":")
        }
    }

    const [formData, setFormData] = useState({
        loDate: datetimeNowID(0),
        tongkang: "SPOB Kujang Jaya 1",
        bbm: "HSD",
        loadStartTime: datetimeNowID(1),
        loadStartDate: datetimeNowID(0),
        loadStopTime: datetimeNowID(1),
        loadStopDate: datetimeNowID(0),
        lo_detail: [],
        loVol: 0,
        alVol: 0,
        surveyor: auth.data.user.name
    })

    const sumQty = (rows) => {
        return rows.reduce((total, row) => {
            if(row.qty == ''){
                return total + 0 
            } 
            return total + parseInt(row.qty)
        }, 0)
    }

    const addTableRows = ()=> {
        const rowsInput={
            lo_number: '',
            qty: 0,
        }
        setRowsData([...rowsData, rowsInput])
    }

    const deleteTableRows = (index) => {
        const rows = [...rowsData];
        rows.splice(index, 1);
        setRowsData(rows);
        formData.lo_detail = rows
        formData.loVol = sumQty(rows)
    }

    const handleChangeTable = (index, evnt) => {
        const { name, value } = evnt.target;
        const rowsInput = [...rowsData];
        rowsInput[index][name] = value;
        setRowsData(rowsInput);
        formData.lo_detail = rowsInput
        formData.loVol = sumQty(rowsInput)
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const changeLoQtyType = (rows) => {
        return rows.map(row => {
            return {
                lo_number: row.lo_number,
                qty: parseInt(row.qty)
            }
        })
    }

    const hanldeSubmit = async (event) => {
        event.preventDefault();

        const loadingData = {
            lo_date: formData.loDate,
            tongkang: formData.tongkang,
            bbm: formData.bbm,
            start: `${formData.loadStartDate} ${formData.loadStartTime}:00`,
            stop: `${formData.loadStopDate} ${formData.loadStopTime}:00`,
            lo_number: changeLoQtyType(formData.lo_detail),
            vol_lo: formData.loVol,
            vol_al: parseInt(formData.alVol),
            // surveyor: auth.data.user.name
        }
        const headers = {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
            'Authorization' : 'Bearer ' + auth.data.token
        }
    
        const API_URL = "http://localhost:8000";
    
        await axios.post(`${API_URL}/api/loadings`, loadingData, { headers: headers })
        .then(() => {
            navigate('/report');
        })
        .catch((err) => {
            console.error(err);
        })
    }
    return (
        <>
            <div className="container">
                <div className="mb-3 mt-5 pt-4">
                    <h1 className="text-center">Loading Survey Report</h1>
                </div>
                <form className="row g-3" onSubmit={hanldeSubmit}>
                    <div className="col-12 mb-3">
                        <label htmlFor="inputLODate" className="form-label">LO Date</label>
                        <input type="date" className="form-control" name="loDate" value={formData.loDate} onChange={handleChange}/>
                    </div>
                    <div className="col-12">
                        <select className="mb-3 form-select" aria-label="Tongkang" name="tongkang" value={formData.tongkang} onChange={handleChange}>
                            <option value="SPOB Kujang Jaya 1">SPOB Kujang Jaya 1</option>
                            <option value="SPOB Kanaya Indah 99">SPOB Kanaya Indah 99</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <select className="mb-3 form-select" aria-label="BBM" name="bbm" value={formData.bbm} onChange={handleChange}>
                            <option value="HSD">HSD</option>
                            <option value="B30">B30</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <div className="row mb-3">
                            <div className="col">
                                <label htmlFor="inputStart" className="form-label">Loading Start</label>
                                <input type="time" className="form-control" name="loadStartTime" value={formData.loadStartTime} onChange={handleChange}/>
                            </div>
                            <div className="col">
                            <label htmlFor="inputStartDate" className="form-label">Start Date</label>
                                <input type="date" className="form-control" name="loadStartDate" value={formData.loadStartDate} onChange={handleChange}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="inputStop" className="form-label">Loading Stop</label>
                                <input type="time" className="form-control" name="loadStopTime" value={formData.loadStopTime} onChange={handleChange}/>
                            </div>
                            <div className="col">
                                <label htmlFor="inputStopDate" className="form-label">Stop Date</label>
                                <input type="date" className="form-control" name="loadStopDate" value={formData.loadStopDate} onChange={handleChange}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <table className="table">
                            <thead className="text-center">
                                <tr>
                                    <th colSpan="2">LO Number</th>
                                    <td className="align-middle"><button type="button" className="btn btn-sm btn-success" onClick={addTableRows}>+</button></td>
                                </tr>
                            </thead>
                            <tbody>
                                <TableRows rowsData={rowsData} deleteTableRows={deleteTableRows} handleChange={handleChangeTable} />
                            </tbody>
                        </table>
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputVolLo" className="form-label">Volume LO</label>
                        <input type="text" className="form-control" name="loVol" value={formData.loVol} onChange={handleChange}/>
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputVolAl" className="form-label">AL / Volume Tongkang</label>
                        <input type="text" className="form-control" name="alVol" value={formData.alVol} onChange={handleChange}/>
                    </div>
                    <div className="col-12 mb-3">
                        <label htmlFor="inputPetugas" className="form-label">Surveyor</label>
                        <input type="text" className="form-control" name="surveyor" value={formData.surveyor} disabled/>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-primary">Submit</button>  
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}