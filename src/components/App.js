import React, { useEffect, useState } from 'react';
import AppRouter from './Router';
import { authService } from 'fbase';

function App() {
	const [init, setInit] = useState(false);
	const [userObj, setUserObj] = useState(null);

	const refreshUser = () => {
		const user = authService.currentUser;
		setUserObj({
			displayName: user.displayName,
			uid: user.uid,
			updateProfile: (args) => user.updateProfile(args),
		});
	};
	useEffect(() => {
		// 로그인, 로그아웃 변화를 감지
		authService.onAuthStateChanged((user) => {
			if (user) {
				setUserObj(user);
			} else {
				setUserObj(null);
			}
			setInit(true);
		});
	}, []);
	return (
		<>
			{init ? (
				<AppRouter
					isLoggedIn={Boolean(userObj)}
					userObj={userObj}
					refreshUser={refreshUser}
				/>
			) : (
				'Initializing...'
			)}
		</>
	);
}

export default App;
