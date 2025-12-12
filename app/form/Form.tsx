"use client";

import '@/assets/styles/Form.css'
import Select from "react-select";
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const bloodTypes = [
    { value: "AB+", label: "AB+" },
    { value: "A+", label: "A+" },
    { value: "B+", label: "B+" },
    { value: "O+", label: "O+" },
    { value: "AB-", label: "AB-" },
    { value: "A-", label: "A-" },
    { value: "B-", label: "B-" },
    { value: "O-", label: "O-" },
];

const States = [
    { value: "Adrar", label: "Adrar" },
    { value: "Chlef", label: "Chlef" },
    { value: "Laghouat", label: "Laghouat" },
    { value: "Oum El Bouaghi", label: "Oum El Bouaghi" },
    { value: "Batna", label: "Batna" },
    { value: "Tamanrasset", label: "Tamanrasset" },
    { value: "Tlemcen", label: "Tlemcen" },
    { value: "Tiaret", label: "Tiaret" },
    { value: "Tizi Ouzou", label: "Tizi Ouzou" },
    { value: "Algiers", label: "Algiers" },
    { value: "Djelfa", label: "Djelfa" },
    { value: "Jijel", label: "Jijel" },
    { value: "Sétif", label: "Sétif" },
    { value: "Saïda", label: "Saïda" },
    { value: "Skikda", label: "Skikda" },
    { value: "Sidi Bel Abbès", label: "Sidi Bel Abbès" },
    { value: "Annaba", label: "Annaba" },
    { value: "Guelma", label: "Guelma" },
    { value: "Constantine", label: "Constantine" },
    { value: "Médéa", label: "Médéa" },
    { value: "Mostaganem", label: "Mostaganem" },
    { value: "Msila", label: "Msila" },
    { value: "Mascara", label: "Mascara" },
    { value: "Ouargla", label: "Ouargla" },
    { value: "Oran", label: "Oran" },
    { value: "El Bayadh", label: "El Bayadh" },
    { value: "Illizi", label: "Illizi" },
    { value: "Bordj Bou Arréridj", label: "Bordj Bou Arréridj" },
    { value: "Boumerdès", label: "Boumerdès" },
    { value: "El Tarf", label: "El Tarf" },
    { value: "Tindouf", label: "Tindouf" },
    { value: "Tissemsilt", label: "Tissemsilt" },
    { value: "El Oued", label: "El Oued" },
    { value: "Khenchela", label: "Khenchela" },
    { value: "Souk Ahras", label: "Souk Ahras" },
    { value: "Tipaza", label: "Tipaza" },
    { value: "Mila", label: "Mila" },
    { value: "Aïn Defla", label: "Aïn Defla" },
    { value: "Naama", label: "Naama" },
    { value: "Aïn Témouchent", label: "Aïn Témouchent" },
    { value: "Ghardaïa", label: "Ghardaïa" },
    { value: "Relizane", label: "Relizane" },
    { value: "El M'ghair", label: "El M'ghair" },
    { value: "El Menia", label: "El Menia" },
    { value: "Ouled Djellal", label: "Ouled Djellal" },
    { value: "Bordj Baji Mokhtar", label: "Bordj Baji Mokhtar" },
    { value: "Béni Abbès", label: "Béni Abbès" },
    { value: "In Salah", label: "In Salah" },
    { value: "In Guezzam", label: "In Guezzam" },
    { value: "Touggourt", label: "Touggourt" },
    { value: "Djanet", label: "Djanet" },
];

const DummyHospitals = []
const age = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
]

const customStyles = {
    control: (p: any) => ({
        ...p,
        marginLeft: "20px",
        width: "270px",
        height: "27px",
        border: "none",
        boxShadow: "1px 1px 1px 1px rgb(188, 188, 188)",
        borderRadius: "5px",
        padding: "0 15px",
        fontSize: "14px",
        backgroundColor: "white",
    })
};

const customStylesHos = {
    control: (p: any) => ({
        ...p,
        marginLeft: "12px",
        width: "220px",
        height: "35px",
        border: "none",
        boxShadow: "1px 1px 1px 1px rgb(188, 188, 188)",
        borderRadius: "6px",
        padding: "0 10px",
        fontSize: "13px",
        backgroundColor: "white",
    })
};


function Form() {
    const [hospitals, setHospitals] = useState<any[]>(DummyHospitals);
    const [hospitalsLoading, setHospitalsLoading] = useState(true);

    // State for Select inputs
    const [selectedHospital, setSelectedHospital] = useState<any>(null);
    const [selectedBloodType, setSelectedBloodType] = useState<any>(null);
    const [selectedState, setSelectedState] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadHospitals = async () => {
            try {
                const res = await fetch('/api/hospitals_list');
                const data = await res.json();

                const list = data?.hospitals || data?.data || [];

                if (Array.isArray(list)) {
                    const opts = list.map((h: any) => ({
                        value: h.id,
                        label: h.hosname || h.name || 'Unknown'
                    }));
                    setHospitals(opts);
                }
            } finally {
                setHospitalsLoading(false);
            }
        };

        loadHospitals();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        setSubmitting(true);

        const fd = new FormData(form);
        const data = Object.fromEntries(fd.entries());

        const payload = {
            first_name: data.first_name,
            last_name: data.last_name,
            phone_num: data.phone_num,
            email: data.email,
            last_donation: data.last_donation ? data.last_donation : null,
            age: Number(data.age),
            blood_type: selectedBloodType?.value,
            preferred_date: data.appointment_date ? data.appointment_date : null,
            hospital_id: selectedHospital?.value,
            forever: data.forever_donor === 'on',
            // state: selectedState?.value // API might not use this yet, but good to collect
        };

        console.log('Form submission:', payload);

        try {
            const res = await fetch('/api/donationForm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.error || 'Failed to submit donation request');
            } else {
                toast.success('Donation request submitted successfully!');
                // Optional: Reset form
                form.reset();
                setSelectedHospital(null);
                setSelectedBloodType(null);
                setSelectedState(null);
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="main" onSubmit={handleSubmit}>
            <ToastContainer />
            <div className="circle circle1"></div>
            <div className="circle circle2"></div>
            <div className="circle circle3"></div>
            <div className="circle circle4"></div>
            <div className="circle circle5"></div>
            <div className="circle circle6"></div>

            <div className="Column1 Column">
                <div className="row">
                    <label className="label white">Full Name</label>
                </div>
                <div className="row">
                    <label className="label white">Phone Number</label>
                </div>
                <div className="row">
                    <label className="label white">Email</label>
                </div>

                <div className="row">
                    <label className="label white">Date</label>
                </div>

                <div className="row">
                    <label className="label white">Hospital</label>
                </div>

                <div className="row" style={{ alignItems: 'center' }}>
                    <label className="label red" style={{ marginRight: '36px' }}>Last Donation</label>
                    <input name="last_donation" type="date" className="input" style={{ width: '200px', marginLeft: '8px' }} />
                </div>

                <div className="row" style={{ alignItems: 'center' }}>
                    <label className="label red">State</label>
                    <div style={{ marginLeft: 12 }}>
                        <Select
                            options={States}
                            styles={customStyles}
                            placeholder="State"
                            name="state"
                            value={selectedState}
                            onChange={setSelectedState}
                            menuPosition="fixed"
                        />
                    </div>
                </div>

            </div>

            <div className="Column2 Column">
                <div className="row row1">
                    <input required name="first_name" type="text" className="input" placeholder="First Name" />
                    <input required name="last_name" type="text" className="input" placeholder="Last Name" />
                </div>

                <div className="row">
                    <input required name="phone_num" type="text" className="input long" placeholder="Phone Number" />
                </div>

                <div className="row">
                    <input required name="email" type="email" className="input long" placeholder="Mail Id" />
                </div>

                {/* 🔵 NEW DATE INPUT */}
                <div className="row">
                    <input required type="date" className="input long" name="appointment_date" />
                </div>

                <div className="row large">
                    <Select
                        options={hospitals}
                        placeholder={hospitalsLoading ? "Loading hospitals..." : "Hospital"}
                        styles={customStylesHos}
                        menuPosition="fixed"
                        isLoading={hospitalsLoading}
                        value={selectedHospital}
                        onChange={setSelectedHospital}
                    />

                    <div className="Column Column3">
                        <div className="row">
                            <label className="label red">Age</label>
                            <input required name="age" type="number" min="18" placeholder="Age" className="input" />
                        </div>

                        <div className="row">
                            <label className="label red">Blood Group</label>
                            <Select
                                options={bloodTypes}
                                placeholder="Blood Group"
                                styles={customStyles}
                                value={selectedBloodType}
                                onChange={setSelectedBloodType}
                                required
                                menuPosition="fixed"
                            />
                        </div>
                    </div>
                </div>

                <div className="row" style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                    <label className="label white" style={{ marginRight: 35 }}>Forever Donor</label>
                    <input name="forever_donor" type="checkbox" style={{ width: 20, height: 20 }} />
                </div>

                <div className="row but">
                    <button type="submit" className="submit" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Register Now'}
                    </button>
                </div>
            </div>
        </form>
    );
}

export default Form;
