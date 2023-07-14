export default function BunkerSurvey() {
    return (
        <>
            <div className="container">
                <div className="mb-3 mt-5 pt-4">
                    <h1 className="text-center">Bunker Survey Report</h1>
                </div>
                <form className="row g-3">
                    <div className="col-12">
                        <select className="mb-3 form-select" aria-label="Tongkang">
                            <option selected>Tongkang</option>
                            <option value="1">SPOB Kujang Jaya 1</option>
                            <option value="2">SPOB Kanaya Indah 99</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <select className="mb-3 form-select" aria-label="KRI">
                            <option selected>KRI</option>
                            <option value="1">KRI Bung Tomo 357</option>
                            <option value="2">KRI Jhon Lie 358</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <select className="mb-3 form-select" aria-label="Location">
                            <option selected>Location</option>
                            <option value="1">JICT 2</option>
                            <option value="2">Kolinlamil</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <select className="mb-3 form-select" aria-label="BBM">
                            <option selected>BBM Type</option>
                            <option value="1">HSD</option>
                            <option value="2">B30</option>
                        </select>
                    </div>
                    <div className="col-12">
                        <div className="row mb-3">
                            <div className="col">
                                <label htmlFor="inputStart" className="form-label">Loading Start</label>
                                <input type="time" className="form-control" id="inputStart"></input>
                            </div>
                            <div className="col">
                            <label htmlFor="inputStartDate" className="form-label">Start Date</label>
                                <input type="date" className="form-control" id="inputStartDate"></input>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <label htmlFor="inputStop" className="form-label">Loading Stop</label>
                                <input type="time" className="form-control" id="inputStop"></input>
                            </div>
                            <div className="col">
                                <label htmlFor="inputStopDate" className="form-label">Stop Date</label>
                                <input type="date" className="form-control" id="inputStopDate"></input>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <table className="table">
                            <thead className="text-center">
                                <tr>
                                <th colSpan="2">LO Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><input className="form-control" type="text" aria-label=".form-control-sm example" value="8095962604"></input></td>
                                    <td><input className="form-control" type="text" aria-label=".form-control-sm example" value="100000"></input></td>
                                </tr>
                                <tr>
                                    <td><input className="form-control" type="text" placeholder="No. LO" aria-label=".form-control-sm example"></input></td>
                                    <td><input className="form-control" type="text" placeholder="QTY" aria-label=".form-control-sm example"></input></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-6 mb-3">
                        <button type="button" className="btn btn-success">Add LO No.</button>
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputVolLo" className="form-label">Volume LO</label>
                        <input type="text" className="form-control" id="inputVolLo"></input>
                    </div>
                    <div className="col-12">
                        <label htmlFor="inputVolAr" className="form-label">AR / Volume KRI</label>
                        <input type="text" className="form-control" id="inputVolAr"></input>
                    </div>
                    <div className="col-12 mb-3">
                        <label htmlFor="inputPetugas" className="form-label">Surveyor</label>
                        <input type="text" className="form-control" id="inputPetugas"></input>
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