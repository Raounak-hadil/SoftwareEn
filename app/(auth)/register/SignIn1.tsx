import '../../../assets/styles/SignIn.css'
import { useState } from 'react';

import { Dispatch, SetStateAction } from 'react';

type SignInProps = {
  page: boolean;
  setPage: Dispatch<SetStateAction<boolean>>;
};

function setMyColor(hospital : boolean) {
    if (hospital) {return "#C50000";}
    else {return "#FFFFFF";}
}

function SignIn1({ page, setPage }: SignInProps) {
    const [doctor, setDoctor] = useState(false);

    function toDoctor() {
        setDoctor(true);
    }

    function toHospital() {
        setDoctor(false);
    }
    
    function name(doctor : boolean) {
        if (doctor)
            return "Doctor";
        else
            return "Hospital";
    }

    return (
        <>
            <div className="main">
                <div className="choose">
                    <button className="left"  onClick={toHospital} style={{backgroundColor: setMyColor(!doctor), color: setMyColor(doctor)}}> Hispital </button>
                    <button className="right" onClick={toDoctor} style={{backgroundColor: setMyColor(doctor), color: setMyColor(!doctor)}}> Doctor </button>
                </div>
                <div className="mainRow">
                    <h1 className="Hospital">
                        {name(doctor)}
                    </h1>
                    <h6 className="Login">Sign Up</h6>
                </div>
                <form className="Form">
                    <input
                        placeholder="HospitalName*"
                        type="text"
                        id="username"
                        className="input"
                        required
                    />
                    <input
                        placeholder="license ID*"
                        type="text"
                        id="username"
                        className="input"
                        required
                    />
                    <input
                        placeholder="Official email*"
                        type="text"
                        id="username"
                        className="input"
                        required
                    />
                    <input
                        placeholder="Year of establishment*"
                        type="date"
                        id="username"
                        className="input"
                        required
                    />
                    <div className="type">
                        <h3 style={{color: "white", margin: "0"}}>Hospital type*</h3>
                        <div className="muli">
                            <input type="radio" className="radio" value={'public'} name="q"/>
                            <label htmlFor="public" className="label">Public</label>
                            <input type="radio" className="radio" value={'private'} name="q"/>
                            <label htmlFor="private" className="label">Private</label>
                            <input type="radio" className="radio" value={'clinic'} name="q"/>
                            <label htmlFor="clinic" className="label">Clinic</label>
                        </div>
                    </div>
                    <input
                        placeholder="Phone number*"
                        type="text"
                        id="username"
                        className="input"
                        required
                    />
                    <button type="button" className="submit" onClick={() => setPage(false)}>Next</button>  
                </form>
            </div>
        </>
    )
}

export default SignIn1