import '@/assets/styles/Form.css'

function Form() {
    return (
        <form className="main">
            <div className="circle circle1"></div>
            <div className="circle circle2"></div>
            <div className="circle circle3"></div>
            <div className="circle circle4"></div>
            <div className="circle circle5"></div>
            <div className="circle circle6"></div>
            <div className="Column1 Column">
                <div className="row">
                    <label htmlFor="" className="label white">Full Name</label>
                </div>
                <div className="row">
                    <label htmlFor="" className="label white">Phone Number</label>
                </div>
                <div className="row">
                    <label htmlFor="" className="label white">Email</label>
                </div>
                <div className="row">
                    <label htmlFor="" className="label white">Hospital</label>
                </div>
                <div className="row">
                    <label htmlFor="" className="label red">Last Donation</label>
                </div>
                <div className="row">
                    <label htmlFor="" className="label AVA red">availablity for donations ?</label>
                </div>
                <div className="row"></div>
            </div>
            <div className="Column2 Column">
                <div className="row row1">
                    <input type="text" className="input" placeholder="First"/>
                    <input type="text" className="input" placeholder="Last Name"/>
                </div>
                <div className="row">
                    <input type="text" className="input long" placeholder="Number"/>
                </div>
                <div className="row">
                    <input type="text" className="input long" placeholder="Mail Id"/>
                </div>
                <div className="row large">
                    <input type="text" className="input Hosp" placeholder=""/>
                    <div className="Column Column3">
                        <div className="row">
                        <label htmlFor="" className="label red">Age</label>
                        <input type="text" className="input" placeholder="Age"/>
                        </div>
                        <div className="row">
                        <label htmlFor="" className="label red">Blood Group</label>
                        <input type="text" className="input" placeholder=""/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <input type="text" className="input" placeholder="Mail Id"/>
                    <div className="Column Column3">
                        <div className="row">
                        <label htmlFor="" className="label red">Date</label>
                        <input type="text" className="input" placeholder=""/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <input type="text" className="input" placeholder="Mail Id"/>
                    <div className="Column Column3">
                        <div className="row">
                        <label htmlFor="" className="label red">Stat<b style={{color: "white"}}>e</b></label>
                        <input type="text" className="input" placeholder=""/>
                        </div>
                    </div>
                </div>
                <div className="row but">
                    <button type="submit" className="submit">Register Now</button> 
                </div>
            </div>
        </form>
    );
}


export default Form;