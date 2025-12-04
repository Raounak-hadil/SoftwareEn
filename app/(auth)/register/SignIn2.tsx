import '../../../assets/styles/SignIn.css'
import Select from "react-select";

const options = [
  { value: "algeria", label: "Algeria" },
  { value: "libya", label: "Libya" },
  { value: "mali", label: "Mali" },
];

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    marginRight: "55px",
    width: "480px",
    height: "60px",
    borderRadius: "10px",
    boxShadow: "-2px 2px 2px 2px #C50000",
    border: "0px",
    fontSize: "20px",
    padding: "20px",
    marginBottom: "27px",
    fontFamily: "'Times New Roman', Times, serif",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#cd8181",
    marginBottom: "10px",
    opacity: 1,
    fontWeight: 100
  }),
};


function SignIn2() {
    return (
        <>
            <div className="main" style={{marginTop: "77px"}}>
                <form className="Form">
                <Select
                    options={options} styles={customStyles} placeholder="Country"
                />
                    <Select
                    options={options} styles={customStyles} placeholder="City"
                />
                    <input
                        placeholder="Official email*"
                        type="text"
                        id="username"
                        className="input"
                        required
                    />
                    <Select
                    options={options} styles={customStyles} placeholder="State"
                />
                    <input
                        placeholder="Password*"
                        type="text"
                        id="username"
                        className="input"
                        required
                    />
                    <input
                        placeholder="Confirm Password*"
                        type="text"
                        id="username"
                        className="input"
                        required
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <label
                                className='input'
                                htmlFor="file-upload"
                                style={{backgroundColor: "white", color: "#cd8181"}}
                            >
                            Select a file
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                style={{ display: "none" }} // hide native input
                            />
                    </div>
                    
                    <div className="terms">
                        <input type="checkbox" id="terms" name="terms_and_conditions" value="agreed" className="check"/>
                        <label htmlFor="terms">I agree to the terms and conditions</label>
                    </div>
                    

                    <button type="submit" className="submit">SignUp</button>  
                </form>
            </div>
        </>
    )
}

export default SignIn2