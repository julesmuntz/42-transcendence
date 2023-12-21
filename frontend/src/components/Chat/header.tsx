import React, { useRef }  from 'react'
import { UserRoom, Room, Message } from "../../shared/chats.interface"

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
		<div className="panel-heading">
		<div className="panel-control">
			<div className="btn-group">
				<button className="btn btn-default" type="button" data-toggle="collapse" data-target="#demo-chat-body"><i className="fa fa-chevron-down"></i></button>
				<button type="button" className="btn btn-default" data-toggle="dropdown"><i className="fa fa-gear"></i></button>
				<ul className="dropdown-menu dropdown-menu-right">
					<li><a href="#">Available</a></li>
					<li><a href="#">Busy</a></li>
					<li><a href="#">Away</a></li>
					<li className="divider"></li>
					<li><a id="demo-connect-chat" href="#" className="disabled-link" data-target="#demo-chat-body">Connect</a></li>
					<li><a id="demo-disconnect-chat" href="#" data-target="#demo-chat-body">Disconect</a></li>
				</ul>
			</div>
		</div>
		<h3 className="panel-title">Chat</h3>
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

const determineMessageStyle = (
	user: Pick<UserRoom, 'userId' | 'userName'>,
	messageUserId: number
  ) => {
	if (user && messageUserId === user.userId) {
	  return {
		message: 'bg-slate-500 p-4 ml-24 mb-4 rounded break-words',
		sender: 'ml-24 pl-4',
	  };
	} else {
	  return {
		message: 'bg-slate-800 p-4 mr-24 mb-4 rounded break-words',
		sender: 'mr-24 pl-4',
	  };
	}
  };



export const Messages = ({
	user,
	messages,
	}: {
	user: Pick<UserRoom, 'userId' | 'userName'>
	messages: Message[]
  	}) => {
	return (
	  <div className="flex h-4/6 w-full flex-col-reverse overflow-y-scroll">
		dhjkwsghd
		{messages?.map((message, index) => {
		  return (
			<div key={index}>
			  <div className={determineMessageStyle(user, message.user.userId).sender}>
				<span className="text-sm text-gray-400">{message.user.userName}</span>
				<span className="text-sm text-gray-400">{' ' + '•' + ' '}</span>
				<span className="text-sm text-gray-400">{message.timeSent}</span>
			  </div>
			  <div className={determineMessageStyle(user, message.user.userId).message}>
				<p className="text-black">{message.message}</p>
			  </div>
			</div>
		  )
		})}
	  </div>
	)
}

export const MessageForm = ({ sendMessage }: { sendMessage: (message: string) => void }) => {
	const textAreaRef = useRef<HTMLTextAreaElement>(null)

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
	  <div className="flex h-1/6 items-center">
		<form className="flex w-full appearance-none rounded-md bg-gray-800 outline-none focus:outline-none">
		  <textarea
			ref={textAreaRef}
			onKeyDown={(e) => handleKeyDown(e)}
			id="minput"
			placeholder="Message"
			// className="mb-2 max-h-16 flex-grow appearance-none rounded-md border-none bg-gray-800 text-white placeholder-slate-400 focus:outline-none focus:ring-transparent"
		  ></textarea>
		  <button onClick={(e) => submit(e)} className="self-end p-2 text-slate-400">
			<svg
			  xmlns="http://www.w3.org/2000/svg"
			  fill="none"
			  viewBox="0 0 24 24"
			  strokeWidth={1.5}
			  stroke="currentColor"
			  className="h-4 w-4 bg-gray-800"
			>
			  <path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
			  />
			</svg>
		  </button>
		</form>
	  </div>
	)
  }