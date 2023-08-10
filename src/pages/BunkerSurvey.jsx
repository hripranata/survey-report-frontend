import { useState } from "react"
// import axios from "axios";
import { useAuth } from "../context/Auth";
// import { useNavigate } from 'react-router-dom';
import Select from 'react-select'
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

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

export default function BunkerSurvey() {
    const { auth } = useAuth();
    // const navigate = useNavigate();



    const [formData, setFormData] = useState({
        tongkang: "",
        kri: "",
        bunker_location: "",
        bbm: "HSD",
        bunkerStartTime: datetimeNowID(1),
        bunkerStartDate: datetimeNowID(0),
        bunkerStopTime: datetimeNowID(1),
        bunkerStopDate: datetimeNowID(0),
        lo_number: [],
        loVol: 0,
        arVol: 0,
        surveyor: auth.data.user.name
    })

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const hanldeSubmit = async (event) => {
        event.preventDefault();
        console.log(formData);
    }

    const loNumberOptions = [
        { value: 1, lo_number: '8097469692', product: 'HSD', qty: 7000 },
        { value: 2, lo_number: '8097469693', product: 'HSD', qty: 5000},
        { value: 3, lo_number: '8097469694', product: 'HSD', qty: 10000 }
    ]
    const handleChangeLoNumber = (selectedOption) => {
        setFormData((prevFormData) => ({ 
            ...prevFormData,
            lo_number: selectedOption, 
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

    return (
        <>
            <div className="container">
                <div className="mb-3 mt-5 pt-4">
                    <h1 className="text-center">Bunker Survey Report</h1>
                </div>
                <form className="row g-3" onSubmit={hanldeSubmit}>
                    <div className="col-12">
                        <select className="mb-3 form-select" aria-label="Tongkang" name="tongkang" value={formData.tongkang} onChange={handleChange}>
                            <option value="">Pilih Tongkang</option>
                            <option value="SPOB Kujang Jaya 1">SPOB Kujang Jaya 1</option>
                            <option value="SPOB Kanaya Indah 99">SPOB Kanaya Indah 99</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <select className="mb-3 form-select" aria-label="KRI" name="kri" value={formData.kri} onChange={handleChange}>
                        <option value="">Pilih KRI</option>
                            <option value="KRI Bung Tomo 357">KRI Bung Tomo 357</option>
                            <option value="KRI John Lie 358">KRI Jhon Lie 358</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <select className="mb-3 form-select" aria-label="Location"name="bunker_location" value={formData.bunker_location} onChange={handleChange}>
                        <option value="">Pilih Lokasi Bunker</option>
                            <option value="JICT 2">JICT 2</option>
                            <option value="Kolinlamil">Kolinlamil</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <select className="mb-3 form-select" aria-label="BBM" name="bbm" value={formData.bbm} onChange={handleChange}>
                            <option value="HSD">HSD</option>
                            <option value="B30">B30</option>
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
                                <input type="date" className="form-control" name="bunkerStartDate" value={formData.bunkerStartDate} onChange={handleChange}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="inputStop" className="form-label">Bunker Stop</label>
                                <input type="time" className="form-control" name="bunkerStopTime" value={formData.bunkerStopTime} onChange={handleChange}/>
                            </div>
                            <div className="col">
                                <label htmlFor="inputStopDate" className="form-label">Stop Date</label>
                                <input type="date" className="form-control" name="bunkerStopDate" value={formData.bunkerStopDate} onChange={handleChange}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <Select
                            placeholder= "Pilih LO Number"
                            components={animatedComponents}
                            name="lo_number"
                            isMulti
                            options={loNumberOptions}
                            getOptionLabel={(option) => `${option.lo_number} : ${option.product} - ${option.qty} L`}
                            onChange={handleChangeLoNumber}
                            className="mb-3"
                        />
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputVolLo" className="form-label">Volume LO</label>
                        <input type="text" className="form-control" name="loVol" value={formData.loVol} onChange={handleChange}/>
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