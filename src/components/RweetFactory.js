import React, { useState } from 'react';
import { dbService, storageService } from '../fbase';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const RweetFactory = ({ userObj }) => {
	const [attachment, setAttachment] = useState('');
	const [rweet, setRweet] = useState('');

	const onSubmit = async (e) => {
		if (rweet === '') {
			return;
		}
		// promise기 때문에 async await을 사용
		e.preventDefault();
		let attachmentUrl = '';
		if (attachment !== '') {
			const attachmentRef = storageService
				.ref()
				.child(`${userObj.uid}/${uuidv4()}`);
			const response = await attachmentRef.putString(attachment, 'data_url');
			attachmentUrl = await response.ref.getDownloadURL();
		}

		const rweetObj = {
			text: rweet,
			createdAt: Date.now(),
			creatorId: userObj.uid,
			attachmentUrl,
		};
		// firebase > firestore 사용해서 트윗 데이터를 저장한다.
		await dbService.collection('rweets').add(rweetObj);
		setRweet('');
		setAttachment('');
	};
	const onChange = (e) => {
		const { value } = e.target;
		setRweet(value);
	};

	const onFileChange = (e) => {
		const { files } = e.target;
		const theFile = files[0];
		const reader = new FileReader();
		reader.onloadend = (finishedEvent) => {
			const { result } = finishedEvent.currentTarget;
			setAttachment(result);
		};
		reader.readAsDataURL(theFile);
	};

	const onClearAttachment = () => setAttachment('');
	return (
		<div>
			<form onSubmit={onSubmit} className="factoryForm">
				<div className="factoryInput__container">
					<input
						className="factoryInput__input"
						value={rweet}
						onChange={onChange}
						type="text"
						placeholder="What's on your mind?"
						maxLength={120}
					/>
					<input type="submit" value="&rarr;" className="factoryInput__arrow" />
				</div>
				<label for="attach-file" className="factoryInput__label">
					<span>Add photos</span>
					<FontAwesomeIcon icon={faPlus} />
				</label>
				<input
					id="attach-file"
					type="file"
					accept="image/*"
					onChange={onFileChange}
					style={{
						opacity: 0,
					}}
				/>
				{attachment && (
					<div className="factoryForm__attachment">
						<img
							src={attachment}
							style={{
								backgroundImage: attachment,
							}}
							alt="img"
						/>
						<div className="factoryForm__clear" onClick={onClearAttachment}>
							<span>Remove</span>
							<FontAwesomeIcon icon={faTimes} />
						</div>
					</div>
				)}
			</form>
		</div>
	);
};

export default RweetFactory;
