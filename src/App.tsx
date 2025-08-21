import { useEffect, useState } from "react";
import { fetchApod } from "./api";
import { TypeWriter } from "./Typinganima";
import type { NasaApod } from "./api";

function App() {
  const [data, setData] = useState<NasaApod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);
  const [showHD, setShowHD] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [rocketLaunching, setRocketLaunching] = useState(false);
  const [hdVisible, setHdVisible] = useState(false);



  const handleToggleHD = () => {
  setHdVisible((prev) => !prev);
  };
    const fetchForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    setLoading(true);
    fetchApod(dateStr)
      .then((res) => {
        setData(res);
        setCurrentDate(dateStr);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handlePrev = () => {
    if (!data) return;
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    fetchForDate(prevDate);
  };

  const handleNext = () => {
    if (!data) return;
    const today = new Date().toISOString().split("T")[0];
    if (currentDate === today) return;
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    fetchForDate(nextDate);
  };

  useEffect(() => {
    fetchApod()
      .then((res) => {
        setData(res);
        setCurrentDate(res.date);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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

  if (error) return <p>Error: {error}</p>;

return (
  <>
    {showIntro ? (
      <div className="relative min-h-screen w-full bg-black overflow-hidden">
        <div
          className={`absolute bottom-0 transition-transform duration-[2000ms] ease-in-out ${
            rocketLaunching ? "translate-y-[-120vh] scale-125" : "translate-y-0 scale-100"
          }`}
        >
          <img src="/rocket.png" alt="Rocket" className="w-32 sm:w-48" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <h1 className="text-white text-3xl sm:text-5xl text-center mb-4">
            Ready to explore the stars?
          </h1>
          <button
            className="mt-4 bg-sky-400 text-slate-900 px-6 py-3 rounded hover:bg-sky-300 text-lg font-semibold"
            onClick={() => {
              setRocketLaunching(true);
              setTimeout(() => setShowIntro(false), 2000);
            }}
          >
            Yessss!
          </button>
        </div>
      </div>
    ) : (
      <div className="relative min-h-screen w-full bg-black overflow-y-auto">
        <div className="absolute inset-0">
          <div className="relative h-full w-full [&>div]:absolute [&>div]:left-0 [&>div]:right-0 [&>div]:top-[-10%] [&>div]:h-[1000px] [&>div]:w-[1000px] [&>div]:rounded-full [&>div]:bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)]">
            <div></div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-start px-4 py-16">
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

            <TypeWriter text={data?.title || ""} />
            <p className="text-sky-300 mb-4 italic">{data?.date}</p>

            <div className="relative w-full mb-4">
              <img
                className="w-full rounded shadow-md border border-gray-400"
                src={data?.url}
                alt={data?.title}
              />
              {data?.hdurl && (
                <img
                  className={`absolute top-0 left-0 w-full rounded shadow-md border border-gray-400 transition-all duration-1000 ${
                    hdVisible ? "opacity-100 scale-100" : "opacity-0 scale-110"
                  }`}
                  src={data.hdurl}
                  alt={data?.title}
                />
              )}
            </div>

            <button
              className="bg-sky-400 text-slate-900 px-4 py-2 rounded hover:bg-sky-300 mt-2"
              onClick={handleToggleHD}
            >
              {hdVisible ? "Show Normal" : "Show HD"}
            </button>

            <p className="text-slate-300 text-lg mt-3 leading-relaxed font-light">{data?.explanation}</p>
          </div>
        </div>
      </div>
    )}
  </>
);


}

export default App;
