import React, { useState } from 'react';
import { authService } from '../fbase';

const AuthForm = () => {
	const [newAccount, setNewAccount] = useState(true);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const toggleAccount = () => {
		setNewAccount(!newAccount);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === 'email') {
			setEmail(value);
		} else if (name === 'password') {
			setPassword(value);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			let data;
			if (newAccount) {
				// firebase > auth 사용해서 이메일로 계정 생성
				data = await authService.createUserWithEmailAndPassword(
					email,
					password,
				);
			} else {
				// firebase > auth 사용해서 sign in
				data = await authService.signInWithEmailAndPassword(email, password);
			}
			console.log(data);
		} catch (error) {
			setError(error.message);
		}
	};
	return (
		<>
			<form className="container" onSubmit={handleSubmit}>
				<input
					className="authInput"
					type="text"
					placeholder="Email"
					name="email"
					value={email}
					required
					onChange={handleChange}
				/>
				<input
					className="authInput"
					type="password"
					placeholder="Password"
					name="password"
					value={password}
					required
					onChange={handleChange}
				/>
				<input
					className="authInput authSubmit"
					type="submit"
					value={newAccount ? 'Create Account' : 'Sign In'}
				/>
				{error && <span className="authError">{error}</span>}
			</form>
			<span className="authSwitch" onClick={toggleAccount}>
				{newAccount ? 'Sign In' : 'Create Account'}
			</span>
		</>
	);
};

export default AuthForm;
