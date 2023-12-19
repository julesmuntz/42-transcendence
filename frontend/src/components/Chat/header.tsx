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
	<header className="flex h-1/6 flex-col pt-12">
		<div className="flex justify-between">
		  <div className="flex h-8 items-center">
			<span className="ml-1">{isConnected ? '🟢' : '🔴'}</span>
			<span className="px-2 text-3xl text-white">{'/'}</span>
			<span className=" text-white">{roomName}</span>
		  </div>
		  <div className="flex">
			<button
			  onClick={() => handleUsersClick()}
			  className="ml-1 flex h-8 items-center rounded-xl bg-gray-800 px-4"
			>
			  <span className="mr-1 text-lg text-white">{'👨‍💻'}</span>
			  <span className="ml-1 text-white">{users.length}</span>
			</button>
			<button
			  onClick={() => handleLeaveRoom()}
			  className="ml-1 flex h-8 items-center rounded-xl bg-gray-800 px-4"
			>
			  <span className="mr-1 text-white">{'Leave'}</span>
			</button>
		  </div>
		</div>
	</header>
	)

}

export const UserList = ({ room }: { room: Room }) => {
	return (
	  <div className="flex h-4/6 w-full flex-col-reverse overflow-y-scroll">
		{room.users.map((user, index) => {
		  return (
			<div key={index} className="mb-4 flex rounded px-4 py-2">
			  <p className="text-white">{user.userName}</p>
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
		{messages?.map((message, index) => {
		  return (
			<div key={index}>
			  <div className={determineMessageStyle(user, message.user.userId).sender}>
				<span className="text-sm text-gray-400">{message.user.userName}</span>
				<span className="text-sm text-gray-400">{' ' + '•' + ' '}</span>
				<span className="text-sm text-gray-400">{message.timeSent}</span>
			  </div>
			  <div className={determineMessageStyle(user, message.user.userId).message}>
				<p className="text-white">{message.message}</p>
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
			className="mb-2 max-h-16 flex-grow appearance-none rounded-md border-none bg-gray-800 text-white placeholder-slate-400 focus:outline-none focus:ring-transparent"
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