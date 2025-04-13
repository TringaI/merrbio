import React from 'react'
import './Profile.scss'
import FinishedProducts from '../../Components/FinishedProducts'

function Profile() {
    return (
        <div className='w-full flex flex-col justify-center items-center'>
            <div className='w-[80vw] mt-40'>
                <h1 className='moret  text-4xl'>Mirese erdhet ne profilin tuaj</h1>
                <hr />
                <div className="w-full flex justify-end">
                    <button className='dark-green-bg px-4 py-3 rounded-md mt-5 text-white poppins'><a href="/profili-fermerit">Profili Fermerit</a> </button>
                </div>
            </div>
            <div className='w-[80vw] grid grid-cols-12 mt-10 gap-5'>
                {/* <div className="col-span-3 h-full flex items-center  light-green-bg rounded-xl justify-center">
                    <h1 className='moret text-3xl'>MerrBio</h1>
                </div> */}
                <div className="col-span-6 light-green-border   p-10 rounded-md flex flex-col" >
                    <h1 className='moret text-2xl '>Infomacionet Personale</h1>
                    <hr />
                    <h1 className='poppins text-md mt-3'>Emri: <span className="font-medium"> </span></h1>
                    <h1 className='poppins text-md '>Mbiemri: <span className="font-medium"> </span></h1>
                    <h1 className='poppins text-md '>Email: <span className="font-medium"> </span></h1>
                    <h1 className='poppins text-md '>Emri i perdoruesit: <span className="font-medium"> </span></h1>
                    <h1 className='poppins text-md '>Lokacioni: <span className="font-medium"> </span></h1>
                    <h1 className='poppins text-md '>Emri i fermes: <span className="font-medium"> </span></h1>
                    <div className="w-full flex justify-end">
                        <img src="/images/icons/edit.png" className='w-[20px]' alt="" />
                    </div>
                </div>
                <div className="col-span-6 light-green-border   p-10 rounded-md flex flex-col" >
                    <h1 className='moret text-2xl '>Gjurmimi i porosive</h1>
                    <hr />
                    <h1 className='poppins text-md mt-3 '>Numri i porosive te kompletuara:</h1>
                    <h1 className='poppins text-md '>Numri i porosive ne pritje:</h1>
                </div>
                <div className="col-span-12 mt-19  flex flex-col light-green-border p-10 rounded-md">
                    <h1 className='moret text-2xl '>Lista e porosive</h1>
                    <hr />
                    <div className="flex w-full mt-10">
                        <div className='w-[20%]'>
                            <FinishedProducts product='Domate bio' image='/product-1.png' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile