import React from 'react'
import Avatar from './UI/Avatar'
import OrderedItem from './OrderedItem'

const Message = ({ name, items, message }) => {
    return (
        <div className='p-4 border border-gray-800 w-3/4 ml-10 mt-4 rounded-md'>
            <div>
                <Avatar name={name} />
            </div>
            <div>
                <p className='py-4'>{message}</p>
                {
                    items && items.map(item => <OrderedItem key={item} item={item} />)
                }

            </div>
        </div>
    )
}

export default Message