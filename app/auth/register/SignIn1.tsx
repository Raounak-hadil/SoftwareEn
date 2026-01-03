import '../../../assets/styles/SignIn.css'
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from 'react';
import FancyAlert from '@/components/ui/FancyAlert';

type SignInProps = {
    page: boolean;
    setPage: Dispatch<SetStateAction<boolean>>;
};

function SignIn1({ page, setPage }: SignInProps) {

    const [isHospital, setIsHospital] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter(); // ✅

    const goToHospital = () => {
        setIsHospital(true);
    };

    const stayOnDoctor = () => {
        setIsHospital(false);
        router.push("/auth/register?type=doctor");
    };
    return (
        <>
            <div className="main" style={{ marginTop: "77px" }}>
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
                <form className="Form" style={{ width: "100%", maxWidth: "480px" }} onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget as HTMLFormElement;
                    const formData = new FormData(form);

                    const yearStr = String(formData.get('year') || '');
                    const yearNum = yearStr ? Number(yearStr.split('-')[0]) : undefined;

                    const payload: any = {
                        hosname: String(formData.get('hosname') || ''),
                        license_file: String(formData.get('license') || ''),
                        email: String(formData.get('email') || ''),
                        year_of_est: yearNum,
                        type: String(formData.get('type') || ''),
                        phone_num: String(formData.get('phone') || ''),
                        city: String(formData.get('city') || ''),
                        state: String(formData.get('state') || ''),
                        password: String(formData.get('password') || '')
                    };

                    try {
                        const res = await fetch('/api/auth/hospital/signup', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                        const json = await res.json();
                        if (!res.ok) throw new Error(json?.error || 'Signup failed');
                        setPage(false);
                    } catch (err: any) {
                        setErrorMsg(err.message || 'Signup error');
                    }
                }}>
                    <input
                        name="hosname"
                        placeholder="  HospitalName*"
                        type="text"
                        className="input bg-white"
                        required
                    />

                    <input
                        name="license"
                        placeholder="  license ID*"
                        type="text"
                        className="input bg-white"
                        required
                    />

                    <input
                        name="email"
                        placeholder="  Official email*"
                        type="email"
                        className="input bg-white"
                        required
                    />

                    <input
                        name="password"
                        placeholder="  Password*"
                        type="password"
                        className="input bg-white"
                        required
                    />

                    <input
                        name="year"
                        placeholder="  Year of establishment*"
                        type="date"
                        className="input bg-white"
                        required
                    />

                    <input name="city" placeholder="  City" type="text" className="input bg-white" />
                    <input name="state" placeholder="  State" type="text" className="input bg-white" />

                    <div className="type">
                        <h3 style={{ color: "white", margin: 0 }}>Hospital type*</h3>
                        <div className="muli">
                            <input type="radio" className="radio" value="public" name="type" />
                            <label className="label">Public</label>

                            <input type="radio" className="radio" value="private" name="type" />
                            <label className="label">Private</label>

                            <input type="radio" className="radio" value="clinic" name="type" />
                            <label className="label">Clinic</label>
                        </div>
                    </div>

                    <input
                        name="phone"
                        placeholder="  Phone number*"
                        type="tel"
                        className="input bg-white"
                        required
                    />


                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <label className='input bg-white' htmlFor="file-upload" style={{ color: "#cd8181" }}>
                            Select a file
                        </label>
                        <input id="file-upload" type="file" style={{ display: "none" }} />
                    </div>

                    <button type="submit" className="submit">
                        {isHospital ? 'Sign Up' : 'Next'}
                    </button>

                    <div className="fancy-auth-link">
                        <span>Already have an account?</span>
                        <Link href="/auth/login?type=hospital">
                            <span className="link-text">Log in</span>
                        </Link>
                    </div>
                </form>
            </div>
            {errorMsg && (
                <FancyAlert
                    message={errorMsg}
                    onClose={() => setErrorMsg("")}
                    type="error"
                />
            )}
        </>
    )
}

export default SignIn1