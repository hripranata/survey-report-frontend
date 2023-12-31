import axios from '../services/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useAuth } from "../context/Auth";
import Select from 'react-select'
import Swal from 'sweetalert2'
import TopLoadingBar from "../components/TopLoadingBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

export default function LoadingUpdate() {
    const navigate = useNavigate();
    const { auth, setProgress } = useAuth();
    const [vesselOption, setVesselOption] = useState([]);

    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        iconColor: 'white',
        customClass: {
          popup: 'colored-toast'
        },
        showConfirmButton: false,
        timer: 1250,
        timerProgressBar: true
    })

    // date & time format
    const [loDate, setLoDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [stopDate, setStopDate] = useState(new Date());
    const dateFormat = (date) => {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        
        if (day < 10) {
            day = `0${day}`;
        }
        
        if (month < 10) {
            month = `0${month}`;
        }
        
        return `${year}-${month}-${day}`;
    }
    const timeFormat = (date) => {
        let h = date.getHours()
        let m = date.getMinutes()

        if (h < 10) {
            h = `0${h}`;
        }
        
        if (m < 10) {
            m = `0${m}`;
        }

        return `${h}:${m}`;
    }

    const headers = {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : 'Bearer ' + auth.data.token
    }

    const { id } = useParams();

    const [rowsData, setRowsData] = useState([{
        lo_number: "",
        qty: 0,
    }]);

    const [formData, setFormData] = useState({
        loDate: dateFormat(loDate),
        tongkang_id: 0,
        bbm: "HSD",
        loadStartTime: timeFormat(startDate),
        loadStartDate: dateFormat(startDate),
        loadStopTime: timeFormat(stopDate),
        loadStopDate: dateFormat(stopDate),
        lo_details: [],
        loVol: 0,
        alVol: 0,
        surveyor: auth.data.user.name
    })

    const handleChangeDate = (name, value) => {
        setFormData((prevFormData) => ({ ...prevFormData, [name]: dateFormat(value) }));
    };

    const fetchLoadingById = async () => {
        await axios.get(`/api/loadings/${id}`, {
            headers: headers
        })
        .then((res) => {
            const loadingById = res.data.data;
            setFormData((prevFormData) => ({ 
                ...prevFormData, 
                loDate: loadingById.lo_date,
                tongkang_id: loadingById.tongkang.id,
                bbm: loadingById.bbm,
                loadStartTime: loadingById.start.split(' ')[1].substring(0,5),
                loadStartDate: loadingById.start.split(' ')[0],
                loadStopTime: loadingById.stop.split(' ')[1].substring(0,5),
                loadStopDate: loadingById.stop.split(' ')[0],
                lo_details: loadingById.lo_details,
                loVol: loadingById.vol_lo,
                alVol: loadingById.vol_al,
            }));
            setRowsData(loadingById.lo_details)
            setLoDate(new Date(loadingById.lo_date))
            setStartDate(new Date(loadingById.start))
            setStopDate(new Date(loadingById.stop))
        })
        .catch((err) => {
            console.error(err);
        })
    }

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
                id: row.id,
                lo_number: row.lo_number,
                qty: parseInt(row.qty)
            }
        })
    }

    const hanldeSubmit = async (event) => {
        event.preventDefault();

        const loadingData = {
            lo_date: formData.loDate,
            tongkang_id: formData.tongkang_id,
            bbm: formData.bbm,
            start: `${formData.loadStartDate} ${formData.loadStartTime}:00`,
            stop: `${formData.loadStopDate} ${formData.loadStopTime}:00`,
            lo_details: changeLoQtyType(formData.lo_details),
            vol_lo: formData.loVol,
            vol_al: parseInt(formData.alVol),
            // surveyor: auth.data.user.name
        }
    
        await axios.put(`/api/loadings/${id}`, loadingData, { headers: headers })
        .then(() => {
            Toast.fire({
                icon: 'success',
                title: 'Data successfully saved!'
              })
            navigate('/report');
        })
        .catch((err) => {
            console.error(err);
            Toast.fire({
                icon: 'error',
                title: 'Error saving data!'
              })
        })
    }

    // Vessel select option
    const handleTongkangList = async () => {
        await axios.get(`/api/vessels/filter/SPOB`, { headers: headers })
        .then((res) => {
            setVesselOption(changeSelectOption(res.data.data))
        })
        .catch((err) => {
            console.error(err);
        })
    }

    const changeSelectOption = (rows) => {
        return rows.map(row => {
            return {
                value: row.id,
                vessel_name: row.vessel_name
            }
        })
    }

    const handleChangeVessel = (selectedOption) => {
        setFormData((prevFormData) => ({ 
            ...prevFormData,
            tongkang_id: selectedOption.value, 
        }));
    };

    const vessel_initial_option = () => {
        return vesselOption.filter((vsl) => vsl.value == formData.tongkang_id)
    }

    useEffect(() => {
        fetchLoadingById()
        handleTongkangList()
        setProgress(100)
    }, []);
    return(
        <>
        <TopLoadingBar/>
        <div className="container shadow-sm p-3 bg-body rounded">
            <div className="mb-3 mt-5 pt-4">
                <h1 className="text-center">Update Loading Report</h1>
            </div>
            <form className="row g-3" onSubmit={hanldeSubmit}>
                <div className="col-6 mb-3">
                    <label htmlFor="inputLODate" className="form-label">LO Date</label>
                        <DatePicker 
                            onFocus={e => e.target.blur()}
                            selected={loDate}
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                                setLoDate(date)
                                handleChangeDate('loDate', date)
                            }}
                            className="form-select"
                        />
                </div>
                <div className="col-12">
                        <Select
                            placeholder= "Pilih Tongkang"
                            name="tongkang_id"
                            value={vessel_initial_option()}
                            options={vesselOption}
                            getOptionLabel={(option) => `${option.vessel_name}`}
                            onChange={handleChangeVessel}
                            className="mb-3"
                        />
                </div>
                <div className="col-12">
                    <select className="mb-3 form-select" aria-label="BBM" name="bbm" value={formData.bbm} onChange={handleChange}>
                        <option value="HSD">HSD</option>
                        <option value="B35">B35</option>
                    </select>
                </div>
                <div className="col-12">
                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="inputStart" className="form-label">Loading Start</label>
                            <input type="time" className="form-control" name="loadStartTime" value={formData.loadStartTime} onChange={handleChange}></input>
                        </div>
                        <div className="col">
                            <label htmlFor="inputStartDate" className="form-label">Start Date</label>
                            <DatePicker 
                                onFocus={e => e.target.blur()}
                                selected={startDate}
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) => {
                                    setStartDate(date)
                                    handleChangeDate('loadStartDate', date)
                                }}
                                className="form-select" 
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <label htmlFor="inputStop" className="form-label">Loading Stop</label>
                            <input type="time" className="form-control" name="loadStopTime" value={formData.loadStopTime} onChange={handleChange}></input>
                        </div>
                        <div className="col">
                            <label htmlFor="inputStopDate" className="form-label">Stop Date</label>
                            <DatePicker 
                                onFocus={e => e.target.blur()}
                                selected={stopDate}
                                dateFormat="dd/MM/yyyy"
                                onChange={(date) => {
                                    setStopDate(date)
                                    handleChangeDate('loadStopDate', date)
                                }}
                                className="form-select" 
                            />
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
                    <input type="text" className="form-control" name="loVol" value={formData.loVol} disabled></input>
                </div>
                <div className="col-12">
                    <label htmlFor="inputVolAl" className="form-label">AL / Volume Tongkang</label>
                    <input type="text" className="form-control" name="alVol" value={formData.alVol} onChange={handleChange}></input>
                </div>
                <div className="col-12 mb-3">
                    <label htmlFor="inputPetugas" className="form-label">Surveyor</label>
                    <input type="text" className="form-control" name="surveyor" value={formData.surveyor} disabled></input>
                </div>
                <div className="col-12 mb-3">
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary">Update</button>
                    </div>
                </div>
            </form>
        </div>
        </>
    )
}