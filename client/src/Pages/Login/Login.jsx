import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!username || !password) {
      setError('Ju lutem plotësoni të gjitha fushat.')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const result = await login(username, password)
      
      if (result.success) {
        navigate('/')
      } else {
        setError(result.message || 'Të dhënat e identifikimit janë të pasakta.')
      }
    } catch (err) {
      setError('Diçka shkoi keq. Ju lutem provoni përsëri.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className='w-full flex items-center justify-center'>
        <div className='w-[80vw] grid grid-cols-12 rounded-xl h-[90vh] mt-10'>
            <div className="col-span-6 flex light-green-bg items-center rounded-tl-xl rounded-bl-xl justify-center">
                <h1 className='moret text-8xl'>MerrBio</h1>
            </div>
            <div className="col-span-6 pl-10 flex flex-col h-full form-side-containers justify-center rounded-tr-xl rounded-br-xl">
                <form onSubmit={handleLogin}>
                    <h1 className='poppins text-3xl font-medium'>Kycuni ne llogarine tuaj</h1>
                    
                    {error && (
                      <div className="w-[80%] bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mt-4">
                        {error}
                      </div>
                    )}
                    
                    <input 
                      className='w-[80%] rounded-md form-inputs px-3 py-3 mt-5' 
                      placeholder='Emri perdoruesit...' 
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    
                    <input 
                      className='w-[80%] rounded-md form-inputs px-3 py-3 mt-5' 
                      placeholder='Fjalekalimi...' 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className='poppins text-base font-normal w-fit mt-3 px-6 py-2 light-green-bg disabled:opacity-50'
                    >
                      {isLoading ? 'Duke u kyçur...' : 'Kycuni'}
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login