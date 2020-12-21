import React, { useEffect, useState } from 'react';
import Rweet from '../components/Rweet';
import RweetFactory from '../components/RweetFactory';
import { dbService } from '../fbase';

const Home = ({ userObj }) => {
	const [rweets, setRweets] = useState([]);

	useEffect(
		(rweets) => {
			// firebase > firestore > onSnapshot 을 사용해서 실시간으로 데이터를 받아온다.
			// listener로 snapshot을 사용하고있고, 데이터베이스에서 무슨일이 있을 떄 알림을 받는 역할
			dbService.collection('rweets').onSnapshot((snapshot) => {
				const rweetArray = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setRweets(rweetArray);
			});
		},
		[rweets],
	);

	return (
		<div className="container">
			<RweetFactory userObj={userObj} />
			<div style={{ marginTop: 30 }}>
				{rweets.map((rweet) => (
					<Rweet
						key={rweet.id}
						rweetObj={rweet}
						isOwner={rweet.creatorId === userObj.uid}
					/>
				))}
			</div>
		</div>
	);
};
export default Home;
