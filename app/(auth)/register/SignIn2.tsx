import '../../../assets/styles/SignIn.css'

function SignIn1() {
    return (
        <>
            <div className="main" style={{marginTop: "77px"}}>
                <form className="Form">
                    <input
                        placeholder="Country*"
                        type="text"
                        id="username"
                        className="input"
                        required
                    />
                    <input
                        placeholder="City*"
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
                        placeholder="State*"
                        type="text"
                        id="username"
                        className="input"
                        required
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
                    <input
                        placeholder="Upload License*"
                        type="text"
                        id="username"
                        className="input"
                        required
                    />
                    
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

export default SignIn1