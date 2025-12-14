"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    width: "100%",
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

export default function SignIn2() {

  const [isHospital, setIsHospital] = useState(false);
  const router = useRouter(); // ✅

  const goToHospital = () => {
    setIsHospital(true);
    router.push("/register?type=hospital");  // ✅ redirect to Hospital register
  };

  const stayOnDoctor = () => {
    setIsHospital(false);
    // stays here (SignIn2)
  };

  return (
    <div className="main" style={{ marginTop: "77px" }}>

      {/* TOGGLE */}
      <div className="flex rounded-xl w-full overflow-hidden mb-8 border-2 border-red-600 shadow-lg" style={{ maxWidth: "480px" }}>
        <button
          className={`flex-1 py-3 text-lg font-semibold transition-colors ${isHospital ? "bg-red-600 text-white" : "bg-white text-red-600"
            }`}
          onClick={goToHospital} // ✅ changed
        >
          Hospital
        </button>

        <button
          className={`flex-1 py-3 text-lg font-semibold transition-colors ${!isHospital ? "bg-red-600 text-white" : "bg-white text-red-600"
            }`}
          onClick={stayOnDoctor} // ✅ stays here
        >
          Doctor
        </button>
      </div>

      <div className="mb-8 flex items-end gap-8">
        <h1 className="text-6xl font-bold text-red-600">
          {isHospital ? "Hospital" : "Doctor"}
        </h1>
        <span className="text-xl text-red-600 ml-2 font-thin items-end">Sign Up</span>
      </div>

      {/* FORM */}
      <form className="Form" style={{ width: "100%", maxWidth: "480px" }} onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const fd = new FormData(form);
        const payload = {
          first_name: String(fd.get('first_name') || ''),
          last_name: String(fd.get('last_name') || ''),
          email: String(fd.get('email') || ''),
          phone_num: String(fd.get('phone') || ''),
          speciality: String(fd.get('speciality') || ''),
          password: String(fd.get('password') || '')
        };

        try {
          const res = await fetch('/api/auth/doctor/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const json = await res.json();
          if (!res.ok) throw new Error(json?.error || 'Signup failed');
          // on success redirect to login
          alert('Doctor registered successfully');
        } catch (err: any) {
          alert(err.message || 'Signup error');
        }
      }}>
        <div style={{ display: 'flex flex-col', gap: '10px' }}>
          <input name="first_name" placeholder="First name*" className="input" required />
          <input name="last_name" placeholder="Last name*" className="input" required />
        </div>

        <input name="email" placeholder="Official email*" className="input" required />
        <input name="phone" placeholder="Phone number*" className="input" required />
        <input name="speciality" placeholder="Speciality*" className="input" required />
        <input name="password" placeholder="Password*" className="input" type="password" required />
        <input name="confirm_password" placeholder="Confirm Password*" className="input" type="password" required />

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label className='input' htmlFor="file-upload" style={{ backgroundColor: "white", color: "#cd8181" }}>
            Select a file
          </label>
          <input id="file-upload" type="file" style={{ display: "none" }} />
        </div>

        <div className="terms">
          <input type="checkbox" className="check" />
          <label htmlFor="terms">I agree to the terms and conditions</label>
        </div>

        <button className="submit">SignUp</button>
      </form>
    </div>
  );
}