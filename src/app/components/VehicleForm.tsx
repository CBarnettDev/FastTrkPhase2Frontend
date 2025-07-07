'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VehicleForm({ vehicle }: { vehicle?: { id: number, description: string } }) {
  const [description, setDescription] = useState(vehicle?.description || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e : any) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
      const url = vehicle 
        ? `${baseUrl}/vehicles/${vehicle.id}`
        : `${baseUrl}/vehicles`
      
      const method = vehicle ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error(vehicle ? 'Failed to update vehicle' : 'Failed to create vehicle')
      }
      
      router.push('/dashboard/vehicles')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-black">
          {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
        </h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/dashboard/vehicles')}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Processing...' : vehicle ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}