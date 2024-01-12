import React, { useEffect, useRef, useState } from 'react';
import { UserRoom, Room, Message } from '../../shared/chats.interface';
import { Socket } from 'socket.io-client';
import './Chat.css';

export const Messages = ({
	user,
	messages,
}: {
	user: Pick<UserRoom, 'userId' | 'userName'>;
	messages: Message[];
}) => {
	const messagesRef = useRef<HTMLDivElement>(null);
	const [isUserAtBottom, setIsUserAtBottom] = useState(true);

	useEffect(() => {
		const messagesContainer = messagesRef.current;
		if (messagesContainer && isUserAtBottom) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	}, [messages, isUserAtBottom]);

	const handleScroll = () => {
		console.log('toto');
		const messagesContainer = messagesRef.current;
		if (
			messagesContainer &&
			messagesContainer.scrollHeight - messagesContainer.scrollTop ===
			messagesContainer.clientHeight
		) {
			setIsUserAtBottom(true);
		} else {
			setIsUserAtBottom(false);
		}
	};

	const reversedMessages = messages.slice().reverse();

	return (
		<div
			className="nano has-scrollbar"
			style={{ overflowY: 'hidden' }}
		>
			<div
				className="nano-content pad-all"
				tabIndex={0}
				ref={messagesRef}
				// onScroll={handleScroll}
			>
				<ul
					className="list-unstyled media-block"
					style={{ marginBottom: '0', paddingBottom: '10px' }}
				>
					{reversedMessages.map((message, index) => {
						const isUserMessage = user.userId === message.user.userId;
						const speechClass = isUserMessage ? 'speech-right' : '';
						return (
							<li key={index} className="mar-btm">
								<div className={isUserMessage ? 'media-right' : 'media-left'}>
									{/* <img src="" className="img-circle img-sm" alt="Profile Picture" /> */}
								</div>
								<div className={`media-body pad-hor ${speechClass}`}>
									<div className="speech">
										{/* <a href="#" className="media-heading"> */}
										{message.user.userName}
										{/* </a> */}
										<p>{message.message}</p>
										<p className="speech-time">
											<i className="fa fa-clock-o fa-fw"></i> {message.timeSent}
										</p>
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
			<div className="nano-pane">
				<div
					className="nano-slider"
					style={{ height: '141px', transform: 'translate(0px, 0px)' }}
				></div>
			</div>
		</div>
	);
};

export const MessageForm = ({ sendMessage }: { sendMessage: (message: string) => void }) => {
	const textAreaRef = useRef<HTMLInputElement>(null)

	const submit = (e: any) => {
		e.preventDefault()
		const value = textAreaRef?.current?.value
		if (value) {
			sendMessage(value)
			textAreaRef.current.value = ''
		}
	}

	const handleKeyDown = (e: any) => {
		if (e.key === 'Enter') {
			submit(e)
		}
	}

	return (
		<div className="panel-footer">
			<div className="row">
				<div className="col-xs-9" style={{ width: '80%' }}>
					<input
						type="text"
						placeholder="Enter your text"
						className="form-control chat-input"
						ref={textAreaRef}
						onKeyDown={(e) => handleKeyDown(e)}
					/>
				</div>
				<div className="col-xs-3" style={{ width: '20%' }}>
					<button className="btn btn-primary btn-block" type="submit" onClick={(e) => submit(e)}>Send</button>
				</div>
			</div>
		</div>
	)
}