import {
	Button,
	Card,
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
	Typography,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PasswordIcon from "@mui/icons-material/Password";

import "./Login.css";
import { useState } from "react";
import { createAccount, fetchAccountData } from "../../api/Account";
import { useNavigate } from "react-router-dom";
import { Account } from "../../interfaces/AccountInterfaces";

const Login = () => {
	const [visible, setVisible] = useState(false);
	const [contentFilter, setContentFilter] = useState("");
	const [email, setEmail] = useState("");
	const [malUsername, setMalUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleChangeContentFilter = (event: SelectChangeEvent) => {
		setContentFilter(event.target.value as string);
	};

	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};

	const handleMalUsernameChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setMalUsername(event.target.value);
	};

	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	};

	const handleConfirmPasswordChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setConfirmPassword(event.target.value);
	};

	const handleLogin = async () => {
		console.log(email, password, malUsername, contentFilter);
		fetchAccountData().then((response) => {
			response.forEach((element: Account) => {
				if (element.email === email && element.password === password) {
					console.log("Login Successful");
					navigate("/", {
						state: { malAccount: element },
					});
				} else {
					setEmail("");
					setPassword("");
				}
			});
		});
	};

	const handleRegister = async () => {
		if (password === confirmPassword) {
			createAccount({
				email: email,
				username: malUsername,
				password: password,
				contentFilter: contentFilter,
			}).then((response) => {
				navigate("/", {
					state: { malAccount: response },
				});
			});
		} else {
			setPassword("");
			setConfirmPassword("");
			console.log("Passwords do not match");
		}
	};
	const navigate = useNavigate();

	return (
		<div className='login-page'>
			{visible === true ? (
				<Card className='login-card' elevation={5}>
					<Typography className='register-header'>Register</Typography>
					<div>
						<div className='register-section'>
							<Typography className='register-text-field-headers'>
								Email
							</Typography>
							<div className='register-icon-field-container'>
								<PersonOutlineIcon className='register-field-icons' />

								<input
									type='text'
									className='register-input-fields'
									placeholder='Email'
									value={email}
									onChange={handleEmailChange}
								/>
							</div>
						</div>
						<div className='register-section'>
							<Typography className='register-text-field-headers'>
								MAL Username (Optional)
							</Typography>
							<div className='register-icon-field-container'>
								<PersonOutlineIcon className='register-field-icons' />

								<input
									type='text'
									className='register-input-fields'
									placeholder='My Anime List Username'
									value={malUsername}
									onChange={handleMalUsernameChange}
								/>
							</div>
						</div>
						<div className='register-section'>
							<Typography className='register-text-field-headers'>
								Password
							</Typography>
							<div className='register-icon-field-container'>
								<PasswordIcon className='register-field-icons' />
								<input
									type='password'
									className='register-input-fields'
									placeholder='Password'
									value={password}
									onChange={handlePasswordChange}
								/>
							</div>
						</div>
						<div className='register-section'>
							<Typography className='register-text-field-headers'>
								Confirm Password
							</Typography>
							<div className='register-icon-field-container'>
								<PasswordIcon className='register-field-icons' />
								<input
									type='password'
									className='register-input-fields'
									placeholder='Confirm Password'
									value={confirmPassword}
									onChange={handleConfirmPasswordChange}
								/>
							</div>
						</div>
						<div className='register-section'>
							<Typography className='register-text-field-headers'>
								Content Filter
							</Typography>

							<div className='content-filter-selection-box'>
								<FormControl fullWidth>
									<Select
										className='content-filter-dropdown'
										value={contentFilter}
										label='Content Filter'
										variant='standard'
										disableUnderline={true}
										onChange={handleChangeContentFilter}
									>
										<MenuItem value={1}>Safe</MenuItem>
										<MenuItem value={2}>Suggestive</MenuItem>
										<MenuItem value={3}>Explicit</MenuItem>
										<MenuItem value={4}>Pornographic</MenuItem>
									</Select>
								</FormControl>
							</div>
						</div>
					</div>
					<Button
						variant='contained'
						className='register-button'
						onClick={() => {
							handleRegister();
						}}
					>
						Register
					</Button>
				</Card>
			) : (
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
								value={email}
								onChange={handleEmailChange}
							/>
						</div>
					</div>
					<div>
						<Typography
							fontFamily='Figtree'
							className='login-text-field-headers'
						>
							Password
						</Typography>
						<div className='login-icon-field-container'>
							<PasswordIcon className='login-field-icons' />
							<input
								type='password'
								className='login-input-fields'
								placeholder='Password'
								value={password}
								onChange={handlePasswordChange}
							/>
						</div>
						<Button className='forgot-password-button'>
							<Typography
								textTransform='none'
								fontSize={12}
								fontFamily='Figtree'
							>
								Forgot Password?
							</Typography>
						</Button>
					</div>

					<Button
						variant='contained'
						className='login-button'
						onClick={() => {
							handleLogin();
						}}
					>
						<Typography fontFamily='Figtree' textTransform='none'>
							Login
						</Typography>
					</Button>

					<Button
						className='register-button'
						onClick={() => {
							setVisible(true);
							setEmail("");
							setPassword("");
						}}
					>
						<Typography fontFamily='Figtree' textTransform='none'>
							Register
						</Typography>
					</Button>
				</Card>
			)}
		</div>
	);
};

export default Login;
