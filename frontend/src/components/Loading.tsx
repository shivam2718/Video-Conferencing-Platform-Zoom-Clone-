export default function Loading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-zoom-blue border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}