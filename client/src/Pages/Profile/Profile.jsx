import React from 'react'

function Profile() {
    return (
        <div className='w-full flex flex-col justify-center items-center'>
            <div className='w-[80vw] grid grid-cols-12 mt-20 gap-5'>
                <div className="col-span-3 h-full flex items-center  light-green-bg rounded-xl justify-center">
                    <h1 className='moret text-3xl'>MerrBio</h1>
                </div>
                <div className="col-span-9">
                    <div className="grid grid-cols-12">
                        <div className="col-span-6"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile