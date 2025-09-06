import React from 'react'

const Order = () => {
  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='flex flex-col space-y-4 mt-24'>

        <h2 className='font-bold text-2xl mx-12 my-12'>Your Orders</h2>

        <div className='flex bg-white w-256 h-48 mx-12 shadow-lg justify-between items-center transform transition hover:scale-105 duration-500 '>
          <div className='flex items-center space-x-6'>
          <img src='/assets/download.webp' className=' w-40 h-40 object-contain mx-4' />
          <p className='font-semibold text-md'>MacBook Air M4</p>
          </div>

          <div className='flex justify-end mx-16'>
            <p className='text-green-500 font-bold  '>In Progress</p>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Order
