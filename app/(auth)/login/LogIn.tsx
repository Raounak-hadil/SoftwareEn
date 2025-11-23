

function LogIn() {
    return (
        <>
            <div className="main">
                <div></div>
                <div className="mainRow">
                    <h1 className="Hospital">Hospital</h1>
                    <h6 className="Login">Login</h6>
                </div>
                <form>
                    <div className="input1">
                    <input
                        placeholder="    UserName"
                        type="text"
                        id="username"
                        className="input"
                        required
                        />
                    </div>
                    <div style={{height: "40px"}}></div>
                    <div className="input2">
                        <input
                            placeholder="    Password"
                            type="password"
                            id="password"
                            className="input"
                            required
                        />
                    </div>
                    <button type="submit">Log In</button>
                </form>
            </div>
        </>
    )
}

export default LogIn