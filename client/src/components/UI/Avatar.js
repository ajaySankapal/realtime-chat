import React from 'react'

const Avatar = ({ name }) => {
    const splittedNames = name.split(' ')
    let initials = '';
    if (splittedNames.length > 1) {
        initials = splittedNames[0][0]?.toUpperCase() + splittedNames[1][0]?.toUpperCase()
    } else if (splittedNames.length === 1) {
        initials = splittedNames[0][0]?.toUpperCase()
    }
    return (
        <div className='flex flex-row gap-2'>
            <div className='bg-gray-500 rounded-full w-8 h-8 text-white flex justify-center items-center'>{initials}</div>
            <p>{name}</p>
        </div>
    )
}

export default Avatar