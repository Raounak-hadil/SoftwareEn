"use client";

import '@/assets/styles/Form.css'
import Select from "react-select";

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
    { value: "Annaba", label: "Annaba" },
    { value: "Algiers", label: "Algiers" }, 
]

const Hispitals = [
    { value: "Hospital1", label: "Hospital1" },
    { value: "Hospital2", label: "Hospital2" },
    { value: "Hospital3", label: "Hospital3" },
]

const age = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
]


const customStyles = {
  control: (provided: any) => ({
    ...provided,
    marginLeft: "20px",
    width: "270px",
    height: "27px",
    border: "none",
    boxShadow: "1px 1px 1px 1px rgb(188, 188, 188)",
    borderRadius: "5px",
    padding: "0 15px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "14px",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "rgb(181, 181, 181)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontWeight: 100,
    fontSize: "14px",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "14px",
    color: "#000",
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: "5px",
    boxShadow: "1px 1px 1px 1px rgb(188, 188, 188)",
    zIndex: 2,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#ddd" : "#fff",
    color: "#000",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "14px",
    padding: "10px",
  }),
};

const customStylesHos = {
  control: (provided: any) => ({
    ...provided,
    marginLeft: "20px",
    width: "270px",
    height: "107px",
    border: "none",
    boxShadow: "1px 1px 1px 1px rgb(188, 188, 188)",
    borderRadius: "5px",
    padding: "0 15px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "14px",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "rgb(181, 181, 181)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontWeight: 100,
    fontSize: "14px",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "14px",
    color: "#000",
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: "5px",
    boxShadow: "1px 1px 1px 1px rgb(188, 188, 188)",
    zIndex: 2,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#ddd" : "#fff",
    color: "#000",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "14px",
    padding: "10px",
  }),
};


function Form() {
    return (
        <form className="main">
            <div className="circle circle1"></div>
            <div className="circle circle2"></div>
            <div className="circle circle3"></div>
            <div className="circle circle4"></div>
            <div className="circle circle5"></div>
            <div className="circle circle6"></div>
            <div className="Column1 Column">
                <div className="row">
                    <label htmlFor="" className="label white">Full Name</label>
                </div>
                <div className="row">
                    <label htmlFor="" className="label white">Phone Number</label>
                </div>
                <div className="row">
                    <label htmlFor="" className="label white">Email</label>
                </div>
                <div className="row">
                    <label htmlFor="" className="label white">Hospital</label>
                </div>
                <div className="row">
                    <label htmlFor="" className="label red">Last Donation</label>
                </div>
                <div className="row">
                    <label htmlFor="" className="label AVA red">availablity for donations ?</label>
                </div>
                <div className="row"></div>
            </div>
            <div className="Column2 Column">
                <div className="row row1">
                    <input type="text" className="input" placeholder="First"/>
                    <input type="text" className="input" placeholder="Last Name"/>
                </div>
                <div className="row">
                    <input type="text" className="input long" placeholder="Number"/>
                </div>
                <div className="row">
                    <input type="text" className="input long" placeholder="Mail Id"/>
                </div>
                <div className="row large">
                    <Select
                            options={Hispitals}
                            placeholder="Hospital"
                            styles={{
                              ...customStylesHos,
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                        />
                    <div className="Column Column3">
                        <div className="row">
                        <label htmlFor="" className="label red">Age</label>
                        <Select
                            options={age}
                            placeholder="Age"
                            styles={{
                              ...customStyles,
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                        />
                        </div>
                        <div className="row">
                        <label htmlFor="" className="label red">Blood Group</label>
                        <Select
                            options={bloodTypes}
                            placeholder="Blood Group"
                            styles={{
                              ...customStyles,
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                        />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <input type="date" className="input" placeholder="Mail Id"/>
                    <div className="Column Column3">
                        <div className="row">
                        <label htmlFor="" className="label red">Date</label>
                        <input type="date" className="input" placeholder=""/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <input type="date" className="input" placeholder="Mail Id"/>
                    <div className="Column Column3">
                        <div className="row">
                        <label htmlFor="" className="label red">Stat<b style={{color: "white"}}>e</b></label>
                        <Select
                            options={States}
                            styles={customStyles}
                            placeholder="State"
                            menuPosition="absolute" 
                        />
                        </div>
                    </div>
                </div>
                <div className="row but">
                    <button type="submit" className="submit">Register Now</button> 
                </div>
            </div>
        </form>
    );
}


export default Form;