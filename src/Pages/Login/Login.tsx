import { Button, Card, Typography } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PasswordIcon from "@mui/icons-material/Password";

import "./Login.css";
import { fetchAccountData, createAccount } from "../../api/Account";
import { Account } from "../../interfaces/AccountInterfaces";
import { useState } from "react";

const Login = () => {
	const [account, setAccount] = useState({
		email: "test",
		password: "test",
		username: "test",
		contentFilter: 1,
	});
	return (
		<div className='login-page'>
			<Card className='login-card' elevation={5}>
				<Typography className='login-header'>Login</Typography>
				<div>
					<Typography className='login-text-field-headers'>Email</Typography>
					<div className='login-icon-field-container'>
						<PersonOutlineIcon className='login-field-icons' />

						<input
							type='text'
							className='login-input-fields'
							placeholder='Email'
						/>
					</div>
				</div>
				<div>
					<Typography className='login-text-field-headers'>Password</Typography>
					<div className='login-icon-field-container'>
						<PasswordIcon className='login-field-icons' />
						<input
							type='text'
							className='login-input-fields'
							placeholder='Password'
						/>
					</div>
					<Button className='forgot-password-button'>
						<Typography textTransform='none' fontSize={12}>
							Forgot Password?
						</Typography>
					</Button>
				</div>

				<Button variant='contained' className='login-button'>
					Login
				</Button>

				<Button
					onClick={() => {
						console.log(account);
						createAccount(account);
					}}
				>
					fast create
				</Button>
				<Button
					className='register-button'
					onClick={() => {
						fetchAccountData();
					}}
				>
					<Typography textTransform='none' className='register-text'>
						Register
					</Typography>
				</Button>
			</Card>
		</div>
	);
};

export default Login;
