import { useState, useEffect } from "react"
import axios from '../services/axios';
import { useAuth } from "../context/Auth";
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import CreatableSelect from 'react-select/creatable';
import Swal from 'sweetalert2'
import TopLoadingBar from "../components/TopLoadingBar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const animatedComponents = makeAnimated();

export default function BunkerSurvey() {
    const { auth, setProgress } = useAuth();
    const navigate = useNavigate();
    const [tongkangOption, setTongkangOption] = useState([]);
    const [kriOption, setKriOption] = useState([]);
    const [loNumberOption, setloNumberOption] = useState([]);

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

    const [formData, setFormData] = useState({
        tongkang_id: 0,
        kri_id: 0,
        bunker_location: "",
        bbm: "HSD",
        bunkerStartTime: timeFormat(startDate),
        bunkerStartDate: dateFormat(startDate),
        bunkerStopTime: timeFormat(stopDate),
        bunkerStopDate: dateFormat(stopDate),
        lo_details: [],
        loVol: 0,
        arVol: 0,
        surveyor: auth.data.user.name
    })

    const handleChangeDate = (name, value) => {
        setFormData((prevFormData) => ({ ...prevFormData, [name]: dateFormat(value) }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const changeLoQtyType = (rows) => {
        return rows.map(row => {
            return {
                id: row.value,
                lo_number: row.lo_number,
                qty: parseInt(row.qty)
            }
        })
    }

    const hanldeSubmit = async (event) => {
        event.preventDefault();
        const bunkerData = {
            tongkang_id: formData.tongkang_id,
            kri_id: formData.kri_id,
            bunker_location: formData.bunker_location,
            bbm: formData.bbm,
            start: `${formData.bunkerStartDate} ${formData.bunkerStartTime}:00`,
            stop: `${formData.bunkerStopDate} ${formData.bunkerStopTime}:00`,
            lo_details: changeLoQtyType(formData.lo_details),
            vol_lo: formData.loVol,
            vol_ar: parseInt(formData.arVol),
            // surveyor: auth.data.user.name
        }
        
        await axios.post(`/api/bunkers`, bunkerData, { headers: headers })
        .then(() => {
            Toast.fire({
                icon: 'success',
                title: 'Data successfully saved!'
              })
            navigate('/report', {state: {report: 1}});
        })
        .catch((err) => {
            console.error(err);
            Toast.fire({
                icon: 'error',
                title: 'Error saving data!'
              })
        })
    }

    // Vessel Select Option
    const handleVesselList = async () => {
        await axios.get(`/api/vessels/filter/SPOB`, { headers: headers })
        .then((res) => {
            setTongkangOption(changeVesselOption(res.data.data))
        })
        .catch((err) => {
            console.error(err);
        })

        await axios.get(`/api/vessels/filter/KRI`, { headers: headers })
        .then((res) => {
            setKriOption(changeVesselOption(res.data.data))
        })
        .catch((err) => {
            console.error(err);
        })
    }

    const changeVesselOption = (rows) => {
        return rows.map(row => {
            return {
                value: row.id,
                vessel_name: row.vessel_name
            }
        })
    }
    const handleChangeTongkang = (selectedOption) => {
        setFormData((prevFormData) => ({ 
            ...prevFormData,
            tongkang_id: selectedOption.value,
        }));
        handleLoNumberList(selectedOption.value)
    };
    const handleChangeKri = (selectedOption) => {
        setFormData((prevFormData) => ({ 
            ...prevFormData,
            kri_id: selectedOption.value,
        }));
    };

    // LO Select Option
    const handleLoNumberList = async (tongkang_id) => {
        await axios.get(`/api/lodetails/filter/${tongkang_id}`, { headers: headers })
        .then((res) => {
            setloNumberOption(changeLoNumberOption(res.data.data))
        })
        .catch((err) => {
            console.error(err);
        })
    }

    const changeLoNumberOption = (rows) => {
        return rows.map(row => {
            return {
                value: row.id,
                lo_number: row.lo_number,
                product: row.product,
                qty: row.qty
            }
        })
    }

    const handleChangeLoNumber = (selectedOption) => {
        setFormData((prevFormData) => ({ 
            ...prevFormData,
            lo_details: selectedOption, 
            loVol: sumQty(selectedOption) 
        }));
    };

    const sumQty = (rows) => {
        return rows.reduce((total, row) => {
            if(row.qty == ''){
                return total + 0 
            } 
            return total + parseInt(row.qty)
        }, 0)
    }

    const bunkerLocationOptions = [
        {value: "JICT 2", label: "JICT 2"},
        {value: "Kolinlamil", label: "Kolinlamil"},
        {value: "Pondok Dayung", label: "Pondok Dayung"},
        {value: "Kade 100", label: "Kade 100"},
    ]

    const handleChangeBunkerLocation = (selectedOption) => {
        setFormData((prevFormData) => ({ 
            ...prevFormData,
            bunker_location: selectedOption.value, 
        }));
    };

    useEffect(() => {
        handleVesselList()
        setProgress(100)
    }, []);

    return (
        <>
            <TopLoadingBar/>
            <div className="container shadow-sm p-3 bg-body rounded">
                <div className="mb-3 mt-5 pt-4">
                    <h1 className="text-center">Bunker Survey Report</h1>
                </div>
                <form className="row g-3" onSubmit={hanldeSubmit}>
                    <div className="col-12">
                        <Select
                            placeholder= "Pilih Tongkang"
                            name="tongkang_id"
                            options={tongkangOption}
                            getOptionLabel={(option) => `${option.vessel_name}`}
                            onChange={handleChangeTongkang}
                            className="mb-3"
                        />
                    </div>
                    <div className="col-12">
                        <Select
                            placeholder= "Pilih KRI"
                            name="kri_id"
                            options={kriOption}
                            getOptionLabel={(option) => `${option.vessel_name}`}
                            onChange={handleChangeKri}
                            className="mb-3"
                        />
                    </div>
                    <div className="col-12 mb-3">
                        <CreatableSelect 
                            placeholder= "Pilih Lokasi Bunker"
                            name="bunker_location"
                            options={bunkerLocationOptions}
                            onChange={handleChangeBunkerLocation}
                        />
                    </div>
                    <div className="col-12">
                        <select className="mb-3 form-select" aria-label="BBM" name="bbm" value={formData.bbm} onChange={handleChange}>
                            <option value="HSD">HSD</option>
                            <option value="B30">B35</option>
                        </select>
                    </div>
                    <div className="col-12 mb-3">
                        <div className="row">
                            <div className="col">
                                <label htmlFor="inputStart" className="form-label">Bunker Start</label>
                                <input type="time" className="form-control" name="bunkerStartTime" value={formData.bunkerStartTime} onChange={handleChange}/>
                            </div>
                            <div className="col">
                                <label htmlFor="inputStartDate" className="form-label">Start Date</label>
                                <DatePicker 
                                    onFocus={e => e.target.blur()}
                                    selected={startDate}
                                    dateFormat="dd/MM/yyyy"
                                    onChange={(date) => {
                                        setStartDate(date)
                                        handleChangeDate('bunkerStartDate', date)
                                    }}
                                    className="form-select" 
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="inputStop" className="form-label">Bunker Stop</label>
                                <input type="time" className="form-control" name="bunkerStopTime" value={formData.bunkerStopTime} onChange={handleChange}/>
                            </div>
                            <div className="col">
                                <label htmlFor="inputStopDate" className="form-label">Stop Date</label>
                                <DatePicker 
                                    onFocus={e => e.target.blur()}
                                    selected={stopDate}
                                    dateFormat="dd/MM/yyyy"
                                    onChange={(date) => {
                                        setStopDate(date)
                                        handleChangeDate('bunkerStopDate', date)
                                    }}
                                    className="form-select" 
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <Select
                            placeholder= "Pilih LO Number"
                            components={animatedComponents}
                            name="lo_number"
                            isMulti
                            options={loNumberOption}
                            getOptionLabel={(option) => `${option.lo_number} : ${option.product} - ${option.qty} L`}
                            onChange={handleChangeLoNumber}
                            className="mb-3"
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputVolLo" className="form-label">Volume LO</label>
                        <input type="text" className="form-control" name="loVol" value={formData.loVol} disabled/>
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputVolAr" className="form-label">AR / Volume KRI</label>
                        <input type="text" className="form-control" name="arVol" value={formData.arVol} onChange={handleChange}/>
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