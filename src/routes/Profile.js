import React, { useEffect, useState } from 'react';
import { authService, dbService } from 'fbase';
import { useHistory } from 'react-router-dom';

const Profile = ({ userObj, refreshUser }) => {
	const [newDisplayName, setNewDisplayName] = useState(
		userObj.displayName || '',
	);
	const history = useHistory();
	const onLogOutClick = () => {
		authService.signOut();
		history.push('/');
	};
	const getMyRweets = async () => {
		try {
			const rweets = await dbService
				.collection('rweets')
				.where('creatorId', '==', userObj.uid)
				.orderBy('createdAt')
				.get();
			console.log(rweets.docs.map((doc) => doc.data()));
		} catch (error) {
			console.log(error);
		}
	};

	const onChange = (e) => {
		const { value } = e.target;
		setNewDisplayName(value);
	};
	const onSubmit = async (e) => {
		e.preventDefault();
		if (userObj.displayName !== newDisplayName) {
			await userObj.updateProfile({
				displayName: newDisplayName,
			});
		}
		refreshUser();
	};
	useEffect(() => {
		getMyRweets();
	});
	return (
		<div className="container">
			<form className="profileForm" onSubmit={onSubmit}>
				<input
					className="formInput"
					type="text"
					placeholder="Display name"
					autoFocus
					onChange={onChange}
					value={newDisplayName}
				/>
				<input
					type="submit"
					value="Update Profile"
					className="formBtn"
					style={{
						marginTop: 10,
					}}
				/>
			</form>
			<span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
				Log Out
			</span>
		</div>
	);
};
export default Profile;
