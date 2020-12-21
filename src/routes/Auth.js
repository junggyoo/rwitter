import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faTwitter,
	faGoogle,
	faGithub,
} from '@fortawesome/free-brands-svg-icons';
import AuthForm from '../components/AuthForm';
import { authService, firebaseInstance } from '../fbase';

const Auth = () => {
	const onSocialClick = async (e) => {
		const { name } = e.target;
		let provider;
		if (name === 'google') {
			// firebase.auth > Provider 사용해서 소셜 로그인
			provider = new firebaseInstance.auth.GoogleAuthProvider();
		} else if (name === 'github') {
			// firebase.auth > Provider 사용해서 소셜 로그인
			provider = new firebaseInstance.auth.GithubAuthProvider();
		}
		const data = await authService.signInWithPopup(provider);
		console.log(data);
	};
	return (
		<div className="authContainer">
			<FontAwesomeIcon
				icon={faTwitter}
				color={'#04AAFF'}
				size="3x"
				style={{ marginBottom: 30 }}
			/>
			<AuthForm />
			<div className="authBtns">
				{/* 이 부분도 컴포넌트로 빼도 됨 */}
				<button className="authBtn" name="google" onClick={onSocialClick}>
					Continue with Google <FontAwesomeIcon icon={faGoogle} />
				</button>
				<button className="authBtn" name="github" onClick={onSocialClick}>
					Continue with Github <FontAwesomeIcon icon={faGithub} />
				</button>
			</div>
		</div>
	);
};
export default Auth;
