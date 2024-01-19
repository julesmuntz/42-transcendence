import { useRef } from 'react';
import './Chat.css';

export default function MessageForm({ sendMessage }: { sendMessage: (message: string) => void })
{
	const textAreaRef = useRef<HTMLInputElement>(null)

	const submit = (e: any) => {
		e.preventDefault()
		const value = textAreaRef?.current?.value
		if (value && value.length <= 2000) {
			sendMessage(value);
			textAreaRef.current.value = '';
		}
		else if (value && value.length > 2000)
		{
			alert(`Your message is DEFINITELY too long, you should write less.\nChange it then try sending it again!\nPS: limit: 2000 characters; yours: ${value.length}`);
		}
	}

	const handleKeyDown = (e: any) => {
		if (e.key === 'Enter') {
			submit(e);
		}
	}

	const scrollToAnchor = () => {
        setTimeout(() => {
            const anchor = document.getElementsByClassName('anchor')[0];
            anchor.scrollIntoView({
                behavior: "smooth"
            });
        }, 5);
    }

	return (
		<div className="answer-add">
			<div className="row">
				<div className="col-xs-9" style={{ width: '80%' }}>
					<input
						type="text"
						placeholder="Enter your text"
						className="form-control chat-input"
						ref={textAreaRef}
						onKeyDown={(e) => handleKeyDown(e)}
						onClick={scrollToAnchor}
					/>
				</div>
				<div className="col-xs-3" style={{ width: '20%' }}>
					<button className="btn btn-primary btn-block" type="submit" onClick={(e) => submit(e)}>send</button>
				</div>
			</div>
		</div>
	)
}
