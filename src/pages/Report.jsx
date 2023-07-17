export default function Report() {
    return (
        <>
            <div className="container">
            <nav className="mt-5 pt-4">
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <button className="nav-link active" id="nav-loading-tab" data-bs-toggle="tab" data-bs-target="#nav-loading" type="button" role="tab" aria-controls="nav-loading" aria-selected="true">Loading Report</button>
                    <button className="nav-link" id="nav-bunker-tab" data-bs-toggle="tab" data-bs-target="#nav-bunker" type="button" role="tab" aria-controls="nav-bunker" aria-selected="false">Bunker Report</button>
                </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane fade show active" id="nav-loading" role="tabpanel" aria-labelledby="nav-loading-tab" tabIndex="0">
                    <h3 className="mt-3 text-center">LOADING REPORT</h3>
                    <div className="mt-3 table-responsive">
                        <table className="table table-bordered text-center">
                            <thead>
                                <tr>
                                <th scope="col">No</th>
                                <th scope="col">Nama Kapal Supply</th>
                                <th scope="col">Jenis BBM</th>
                                <th scope="col">Mulai Loading</th>
                                <th scope="col">Selesai Loading</th>
                                <th scope="col">LO Number</th>
                                <th scope="col">LO Figure</th>
                                <th scope="col">AL Figure</th>
                                <th scope="col">Surveyor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>SPOB KUJANG JAYA 1</td>
                                    <td>HSD</td>
                                    <td>09:15 / 25.07.2023</td>
                                    <td>10:15 / 25.07.2023</td>
                                    <td>
                                    <table className="table mb-4 text-center">
                                        <thead>
                                            <th>LO</th>
                                            <th>Product</th>
                                            <th>QTY</th>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>8096429235</td>
                                                <td>HSD</td>
                                                <td>25000</td>
                                            </tr>
                                            <tr>
                                                <td>8096429236</td>
                                                <td>HSD</td>
                                                <td>15000</td>
                                            </tr>
                                            <tr>
                                                <td>8096429236</td>
                                                <td>HSD</td>
                                                <td>5000</td>
                                            </tr>
                                            <tr>
                                                <td>8096429237</td>
                                                <td>HSD</td>
                                                <td>5000</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    </td>
                                    <td>50000</td>
                                    <td>49995</td>
                                    <td>Hari Pranata</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="tab-pane fade" id="nav-bunker" role="tabpanel" aria-labelledby="nav-bunker-tab" tabIndex="0">
                    <h3 className="mt-3 text-center">BUNKER REPORT</h3>
                    <div className="mt-3 table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                <th scope="col">No</th>
                                <th scope="col">Port</th>
                                <th scope="col">Nama Kapal Supply</th>
                                <th scope="col">Nama Kapal Penerima</th>
                                <th scope="col">Jenis BBM</th>
                                <th scope="col">Mulai Bunker</th>
                                <th scope="col">Selesai Bunker</th>
                                <th scope="col">LO Figure</th>
                                <th scope="col">AR Figure</th>
                                <th scope="col">Surveyor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>JICT 2</td>
                                    <td>SPOB KUJANG JAYA 1</td>
                                    <td>KRI BUNG TOMO 357</td>
                                    <td>HSD</td>
                                    <td>09:15 / 25.07.2023</td>
                                    <td>10:15 / 25.07.2023</td>
                                    <td>50000</td>
                                    <td>49995</td>
                                    <td>Hari Pranata</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>



            </div>
        </>
    )
}