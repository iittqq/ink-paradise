import { Button, Card, Typography } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PasswordIcon from "@mui/icons-material/Password";

import "./Login.css";

const Login = () => {
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
			</Card>
		</div>
	);
};

export default Login;
