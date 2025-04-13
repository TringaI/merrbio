import React from 'react'

function AddProducts() {
  return (
    <div className='w-full mt-5 flex flex-col'>
        <input className='form-inputs p-3' type="text" placeholder='Emri i produktit...' />
        <input className='form-inputs p-3 mt-5' type="text" placeholder='Pershkrimi i produktit...' />
        <input className='form-inputs p-3 mt-5' type="text" placeholder='Cmimi i produktit...' />
        <button className="mt-5 text-white dark-green-bg px-4 py-2 w-fit">Shto Produktin</button>
    </div>
  )
}

export default AddProducts