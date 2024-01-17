import { UserRoom, ChannelType } from "../../shared/chats.interface"
import "./Chat.css"

export const Header = ({
	isConnected,
	users,
	isChannel,
	handleUsersClick,
	handleLeaveRoom,
	handleDestroyRoom,
	handleChangePasswordEvent,
	roomName,
	roomType
}: {
	isConnected: boolean
	users: UserRoom
	isChannel: boolean
	handleUsersClick: () => void
	handleLeaveRoom: () => void
	handleDestroyRoom : () => void
	handleChangePasswordEvent: (password: string) => void
	roomName: string
	roomType: ChannelType
	}) => {

	return (
		<div className="panel-heading">
			<div className="panel-control">
				<div className="btn-group">
					{/* Button to leave the room if it's a channel */}
					{isChannel && (
						<button className="btn btn-default" type="button" onClick={() => handleLeaveRoom()}>
							<span className="mr-1 text-lg text-white">{'🚪'}</span>
							<span className="ml-1 text-white">Leave</span>
						</button>
					)}

					{/* Button to show users if it's a channel and the user is an owner or admin */}
					{isChannel && (users.type === 'Owner' || users.type === 'Admin') && (
						<button className="btn btn-default" type="button" onClick={() => handleUsersClick()}>
							<span className="mr-1 text-lg text-white">{'👨‍💻'}</span>
						</button>
					)}

					{/* Button to show additional options (gear icon) */}
					{isChannel && users.type === 'Owner' &&
					<button type="button" className="btn btn-default"onClick={() => handleDestroyRoom()}>
						<span className="mr-1 text-lg text-white">{'🗑️'}</span>
					</button>
					}

					{isChannel && (users.type === 'Owner' && roomType === 'protected') && (
						<button type="button" className="btn btn-default" onClick={() => {
							const password = prompt('Enter new password');
							if (!password) {
								alert('Please fill in all fields');
								return;
							}
							handleChangePasswordEvent(password);
						}
						}>
							<span className="mr-1 text-lg text-white">{'🔒'}</span>
						</button>
					)}
				</div>
			</div>

			{/* Display the room name and connection status */}
			<h3 className="panel-title">
				{roomName} <span className="ml-1">{isConnected ? '🟢' : '🔴'}</span>
			</h3>
		</div>
	);

}

//ajouter est la room est un channel mettre un bouton kick ban mute unmute unban est un bouton pour changer le nom de la room
// Import necessary dependencies if needed
export const UserList = ({ user, hostId, user_a, handleBanUnBan, handelMuteUnMute, handleKick, handlePromote }: { user: UserRoom[], hostId: number, user_a: UserRoom, handleBanUnBan: (user: UserRoom) => void, handelMuteUnMute: (user: UserRoom) => void, handleKick: (user: UserRoom) => void, handlePromote: (user: UserRoom) => void }) => {
	return (
		<div className="flex h-4/6 w-full flex-col-reverse overflow-y-scroll">
			{user.map((users, index) => (
				<div key={index} className="mb-4 flex rounded px-4 py-2">
					<p className="text-black">
						{users.userName} {hostId === users.userId && <span className="ml-2">{'👑'}</span>}
					</p>
					{user_a.type === 'Admin' && (users.type !== 'Owner' && users.type !== 'Admin') && (
						<>
							<button className="ml-2" onClick={() => handleKick(users)}>{'👢'}</button>
							{users.muted ? (
								<button className="ml-2" onClick={() => handelMuteUnMute(users)}>{'🔊'}</button>
							) : (
								<button className="ml-2" onClick={() => handelMuteUnMute(users)}>{'🔇'}</button>
							)}
							{users.ban ? (
								<button className="ml-2" onClick={() => handleBanUnBan(users)}>{'🔓'}</button>
							) : (
								<button className="ml-2" onClick={() => handleBanUnBan(users)}>{'🔨'}</button>
							)}
						</>
					)}

					{user_a.type === 'Owner' && users.type !== 'Owner' && (
						<>
							<button className="ml-2" onClick={() => handleKick(users)}>{'👢'}</button>
							{users.muted ? (
								<button className="ml-2" onClick={() => handelMuteUnMute(users)}>{'🔊'}</button>
							) : (
								<button className="ml-2" onClick={() => handelMuteUnMute(users)}>{'🔇'}</button>
							)}
							{users.ban ? (
								<button className="ml-2" onClick={() => handleBanUnBan(users)}>{'🔓'}</button>
							) : (
								<button className="ml-2" onClick={() => handleBanUnBan(users)}>{'🔨'}</button>
							)}
							{users.type === 'Admin' ? (
								<button className="ml-2" onClick={() => handlePromote(users)}>{'👎'}</button>
							) : (
								<button className="ml-2" onClick={() => handlePromote(users)}>{'👍'}</button>
							)}
						</>
					)}
				</div>
			))}
		</div>
	);
};

