import React, { useState } from 'react'
import Avatar from './UI/Avatar'
import OrderedItem from './OrderedItem'
import Message from './Message'

const ChatWindow = ({ socket, messages }) => {
    const [message, setMessage] = useState('')

    const handleMessageChange = (e) => {
        setMessage(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        socket.emit('sendMessage', message)
        setMessage('')
    }
    return (
        <section className='w-full md:w-3/4 bg-white h-[95vh] mx-auto'>
            {/* Messages */}
            <div className='h-[85%] py-2 overflow-y-scroll'>
                {
                    messages ? messages?.map(m => <Message key={m.createdAt} name={m.username} items={m.items} message={m.message} />) : ''
                }

            </div>
            {/* Send Message form */}
            <div className='py-6'>
                <form className='flex justify-center gap-2' onSubmit={handleSubmit}>
                    <input type="text" className='border border-gray-300 py-1 px-3 w-[85%] rounded-md outline-none' placeholder='Send Message' value={message} onChange={handleMessageChange} />
                    <button className='bg-gray-500 py-2 px-5 text-white rounded-md' type='submit'>Send</button>
                </form>
            </div>
        </section>
    )
}

export default ChatWindow