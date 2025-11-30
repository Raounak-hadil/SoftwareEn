// pages/test-donor.tsx
'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  first_name: string;
  last_name: string;
  phone_num: string;
  email: string;
  last_donation: string;
  age: string;
  blood_type: string;
  preferred_date: string;
  forever: boolean;
  hospital_name: string;
}

interface ApiResponse {
  data?: any;
  error?: string;
}

export default function TestDonorForm() {
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    phone_num: '',
    email: '',
    last_donation: '',
    age: '',
    blood_type: '',
    preferred_date: '',
    forever: false,
    hospital_name: '',
  });

  const [response, setResponse] = useState<ApiResponse | null>(null);

  const hospitals = [
    'Green Valley Medical Center',
    'Sunrise Health Hospital',
    'Lakeside Community Hospital'
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/donationForm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data: ApiResponse = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ error: 'Failed to send request' });
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Test Donor Submission</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: '400px' }}>
        <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} />
        <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} />
        <input name="phone_num" placeholder="Phone Number" value={formData.phone_num} onChange={handleChange} />
        <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} />
        <input name="last_donation" type="date" value={formData.last_donation} onChange={handleChange} />
        <input name="age" placeholder="Age" type="number" value={formData.age} onChange={handleChange} />

        <select name="blood_type" value={formData.blood_type} onChange={handleChange}>
          <option value="">Select Blood Type</option>
          <option value="A+">A+</option>
          <option value="B+">B+</option>
          <option value="O+">O+</option>
          <option value="AB+">AB+</option>
          <option value="A-">A-</option>
          <option value="B-">B-</option>
          <option value="O-">O-</option>
          <option value="AB-">AB-</option>
        </select>

        <input name="preferred_date" type="date" value={formData.preferred_date} onChange={handleChange} />
        <label>
          <input type="checkbox" name="forever" checked={formData.forever} onChange={handleChange} /> Forever
        </label>

        <select name="hospital_name" value={formData.hospital_name} onChange={handleChange}>
          <option value="">Select Hospital</option>
          {hospitals.map((hos) => (
            <option key={hos} value={hos}>{hos}</option>
          ))}
        </select>

        <button type="submit">Submit</button>
      </form>

      {response && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
