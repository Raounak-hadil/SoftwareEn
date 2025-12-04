"use client";

import '../../../assets/styles/LogIn.css';
import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";

function setMyColor(hospital : boolean) {
    if (hospital) {return "#C50000";}
    else {return "#FFFFFF";}
}



function LogIn() {

/*

const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      window.location.href = "/dashboard"; 
    } else {
      console.log(error.message);
    }
  }

  */


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
                        placeholder="  Email"
                        type="email"
                        //onChange={(e) => setEmail(e.target.value)}
                        id="username"
                        className="input"
                        required
                        />
                   
                    <div style={{height: "40px"}}></div>
               
                        <input
                            placeholder="  Password"
                            type="password"
                            //onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            className="input"
                            required
                        />
                
                    <h6 className="Forgot">Forgot Password ?</h6>
                    <button type="submit" className="submit" /*onClick={handleLogin}*/>Log In</button>
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