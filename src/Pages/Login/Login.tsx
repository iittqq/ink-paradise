import { Button, Card, Typography } from "@mui/material";
import React from "react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PasswordIcon from "@mui/icons-material/Password";

import "./Login.css";

const Login = () => {
	return (
		<div className='login-page'>
			<Card className='login-card' elevation={5}>
				<Typography>Login</Typography>
				<div>
					<Typography className='login-text-field-headers'>Email</Typography>
					<div className='login-icon-field-container'>
						<PersonOutlineIcon className='login-field-icons' />

						<input
							type='text'
							className='login-input-fields'
							placeholder='Username'
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
				</div>
				<Button>
					<Typography>Forgot?</Typography>
				</Button>
				<Button variant='contained' className='login-button'>
					Login
				</Button>
			</Card>
		</div>
	);
};

export default Login;
