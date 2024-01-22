import { UserRoom, Message } from '../../shared/chats.interface';
import './Chat.css';
import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';
import { IFriends } from '../../contexts/UserContext';
import { useEffect, useState } from 'react';


export default function Messages({
	user,
	messages,
	friends,
}: {
	user: Pick<UserRoom, 'userId' | 'userName'>;
	messages: Message[];
	friends: IFriends[] | null;
}) {
	const [done, setDone] = useState(false);

	useEffect(() => {
		if (done === false) {
			const anchor = document.getElementsByClassName('anchor')[0];
			anchor.scrollIntoView({
				behavior: "smooth"
			});
			setDone(true);
		}
	}, [done]);

	useEffect(() => {
		setTimeout(() => {
			if (done === false) {
				const anchor = document.getElementsByClassName('anchor')[0];
				anchor.scrollIntoView({
					behavior: "smooth"
				});
				setDone(true);
			}
		}, 10);
	}, [done]);

	const anchor = document.getElementsByClassName('anchor')[0];
	setTimeout(() => {
		const anchor = document.getElementsByClassName('anchor')[0];
		anchor?.scrollIntoView({
			// behavior: "smooth"
		});
	}, 5);

	const reversedMessages = messages.slice().reverse();
	if (!friends) {
		return (
			<div className="scrollable">
				{reversedMessages.map((message, index) => {
					const isUserMessage = user.userId === message.user.userId;
					const answerClass = isUserMessage ? 'answer right' : 'answer left';
					return (
						<div key={index} className={answerClass}>
							<div className="avatar">
								<Image src={message.user.avatarPath} alt="User name" roundedCircle fluid />
								<div className="status offline"></div>
							</div>
							<div className="name"><Link to={`/profile/${message.user.userId}`} className="link-text">{message.user.userName}</Link></div>
							<div className="text">{message.message}</div>
							<div className="time">{message.timeSent}</div>
						</div>
					);
				})}
				<div className="anchor answer right">coucou</div>
			</div>
		);

	}
	else {
		return (
			<div className="scrollable">
				{reversedMessages.map((message, index) => {
					const isUserMessage = user.userId === message.user.userId;
					const answerClass = isUserMessage ? 'answer right' : 'answer left';

					const isBlocked = friends.find(
						(friend) =>
							(friend.user1.id !== user.userId && friend.user1.id === message.user.userId) ||
							(friend.user2.id !== user.userId && friend.user2.id === message.user.userId)
					);

					return !isBlocked &&
						<div key={index} className={answerClass}>
							<div className="avatar">
								<Image src={message.user.avatarPath} alt="User name" roundedCircle fluid />
								<div className="status offline"></div>
							</div>
							<div className="name"><Link to={`/profile/${message.user.userId}`} className="link-text">{message.user.userName}</Link></div>
							<div className="text">{message.message}</div>
							<div className="time">{message.timeSent}</div>
						</div>
				})}
				<div className="anchor answer right">coucou</div>
			</div>
		);
	}
};
