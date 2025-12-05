"use client";

import { useState, useEffect } from "react";

export default function DoctorReqTestUI() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('doctorToken');
    const savedEmail = localStorage.getItem('doctorEmail');
    
    // Check if token is in new signed format (contains a dot)
    // Old tokens (random hex) won't work with the new system
    if (savedToken) {
      if (savedToken.includes('.')) {
        // New signed token format - use it
        setToken(savedToken);
      } else {
        // Old token format - clear it and ask user to login again
        console.log('Old token format detected, clearing...');
        localStorage.removeItem('doctorToken');
        setError('Please login again - old token format detected');
      }
    }
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const loginRes = await fetch("/api/doctorLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const loginData = await loginRes.json();

      if (!loginData.success) {
        setError(loginData.error || "Failed to login");
        setLoading(false);
        return;
      }

      setToken(loginData.token);
      localStorage.setItem('doctorToken', loginData.token);
      localStorage.setItem('doctorEmail', email);
      alert("Login successful! Token saved.");
    } catch (err) {
      console.error(err);
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = async () => {
    if (!token) {
      setError("Please login first to get a token");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      console.log('Fetching with token:', token.substring(0, 30) + '...');
      console.log('Token length:', token.length);
      console.log('Token format:', token.includes('.') ? 'signed (new)' : 'hex (old)');
      
      const res = await fetch("/DoctorReq", {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${token.trim()}`,
          'Content-Type': 'application/json'
        },
      });

      const result = await res.json();
      console.log('Response status:', res.status);
      console.log('Response data:', result);

      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError("Request failed: " + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", fontFamily: "sans-serif", padding: "1rem" }}>
      <h2>Doctor Requests Test UI</h2>
      
      <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
        <h3>Step 1: Login</h3>
        <input
          type="email"
          placeholder="Doctor Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ padding: "0.5rem 1rem", marginRight: "1rem" }}
        >
          {loading ? "Logging in..." : "Login & Get Token"}
        </button>
        {token && (
          <div style={{ marginTop: "1rem", padding: "0.5rem", background: "#f0f0f0", borderRadius: "4px", fontSize: "0.9rem" }}>
            <strong>Token:</strong> {token.substring(0, 20)}...
          </div>
        )}
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h3>Step 2: Fetch Doctor Requests</h3>
        <button
          onClick={handleFetch}
          disabled={loading || !token}
          style={{ padding: "0.5rem 1rem" }}
        >
          {loading ? "Loading..." : "Fetch Doctor Requests"}
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginTop: "1rem", padding: "1rem", background: "#ffe6e6", borderRadius: "4px" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div style={{ marginTop: "1rem" }}>
          <h3>Response:</h3>
          <pre style={{ background: "#f5f5f5", padding: "1rem", borderRadius: "4px", overflow: "auto", maxHeight: "500px" }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

