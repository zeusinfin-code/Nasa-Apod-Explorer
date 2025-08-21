import { useEffect, useState } from "react"
import { fetchApod } from "./api"
import type { NasaApod } from "./api"

function App() {
  const [data, setData] = useState<NasaApod | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentDate , setCurrentDate] = useState(new Date().toISOString().split("T")[0])
  const [showHD, setShowHD] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [introAnimating, setIntroAnimating] = useState(false);


  const fetchForDate = (dateObj: Date) => {
  const dateStr = dateObj.toISOString().split("T")[0]; // "2025-08-21"
  setLoading(true);
  fetchApod(dateStr)
    .then(res => {
      setData(res);
      setCurrentDate(dateStr)
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
};


const handlePrev = () => {
  if (!data) return
  const prevDate = new Date(currentDate)
  prevDate.setDate(prevDate.getDate() - 1)
  fetchForDate(prevDate)
}

const handleNext = () => {
  if (!data) return
  const today = new Date().toISOString().split("T")[0];
  if (currentDate === today) return; 
  const nextDate = new Date(currentDate)
  nextDate.setDate(nextDate.getDate() + 1)
  fetchForDate(nextDate)
}


  useEffect(() => {
    fetchApod()
      .then((res) => {
        setData(res)
        setCurrentDate(res.date)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sky-300 text-lg tracking-wide">Launching through the stars...</p>
      </div>
    </div>
  );
}

  if (error) return <p>Error: {error}</p>

return (
  <>
    {showIntro ? (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div
          className={`flex flex-col items-center gap-6 transition-transform duration-700 ${
            introAnimating ? "scale-110" : "scale-100"
          }`}
        >
          <h1 className="text-white text-3xl sm:text-5xl text-center">
            Ready to dive into the stars?
          </h1>
          <button
            className="mt-4 bg-sky-400 text-slate-900 px-6 py-3 rounded hover:bg-sky-300 text-lg font-semibold"
            onClick={() => {
              setIntroAnimating(true);
              setTimeout(() => setShowIntro(false), 700);
            }}
          >
            Yessss
          </button>
        </div>
      </div>
    ) : loading ? (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sky-300 text-lg tracking-wide">Launching through the stars...</p>
        </div>
      </div>
    ) : error ? (
      <p>Error: {error}</p>
    ) : (
      <div className="relative h-screen bg-black">
        <div className="absolute inset-0">
          <div className="relative h-full w-full [&>div]:absolute [&>div]:left-0 [&>div]:right-0 [&>div]:top-[-10%] [&>div]:h-[1000px] [&>div]:w-[1000px] [&>div]:rounded-full [&>div]:bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]">
            <div></div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-start h-full px-4 py-16 overflow-y-auto">
          <div className="max-w-3xl text-center">
            <div className="flex justify-center gap-4 mb-8">
              <button
                className="bg-sky-400 text-slate-900 px-4 py-2 rounded hover:bg-sky-300 transform transition-transform duration-700 focus:scale-110"
                onClick={handlePrev}
              >
                Previous
              </button>
              <button
                className="bg-sky-400 text-slate-900 px-4 py-2 rounded hover:bg-sky-300 transform transition-transform duration-700 focus:scale-110"
                onClick={handleNext}
              >
                Next
              </button>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold mb-2 text-white tracking-wide">
              {data?.title}
            </h1>

            <p className="text-sky-300 mb-4 italic">{data?.date}</p>

            {data?.url && (
              <img
                className="w-full rounded shadow-md mb-4 border border-gray-400"
                src={showHD && data?.hdurl ? data.hdurl : data?.url}
                alt={data?.title}
              />
            )}

            <button
              className="bg-sky-400 text-slate-900 px-4 py-2 rounded hover:bg-sky-300 mt-2"
              onClick={() => setShowHD((prev) => !prev)}
            >
              {showHD ? "Show Normal" : "Show HD"}
            </button>

            <p className="text-slate-300 text-lg mt-3 leading-relaxed font-light">{data?.explanation}</p>
          </div>
        </div>
      </div>
    )}
  </>
);








}


export default App

