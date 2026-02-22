import RoastForm from "@/components/RoastForm";
import { Flame } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 p-6 md:p-12 lg:p-24 selection:bg-rose-500/30">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-rose-500/10 rounded-full mb-4">
            <Flame className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Stop guessing why you got <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-rose-700">rejected.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
            Upload your resume and the job description. Our AI recruiter will brutally roast your CV and tell you exactly why it's going in the trash.
          </p>
        </section>

        {/* Interactive Form Section */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl">
          <RoastForm />
        </section>

      </div>
    </main>
  );
}
