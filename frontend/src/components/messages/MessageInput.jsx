import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import { useState } from "react";

const MessageInput = () => {

	const [message,setMessage ] = useState("");
	const {loading,sendMessage} = useSendMessage();

	const handleSubmit = async(e)=>{
		e.preventDefault();
		if(!message) return; //no message return it dont run this function
		await sendMessage(message);
		setMessage("");
	}

	const handleChange= (e)=>{
		setMessage(e.target.value);

	}
	return (	
		<form className='px-4 my-3' onSubmit={handleSubmit}>
			<div className='w-full relative'>
				<input
					type='text'
					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
					placeholder='Send a message'
					value={message}
					onChange={handleChange}
				/>
				<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
					{loading ? <div className="loading loading-spinner mx-auto"></div> : <BsSend/>}
				</button>
			</div>
		</form>
	);
};
export default MessageInput;