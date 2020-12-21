import React, { useState } from 'react';
import { dbService, storageService } from '../fbase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const Rweet = ({ rweetObj, isOwner }) => {
	const [editing, setEditing] = useState(false);
	const [newRweet, setNewRweet] = useState(rweetObj.text);
	const onDeleteClick = async () => {
		const ok = window.confirm('Are you sure you want to delete this rweet?');
		if (ok) {
			await dbService.doc(`rweets/${rweetObj.id}`).delete();
			// storage 파일 삭제
			await storageService.refFromURL(rweetObj.attachmentUrl).delete();
		}
	};
	const toggleEditing = () => setEditing(!editing);
	const onChageText = (e) => {
		const { value } = e.target;
		setNewRweet(value);
	};
	const onSubmit = (e) => {
		e.preventDefault();
		// firestore > doc > path를 입력해주고 update 할 필드와 값을 넣어줌
		dbService.doc(`rweets/${rweetObj.id}`).update({
			text: newRweet,
		});
		toggleEditing();
	};
	return (
		<div className="nweet">
			{editing ? (
				<>
					<form className="container nweetEdit" onSubmit={onSubmit}>
						<input
							className="formInput"
							type="text"
							value={newRweet}
							onChange={onChageText}
							autoFocus
						/>
						<input className="formBtn" type="submit" value="Update Rweet" />
					</form>
					<span onClick={toggleEditing} className="formBtn cancelBtn">
						Cancel
					</span>
				</>
			) : (
				<>
					<h4>{rweetObj.text}</h4>
					{rweetObj.attachmentUrl && (
						<img src={rweetObj.attachmentUrl} alt="img" />
					)}
					{/* 로그인한 유저가 자신일 때만 버튼 렌더링 */}
					{isOwner && (
						<div class="nweet__actions">
							<span onClick={onDeleteClick}>
								<FontAwesomeIcon icon={faTrash} />
							</span>
							<span onClick={toggleEditing}>
								<FontAwesomeIcon icon={faPencilAlt} />
							</span>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default Rweet;
