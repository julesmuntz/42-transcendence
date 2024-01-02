import React, { useEffect, useRef, useState }  from 'react'
import { UserRoom, Room, Message } from "../../shared/chats.interface"
import "./Chat.css"
export const Header = ({
	isConnected,
	users,
	handleUsersClick,
	handleLeaveRoom,
	roomName,
	}: {
	isConnected: boolean
	users: UserRoom[]
	handleUsersClick: () => void
	handleLeaveRoom: () => void
	roomName: string
	}) => {
	return (
	// 	<header className="flex h-1/6 flex-col pt-12">
    //   <div className="flex justify-between">
    //     <div className="flex h-8 items-center">
    //       <span className="ml-1">{isConnected ? '🟢' : '🔴'}</span>
    //       <span className="px-2 text-3xl text-white">{'/'}</span>
    //       <span className=" text-white">{roomName}</span>
    //     </div>
    //     <div className="flex">
    //       <button
    //         onClick={() => handleUsersClick()}
    //         className="ml-1 flex h-8 items-center rounded-xl bg-gray-800 px-4"
    //       >
    //         <span className="mr-1 text-lg text-white">{'👨‍💻'}</span>
    //         <span className="ml-1 text-white">{users.length}</span>
    //       </button>
    //       <button
    //         onClick={() => handleLeaveRoom()}
    //         className="ml-1 flex h-8 items-center rounded-xl bg-gray-800 px-4"
    //       >
    //         <span className="mr-1 text-white">{'Leave'}</span>
    //       </button>
    //     </div>
    //   </div>
    // </header>

	<div className="panel-heading">
	<div className="panel-control">
		<div className="btn-group">
			<button className="btn btn-default" type="button" onClick={() => handleUsersClick()}> <span className="mr-1 text-lg text-white">{'👨‍💻'}</span>
            <span className="ml-1 text-black">{users.length}</span></button>
			<button type="button" className="btn btn-default" data-toggle="dropdown"><i
					className="fa fa-gear"></i></button>
		</div>
	</div>
	<h3 className="panel-title">{roomName} <span className="ml-1">{isConnected ? '🟢' : '🔴'}</span></h3>
</div>
	)

}

export const UserList = ({ room }: { room: Room }) => {
	return (
	  <div className="flex h-4/6 w-full flex-col-reverse overflow-y-scroll">
		mdwiok
		{room.users.map((user, index) => {
		  return (
			<div key={index} className="mb-4 flex rounded px-4 py-2">
			  <p className="text-black">{user.userName}</p>
			  {room.host.userId === user.userId && <span className="ml-2">{'👑'}</span>}
			</div>
		  )
		})}
	  </div>
	)
}


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
		style={{ height: '380px', overflowY: 'auto' }}
	  >
		<div
		  className="nano-content pad-all"
		  tabIndex={0}
		  style={{ right: '-17px' }}
		  ref={messagesRef}
		  onScroll={handleScroll}
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
					<img src="" className="img-circle img-sm" alt="Profile Picture" />
				  </div>
				  <div className={`media-body pad-hor ${speechClass}`}>
					<div className="speech">
					  <a href="#" className="media-heading">
						{message.user.userName}
					  </a>
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
			<div className="col-xs-9" style={{width: '80%'}}>
			  <input
				type="text"
				placeholder="Enter your text"
				className="form-control chat-input"
				ref={textAreaRef}
				onKeyDown={(e) => handleKeyDown(e)}
			  />
			</div>
			<div className="col-xs-3"style={{width: '20%'}}>
			  <button className="btn btn-primary btn-block" type="submit" onClick={(e) => submit(e)}>Send</button>
			</div>
		  </div>
		</div>
	  )
	}