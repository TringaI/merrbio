import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: { coordinates: [0, 0] }, // Default location
    role: 'consumer' // Default role
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email ||
      !formData.username || !formData.password) {
      setError('Ju lutem plotësoni të gjitha fushat e detyrueshme.')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Fjalëkalimet nuk përputhen.')
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Ju lutem vendosni një email të vlefshëm.')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError('')

    try {
      // Remove confirmPassword as it's not needed in the backend
      const { confirmPassword, ...userData } = formData

      const result = await register(userData)

      if (result.success) {
        // Redirect to login page after successful registration
        navigate('/login')
      } else {
        setError(result.message || 'Regjistrimi dështoi. Ju lutem provoni përsëri.')
      }
    } catch (err) {
      setError('Diçka shkoi keq. Ju lutem provoni përsëri.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='w-full flex items-center justify-center pb-10'>
      <div className='w-[80vw] grid grid-cols-12 rounded-xl   mt-10'>
        <div className="col-span-12 order-2 lg:order-1 lg:col-span-6 flex light-green-bg items-center rounded-tl-xl rounded-bl-xl justify-center">
          <h1 className='moret text-5xl py-10 lg:py-0 lg:text-8xl'>MerrBio</h1>
        </div>
        <div className="col-span-12 order-1 lg:order-2 lg:col-span-6 pl-10 flex flex-col h-full form-side-containers justify-center rounded-tr-xl rounded-br-xl overflow-y-auto">
          <h1 className='poppins text-2xl lg:text-3xl font-medium mt-5'>Krijoni llogarine tuaj</h1>

          <form onSubmit={handleSubmit}>

            {error && (
              <div className="w-[80%] bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mt-4">
                {error}
              </div>
            )}

            <input
              className='w-[80%] rounded-md form-inputs px-3 py-3 mt-5'
              placeholder='Emri ...'
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <input
              className='w-[80%] rounded-md form-inputs px-3 py-3 mt-5'
              placeholder='Mbiemri...'
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            <input
              className='w-[80%] rounded-md form-inputs px-3 py-3 mt-5'
              placeholder='Email...'
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              className='w-[80%] rounded-md form-inputs px-3 py-3 mt-5'
              placeholder='Emri perdoruesit...'
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              className='w-[80%] rounded-md form-inputs px-3 py-3 mt-5'
              placeholder='Numri i telefonit...'
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <input
              className='w-[80%] rounded-md form-inputs px-3 py-3 mt-5'
              placeholder='Fjalekalimi...'
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <input
              className='w-[80%] rounded-md form-inputs px-3 py-3 mt-5'
              placeholder='Konfirmo fjalekalimin...'
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <div className="w-[80%] mt-5">
              <p className='poppins text-sm mb-2'>Zgjidhni rolin:</p>
              <select
                className='w-full rounded-md form-inputs px-3 py-3'
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="consumer">Konsumator</option>
                <option value="farmer">Fermer</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className='poppins text-base font-normal w-fit mt-5 mb-10 px-6 py-2 light-green-bg disabled:opacity-50'
            >
              {isLoading ? 'Duke u regjistruar...' : 'Regjistrohu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup