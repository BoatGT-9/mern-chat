import React from 'react'
import Avatar from './Avatar';

const Contract = ({ username, id, online, selected , onClick }) => {
  return (
    <div
      onClick={() => onClick(id)}
      className={'border-b border-gray-100 flex items-center gap-2 cursor-pointer ' + (selected ? "bg-blue-200 " : "")}>
      {selected && <div className='w-1 bg-blue-700 h-12 rounded-r-md'></div>}
      <div className='flex gap-2 py-2 pl-4 items-center'>
        <Avatar
          username={username}
          userId={id}
          online={online}
        />
        <span className='text-black'>{username}</span>
      </div>
    </div>
  )
}


export default Contract;   