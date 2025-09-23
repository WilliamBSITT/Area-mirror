'use client';
import Footer from "@/components/Footer";
import Particles from "@/components/background";
import Navbar from "@/components/Navbar";
// c'est pour test
// import { useFetchBack } from "./test";

export default function Home() {
  // le test du back/front
  // const { data, loading, error, handleClick } = useFetchBack();

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 -z-10">
        <Particles
          particleColors={["#D5f5f5", "#abc9c9"]}
          particleCount={600}
          particleSpread={10}
          speed={0.05}
          particleBaseSize={150}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <div className="relative font-sans pb-20 sm:p-20 flex-1 z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold">
              Connect your apps and <br />
              <strong className="text-[#483f94]">automate workflows</strong>
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl">
              Our app makes automation easy and effortless. In just a few clicks, connect your APIs and build smart workflows that run on their own. No more repetitive tasks—save time, stay focused on what matters, and let our platform do the work for you. The perfect tool for busy people who want to achieve more with less effort.
            </p>
          </div>
          <img
            src="/landing.jpg"
            alt="Logo"
            className="ml-0 sm:ml-6 mb-4 sm:mb-2 w-full sm:w-[800px] max-w-full h-auto object-contain rounded-lg"
            style={{ maxWidth: "1000px" }}
          />
        </div>
        {/* <button
          onClick={handleClick}
          className="bg-red-600 text-white rounded-full px-6 py-2 font-semibold shadow hover:bg-red-700 transition-colors"
        >
          Demander une info au backend
        </button>
        {loading && <p>Chargement...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>} */}
        <h1 className="mt-10 text-4xl font-semibold underline-on-hover">Ready to explore?</h1>
        <a
          href="/signup"
          className="mt-4 inline-block text-[#483f94] max-w-2xl text-2xl font-bold transition-colors"
        >
          Start using TriggerHub for free today
        </a>
        <h2 className="mt-40 mb-20 text-4xl font-semibold text-center">They trust us</h2>
        <div className="flex flex-row items-center gap-30 mt-4 w-5/6 justify-center mx-auto">
          <img
            src="/microsoft.png"
            alt="microsoft"
            className="flex-1 max-w-[200px] h-auto object-contain rounded-lg"
            style={{ minWidth: "120px" }}
          />
          <img
            src="/spotify.png"
            alt="spotify"
            className="flex-1 max-w-[200px] h-auto object-contain rounded-lg"
            style={{ minWidth: "120px" }}
          />
          <img
            src="/github.svg"
            alt="github"
            className="flex-1 max-w-[200px] h-auto object-contain rounded-lg"
            style={{ minWidth: "120px" }}
          />
          <img
            src="/strava.png"
            alt="strava"
            className="flex-1 max-w-[200px] h-auto object-contain rounded-lg"
            style={{ minWidth: "120px" }}
          />
          <img
            src="/bourso.png"
            alt="boursorama"
            className="flex-1 max-w-[200px] h-auto object-contain rounded-lg"
            style={{ minWidth: "120px" }}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
