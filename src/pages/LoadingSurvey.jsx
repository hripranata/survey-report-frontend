import { useState, useEffect, useRef } from "react"
import axios from '../services/axios';
import { useAuth } from "../context/Auth";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'
import Swal from 'sweetalert2'
import TopLoadingBar from "../components/TopLoadingBar";

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

export default function LoadingSurvey() {
    const { auth, setProgress } = useAuth();
    const navigate = useNavigate();
    const [vesselOption, setVesselOption] = useState([]);
    const [rowsData, setRowsData] = useState([{
        lo_number: "",
        qty: 0,
    }]);

    // self click button
    const buttonRef = useRef(null);

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

    const headers = {
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : 'Bearer ' + auth.data.token
    }

    const [formData, setFormData] = useState({
        loDate: datetimeNowID(0),
        tongkang_id: 0,
        bbm: "HSD",
        loadStartTime: datetimeNowID(1),
        loadStartDate: datetimeNowID(0),
        loadStopTime: datetimeNowID(1),
        loadStopDate: datetimeNowID(0),
        lo_details: [],
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
        // formData.lo_details = rows
        // formData.loVol = sumQty(rows)
        setFormData((prevFormData) => ({ 
            ...prevFormData, 
            lo_details: rows,
            loVol: sumQty(rows),
        }));
    }

    const handleChangeTable = (index, evnt) => {
        const { name, value } = evnt.target;
        const rowsInput = [...rowsData];
        rowsInput[index][name] = value;
        setRowsData(rowsInput);
        // formData.lo_details = rowsInput
        // formData.loVol = sumQty(rowsInput)
        setFormData((prevFormData) => ({ 
            ...prevFormData, 
            lo_details: rowsInput,
            loVol: sumQty(rowsInput),
        }));
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
            tongkang_id: formData.tongkang_id,
            bbm: formData.bbm,
            start: `${formData.loadStartDate} ${formData.loadStartTime}:00`,
            stop: `${formData.loadStopDate} ${formData.loadStopTime}:00`,
            lo_details: changeLoQtyType(formData.lo_details),
            vol_lo: formData.loVol,
            vol_al: parseInt(formData.alVol),
            // surveyor: auth.data.user.name
        }
    
        await axios.post(`/api/loadings`, loadingData, { headers: headers })
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

    // ibunker webscrape
    const initial_scrape = {
        data: [],
        status: null
    }
    const [loadingScrape, setLoadingScrape] = useState(
        {
            data: [],
            status: null
        }
    )

    const addFromScrape = async () => {
        setLoadingScrape(loadingScrape)
        await axios.get('http://localhost:3500/api/ibunker', { headers: headers })
        .then((res) => {
            if (res.data.vessel_queue.length > 0) {
                // setLoadingScrape(res.data.vessel_queue)
                setLoadingScrape((prev) => ({ 
                    ...prev,
                    data: res.data.vessel_queue,
                    status: 1 
                }));
            } else {
                // setLoadingScrape([{ data: 0}])
                setLoadingScrape((prev) => ({ 
                    ...prev,
                    data: [],
                    status: 0 
                }));
            }
        })
        .catch((err) => {
            console.error(err);
            setLoadingScrape((prev) => ({ 
                ...prev,
                data: [],
                status: -1
            }));
        })
    }

    const changeLoQtyTypeScrape = (rows) => {
        return rows.map(row => {
            return {
                lo_number: row.lo_number,
                qty: parseInt(row.qty) * 1000
            }
        })
    }

    const clearScrape = () => {
        setLoadingScrape(initial_scrape)
    }

    const handleSaveScrape = (scraped) => {
        setFormData((prevFormData) => ({ 
            ...prevFormData, 
            lo_details: changeLoQtyTypeScrape(scraped.lo_number),
            loVol: parseInt(scraped.detail?.lo_volume.split(' ')[0]) * 1000,
        }));
        setRowsData(changeLoQtyTypeScrape(scraped.lo_number))
        buttonRef.current.addEventListener('click', clearScrape);
        buttonRef.current.click();
        Toast.fire({
            icon: 'success',
            title: 'Data successfully selected!'
          })
    }

    useEffect(() => {
        handleTongkangList()
        setProgress(100)
    }, []);
    return (
        <>
            <TopLoadingBar/>
            <div className="container shadow-sm p-3 bg-body rounded">
                <div className="mb-3 mt-5 pt-4">
                    <h1 className="text-center">Loading Survey Report</h1>
                </div>
                <form className="row g-3" onSubmit={hanldeSubmit}>
                    <div className="col-12 mb-3">
                        <label htmlFor="inputLODate" className="form-label">LO Date</label>
                        <input type="date" className="form-control" name="loDate" value={formData.loDate} onChange={handleChange}/>
                    </div>
                    <div className="col-12">
                        <Select
                            placeholder= "Pilih Tongkang"
                            name="tongkang_id"
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
                                    <th className="align-middle" width="100px">
                                        <button type="button" className="btn btn-sm btn-primary me-2" data-bs-toggle="modal" data-bs-target="#loDetailLoadingModal" onClick={addFromScrape}>iB</button>
                                        <button type="button" className="btn btn-sm btn-success" onClick={addTableRows}>+</button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <TableRows rowsData={rowsData} deleteTableRows={deleteTableRows} handleChange={handleChangeTable} />
                            </tbody>
                        </table>
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputVolLo" className="form-label">Volume LO</label>
                        <input type="text" className="form-control" name="loVol" value={formData.loVol} disabled/>
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
            <div className="modal fade" id="loDetailLoadingModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="loDetailLoadingModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="loDetailLoadingModalLabel">iBunker Loading</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={buttonRef} onClick={()=>clearScrape()}></button>
                    </div>
                    <div className="modal-body">
                        <div className="accordion" id="accordionExample">
                            { loadingScrape?.status == 1 ?
                                loadingScrape?.data.map((loading, index) => (
                                    
                                    <div className="accordion-item" key={index}>
                                        <h2 className="accordion-header">
                                        <button className={`accordion-button ${index == 0?'':'collapsed'}`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded={index == 0?"true":"false"} aria-controls={`collapse${index}`}>
                                            {loading.spob} / {loading.detail?.produk} - {loading.detail?.lo_volume} / {loading.detail?.status}
                                        </button>
                                        </h2>
                                        <div id={`collapse${index}`} className={`accordion-collapse collapse ${index == 0?'show':''}`} data-bs-parent="#accordionExample">
                                            <div className="accordion-body">
                                            <table className="table table-bordered mb-2 text-center">
                                                <thead>
                                                    <tr>
                                                        <th>LO</th>
                                                        <th>QTY</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {loading.lo_number?.map((lo, index) => (
                                                    <tr key={index}>
                                                        <td>{lo.lo_number}</td>
                                                        <td>{parseInt(lo.qty) * 1000}</td>
                                                    </tr>
                                                ))}
                                                    <tr>
                                                        <td className="text-end">Total</td>
                                                        <td>{parseInt(loading.detail?.lo_volume.split(' ')[0]) * 1000}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <div className="text-end">
                                                <button type="button" className="btn btn-primary" onClick={()=> handleSaveScrape(loading)}>Select</button>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                                : loadingScrape?.status == 0 ?
                                    <div className="alert alert-warning mb-0 text-center">
                                        Vessel Not Found !
                                    </div>   
                                : loadingScrape?.status == -1?
                                    <div className="alert alert-danger mb-0 text-center">
                                        Sorry, server is error !
                                    </div>  
                                :
                                    <div className="text-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                    {/* <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}