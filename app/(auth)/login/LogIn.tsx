"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SignIn1 from "../register/SignIn1";
import SignIn2 from "../register/SignIn2";
import FancyAlert from "@/components/ui/FancyAlert";

function LogIn() {
  const [isHospital, setIsHospital] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "doctor") {
      setIsHospital(false);
    } else if (type === "hospital") {
      setIsHospital(true);
    }
  }, [searchParams]);

  const handleToggle = (hospital: boolean) => setIsHospital(hospital);

  const handleLogin = async () => {
    if (!isHospital) {
      try {
        const res = await fetch('/api/doctorLogin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: username, password })
        });
        const data = await res.json();
        if (data.success) {
          // alert('Doctor Logged in successfully: ' + data.doctor.name); 
          console.log('Token:', data.token);
          // Store token for subsequent requests
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', data.token);
          }

          const redirectTo = searchParams.get("redirectTo");
          if (redirectTo) {
            router.push(redirectTo);
          } else {
            router.push('/doctor-profile');
          }
        } else {
          setErrorMsg(data.error || 'Login failed');
        }
      } catch (e) {
        console.error(e);
        setErrorMsg('An error occurred during login');
      }
    } else {
      console.log("Hospital login flow");
      try {
        const res = await fetch('/api/auth/hospital/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: username, password })
        });
        const data = await res.json();

        if (data.success) {
          // alert('Hospital Logged in successfully');
          console.log('Hospital Token:', data.token);

          if (typeof window !== 'undefined') {
            localStorage.setItem('hospital_token', data.token); // distinct key if needed, or just 'token'
          }

          const redirectTo = searchParams.get("redirectTo");
          if (redirectTo) {
            router.push(redirectTo);
          } else if (data.role === 'admin') {
            router.push('/admin-dashboard');
          } else {
            router.push('/hospital/stock');
          }
        } else {
          setErrorMsg(data.error || 'Login failed');
        }
      } catch (e) {
        console.error(e);
        setErrorMsg('An error occurred during hospital login');
      }
    }
  };

  return (
    <div
      className="min-h-screen flex"

    >
      <div className="w-full md:w-1/2 flex flex-col justify-center px-12 py-8">
        <div className="flex rounded-xl  w-full max-w-lg overflow-hidden w-96 mb-8 border-2 border-red-600 shadow-lg">
          <button
            className={`flex-1 py-3 text-lg font-semibold transition-colors ${isHospital
              ? "bg-red-600 text-white"
              : "bg-white text-red-600"
              }`}
            onClick={() => handleToggle(true)}
          >
            Hospital
          </button>
          <button
            className={`flex-1 py-3 text-lg font-semibold transition-colors ${!isHospital
              ? "bg-red-600 text-white"
              : "bg-white text-red-600"
              }`}
            onClick={() => handleToggle(false)}
          >
            Doctor
          </button>
        </div>

        <div className="mb-8 flex items-end">
          <h1 className="text-6xl font-bold text-red-600">
            {isHospital ? "Hospital" : "Doctor"}
          </h1>
          <span className="text-xl text-red-600 ml-2 items-end">Login</span>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-lg">
          <input
            type="text"
            placeholder="UserName"
            className="px-6 py-4 text-lg bg-white rounded-xl w-full outline-none focus:ring-4 focus:ring-red-600 shadow-md"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="px-6 py-4 text-lg bg-white rounded-xl w-full outline-none focus:ring-4 focus:ring-red-600 shadow-md"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span className="text-base text-red-600 cursor-pointer font-medium hover:underline">
            Forgot password?
          </span>

          <button
            type="button"
            onClick={handleLogin}
            className="bg-red-600 text-white py-4 text-lg rounded-xl font-semibold hover:bg-red-700 transition shadow-lg"
          >
            Login
          </button>

          <div className="flex gap-2 text-base text-gray-200">
            <span>Don't have an account?</span>
            <Link href={`/register?type=${isHospital ? "hospital" : "doctor"}`}>
              <span className="text-red-600 cursor-pointer font-medium hover:underline">Sign up</span>
            </Link>
          </div>
        </div>
      </div>


      <div className="hidden md:flex md:w-1/2 md:flex-1"></div>

      {errorMsg && (
        <FancyAlert
          message={errorMsg}
          onClose={() => setErrorMsg("")}
          type="error"
        />
      )}
    </div>
  );
}

export default LogIn;