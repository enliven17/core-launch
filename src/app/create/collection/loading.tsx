export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-12">
        {/* Page Header Skeleton */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gray-700 rounded-2xl animate-pulse"></div>
            <div className="w-48 h-12 bg-gray-700 rounded-lg animate-pulse"></div>
          </div>
          <div className="w-96 h-6 bg-gray-700 rounded-lg animate-pulse mx-auto"></div>
        </div>

        {/* Form Skeleton */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/50 rounded-2xl p-8 space-y-8">
            {/* Fee Notice Skeleton */}
            <div className="bg-gray-700/50 rounded-2xl p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gray-600 rounded-xl"></div>
                <div className="w-48 h-6 bg-gray-600 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="w-24 h-4 bg-gray-600 rounded"></div>
                  <div className="w-32 h-6 bg-gray-600 rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="w-28 h-4 bg-gray-600 rounded"></div>
                  <div className="w-20 h-4 bg-gray-600 rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="w-20 h-4 bg-gray-600 rounded"></div>
                  <div className="w-32 h-4 bg-gray-600 rounded"></div>
                </div>
              </div>
            </div>

            {/* Form Fields Skeleton */}
            <div className="space-y-6">
              <div className="w-48 h-6 bg-gray-700 rounded animate-pulse"></div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-gray-700 rounded"></div>
                  <div className="w-full h-12 bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-gray-700 rounded"></div>
                  <div className="w-full h-12 bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-32 h-4 bg-gray-700 rounded"></div>
                <div className="w-full h-24 bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
            </div>

            {/* Submit Button Skeleton */}
            <div className="flex justify-end">
              <div className="w-48 h-14 bg-gray-700 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
