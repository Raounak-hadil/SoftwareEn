"use client";
import SignIn from "./SignIn1";
import SignIn2 from "./SignIn2";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function RegisterContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // "hospital" or "doctor"
  
  const [page, setPage] = useState(true);
  useEffect(() => {
    if (type === "hospital") setPage(true);
    if (type === "doctor") setPage(false);
  }, [type]);
  
  return <div>{page ? <SignIn page={page} setPage={setPage}/> : <SignIn2 />}</div>;
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
