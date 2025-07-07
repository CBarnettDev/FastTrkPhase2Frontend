'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface AuthFormProps {
  isLogin: boolean
}

interface FormData {
  email: string
  password: string
  name?: string
  companyName?: string
  primaryColor?: string
  logo?: FileList
}

export default function AuthForm({ isLogin }: AuthFormProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const primaryColor = watch('primaryColor') || '#0091FF'

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError(null)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

      if (isLogin) {
        // Login request
        const response = await fetch(`${baseUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Login failed')
        }

        // Store user data in localStorage (non-sensitive data only)
        localStorage.setItem('user', JSON.stringify(result.user))
        
        router.push('/dashboard/verification')
      } else {
        // Registration request
        if (!data.logo || data.logo.length === 0) {
          throw new Error('Company logo is required')
        }

        const formData = new FormData()
        formData.append('name', data.name || '')
        formData.append('email', data.email)
        formData.append('password', data.password)
        formData.append('companyName', data.companyName || '')
        formData.append('primaryColor', primaryColor)
        formData.append('logo', data.logo[0])

        const response = await fetch(`${baseUrl}/auth/signup`, {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Registration failed')
        }

        router.push('/login?registered=true')
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {!isLogin && (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                id="name"
                {...register('name', { required: !isLogin && 'Name is required' })}
                type="text"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 px-3"
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                Company/White-label Name
              </label>
              <input
                id="companyName"
                {...register('companyName', { required: !isLogin && 'Company name is required' })}
                type="text"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 px-3"
                placeholder="Enter your company name"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                Primary Brand Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  id="primaryColor"
                  {...register('primaryColor', {
                    required: !isLogin && 'Color is required',
                    pattern: {
                      value: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                      message: 'Invalid hex color code',
                    },
                  })}
                  type="color"
                  className="h-10 w-10 cursor-pointer rounded-md border border-gray-300"
                  defaultValue="#0091FF"
                />
                <input
                  type="text"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 px-3"
                  value={watch('primaryColor') || '#0091FF'}
                  onChange={(e) => {
                    const value = e.target.value
                    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value) || value === '') {
                      register('primaryColor').onChange(e)
                    }
                  }}
                  placeholder="Enter hex color code"
                />
              </div>
              {errors.primaryColor && (
                <p className="mt-1 text-sm text-red-600">{errors.primaryColor.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                Company Logo
              </label>
              <input
                id="logo"
                {...register('logo', {
                  required: !isLogin && 'Company logo is required'
                })}
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
              <p className="mt-1 text-xs text-gray-500">Upload your company logo (required)</p>
              {errors.logo && (
                <p className="mt-1 text-sm text-red-600">{errors.logo.message}</p>
              )}
            </div>
          </>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            type="email"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 px-3"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            type="password"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 px-3"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          style={{
            backgroundColor: !isLogin && watch('primaryColor') ? watch('primaryColor') : '#0091FF',
          }}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            <span>{isLogin ? 'Sign in' : 'Sign up'}</span>
          )}
        </button>
      </div>
    </form>
  )
}