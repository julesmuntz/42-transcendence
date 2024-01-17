import { UserRoom, Message } from '../../shared/chats.interface';
import './Chat.css';
import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';
import { IFriends } from '../../contexts/UserContext';

export default function Messages({
	user,
	messages,
	friends,
}: {
	user: Pick<UserRoom, 'userId' | 'userName'>;
	messages: Message[];
	friends: IFriends[] | null;
})
{
	// const messagesRef = useRef<HTMLDivElement>(null);
	// const [isUserAtBottom, setIsUserAtBottom] = useState(true);

	// useEffect(() => {
	// 	const messagesContainer = messagesRef.current;
	// 	if (messagesContainer && isUserAtBottom) {
	// 		messagesContainer.scrollTop = messagesContainer.scrollHeight;
	// 	}
	// }, [messages, isUserAtBottom]);

	// const handleScroll = () => {
	// 	const messagesContainer = messagesRef.current;
	// 	if (
	// 		messagesContainer &&
	// 		messagesContainer.scrollHeight - messagesContainer.scrollTop ===
	// 		messagesContainer.clientHeight
	// 	) {
	// 		setIsUserAtBottom(true);
	// 	} else {
	// 		setIsUserAtBottom(false);
	// 	}
	// };

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
			</div>
		  );

	}

};
