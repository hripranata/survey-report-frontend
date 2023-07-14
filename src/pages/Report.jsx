export default function Report() {
    return (
        <>
            <div className="container">
            <div className="table-responsive">
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
                        </tr>
                    </tbody>
                </table>
            </div>
            </div>
        </>
    )
}