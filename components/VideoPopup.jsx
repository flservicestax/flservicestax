import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'

function VideoPopup() {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const videoRef = useRef(null)
  const popupRef = useRef(null)

  useEffect(() => {
    // Show popup after page loads (3 seconds delay)
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  const handleOutsideClick = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      handleClose()
    }
  }

  const handleVideoLoad = () => {
    setIsLoaded(true)
  }

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleOutsideClick}
    >
      <div
        ref={popupRef}
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[76.5vh] overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200 group"
          aria-label="Close video"
        >
          <X className="w-6 h-6" />
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Close
          </span>
        </button>

        {/* Video Container */}
        <div className="relative w-full bg-black rounded-2xl overflow-hidden">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-white text-lg">Loading video...</div>
            </div>
          )}
          <video
            ref={videoRef}
            className="w-full h-auto max-h-[58vh] object-contain"
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={handleVideoLoad}
            onError={() => console.error('Video failed to load')}
          >
            <source src="/tax-preparation-person-worried-pexels.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Optional: Video Info */}
        <div className="p-4 bg-gray-50">
          <p
            className="text-xl font-bold text-orange-600 text-center cursor-pointer hover:text-orange-700 transition-colors duration-200 font-serif"
            onClick={() => navigate('/')}
          >
            🚨 DON'T RISK YOUR FINANCIAL FUTURE! 🚨<br />
            <span className="text-lg font-semibold text-gray-800">Watch this short video about the importance of professional tax preparation</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default VideoPopup
