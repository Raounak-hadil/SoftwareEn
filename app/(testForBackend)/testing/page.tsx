'use client';
import { useState } from 'react';

export default function QuestionsForm() {
  const [form, setForm] = useState({ fullName: '', phoneNum: '', Description: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Submitting...');

    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (res.ok) {
      setStatus('Submitted successfully!');
      setForm({ fullName: '', phoneNum: '', Description: '' });
    } else {
      setStatus('Error: ' + data.error);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Questions Form</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Full Name:</label>
          <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>PhoneNum:</label>
          <input type="text" name="phoneNum" value={form.phoneNum} onChange={handleChange} style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Description:</label>
          <textarea name="Description" value={form.Description} onChange={handleChange} required style={{ width: '100%' }} />
        </div>
        <button type="submit">Submit</button>
      </form>
      <p>{status}</p>
    </div>
  );
}
