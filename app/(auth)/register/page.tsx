"use client";

import SignIn from "./SignIn1";
import SignIn2 from "./SignIn2";
import { useState } from 'react';


export default function RegisterPage() {
	const [page, setPage] = useState(true);
  return (
		<html>
		<body>
		{page ? (
    		<SignIn page={page} setPage={setPage}/>
  			) : (
    		<SignIn2/>
  		)};
		</body>
		</html>
	);
}