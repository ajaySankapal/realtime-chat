import React from 'react'

const OrderedItem = ({ item }) => {
    return (
        <div className='px-2 py-1 border border-gray-400  inline-block rounded-md'>{item}</div>
    )
}

export default OrderedItem