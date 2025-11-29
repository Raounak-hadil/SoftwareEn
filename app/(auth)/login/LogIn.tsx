import '../../../assets/styles/LogIn.css'

function LogIn() {
    return (
        <>
            <div className="main">
                <div className="choose">
                    <button className="left" style={{backgroundColor: "#C50000"}}> Hispital </button>
                    <button className="right" style={{backgroundColor: "#FFFFFF"}}> Doctor </button>
                </div>
                <div className="mainRow">
                    <h1 className="Hospital">Hospital</h1>
                    <h6 className="Login">Login</h6>
                </div>
                <form>
            
                    <input
                        placeholder="  UserName"
                        type="text"
                        id="username"
                        className="input"
                        required
                        />
                   
                    <div style={{height: "40px"}}></div>
               
                        <input
                            placeholder="  Password"
                            type="password"
                            id="password"
                            className="input"
                            required
                        />
                
                    <h6 className="Forgot">Forgot Password ?</h6>
                    <button type="submit" className="submit">Log In</button>
                    <div className="mainRow2">
                    <h6 className="fi">You have an account ? </h6>
                    <h6 className="se"> Sign Up</h6>
                </div>
                </form>
            </div>
        </>
    )
}

export default LogIn