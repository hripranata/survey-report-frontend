export default function Profile() {
    return (
        <>
            <div className="container">
                <div className="row mt-5 pt-4">
                    <div className="col-xl-4">
                        <div className="card">
                            <h5 className="card-header">Profile Picture</h5>
                            <div className="card-body">
                                <div className="text-center">
                                    <img src="http://bootdey.com/img/Content/avatar/avatar1.png" className="rounded mb-2" alt="..." width="150" height="150"></img>
                                    <div className="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
                                    <button className="btn btn-primary" type="button">Upload new image</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-8">
                        <div className="card">
                            <h5 className="card-header">Account Details</h5>
                            <div className="card-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="inputName" className="form-label">Name</label>
                                        <input type="text" className="form-control" id="inputName"></input>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="inputEmail" className="form-label">Email Address</label>
                                        <input type="text" className="form-control" id="inputEmail"></input>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="inputPhone" className="form-label">Phone Number</label>
                                        <input type="text" className="form-control" id="inputPhone"></input>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="inputAddress" className="form-label">Address</label>
                                        <textarea className="form-control" id="inputAddress" rows="3"></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Save Profile</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        </>
    )
}