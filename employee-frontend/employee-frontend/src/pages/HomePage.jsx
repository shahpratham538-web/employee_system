import { Link } from "react-router-dom";
import { ArrowRight, Shield, Activity, Globe, Database, Grid } from "lucide-react";

export default function HomePage() {
  const bgImageUrl = "https://lh3.googleusercontent.com/aida/ADBb0uh9IeI3gvqSGldG339F7UL2TUCzN0S9MafAt-JZc5Txln6BKxp1RI0u0clyJKndQUGUJ39KVgc30WCmxFNMESFdUt7mYQhEKzO_4v-BvMGWSVptSskTkhBYS1OV3QKXsykp_jgRbpmIw0oIR7rVED3dCmENKN5wXYYXz3OKG6oYgnXOEnMAldGn1xVSOM_QRh8Q13XUA2WWGd04jGR2fCV6nD09WPiOtjIiK1OsUWz2r9L6thcfhubBD5s";

  return (
    <div className="font-sans antialiased text-on-surface bg-surface select-none">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] w-full flex flex-col justify-between overflow-hidden">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${bgImageUrl}), linear-gradient(to bottom, #111, #333)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />

        {/* Navbar */}
        <nav className="relative z-50 flex items-center justify-between px-6 md:px-16 py-6 w-full text-white">
          <div className="flex items-center gap-3">
            <div className="grid grid-cols-3 gap-0.5 w-5 h-5 text-primary">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 bg-current rounded-sm opacity-80" />
              ))}
            </div>
            <span className="text-2xl font-black tracking-tight">ev</span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-sm font-medium">
            {/* Nav links removed as per instructions */}
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium hover:text-primary transition">Login</Link>
            <Link to="/signup" className="bg-[#4d7f00] hover:bg-primary font-semibold text-white px-6 py-2.5 rounded-full text-sm transition">
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-20 flex-1 flex flex-col justify-center px-6 md:px-16 w-full max-w-5xl">
          <h1 className="text-[64px] md:text-[100px] font-black text-white leading-[0.9] tracking-tighter mb-6">
            EMPLOYEE<br />HUB
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl font-light mb-10 leading-relaxed shadow-sm">
            Unlock the power of your operational data with high-fidelity analytics and seamless team management.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              to="/signup"
              className="w-full sm:w-auto bg-[#8BC34A] hover:bg-[#9ccc65] text-[#1a2e05] font-bold px-8 py-3.5 rounded-full flex items-center justify-center gap-2 transition"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/login"
              className="w-full sm:w-auto bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 text-white font-bold px-10 py-3.5 rounded-full flex items-center justify-center transition"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-20 px-6 md:px-16 pb-12 flex items-end">
          <div className="flex items-center gap-4 text-xs font-bold tracking-[0.2em] text-white/60">
            <div className="w-px h-12 bg-primary/50" />
            <span className="uppercase">SCROLL FOR INTELLIGENCE</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-surface py-24 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
          {/* Stat Block 1 */}
          <div className="bg-white rounded-3xl p-10 flex-1 border border-outline-variant/30 flex flex-col justify-between min-h-[300px]">
            <span className="text-xs font-bold tracking-widest text-[#2d2f2f]/50 uppercase">Global Reliability</span>
            <div>
              <h2 className="text-[80px] font-black text-[#2d2f2f] leading-none mb-4 tracking-tighter">99.9%</h2>
              <p className="text-[#5a5c5c] font-medium leading-relaxed max-w-xs">
                Uptime for archival operations across global nodes.
              </p>
            </div>
          </div>

          {/* Stat Block 2 */}
          <div className="bg-[#c1fd7c] rounded-3xl p-10 flex-1 flex flex-col justify-between min-h-[300px]">
            <Database className="w-8 h-8 text-[#2c4d00] mb-6" />
            <div>
              <h2 className="text-[64px] font-black text-[#2c4d00] leading-none mb-4 tracking-tighter">20PB+</h2>
              <p className="text-[#396100] font-medium leading-relaxed max-w-xs">
                Data kineticized daily through our core enterprise engine.
              </p>
            </div>
          </div>

          {/* Stat Block 3 */}
          <div className="bg-[#0c0f0f] rounded-3xl p-10 flex-1 flex flex-col justify-between min-h-[300px]">
            <Shield className="w-8 h-8 text-[#c1fd7c] mb-6" />
            <div>
              <h2 className="text-[48px] font-black text-white leading-none mb-4 tracking-tighter">Secured</h2>
              <p className="text-[#9c9d9d] font-medium leading-relaxed max-w-xs">
                Military-grade encryption for every archival kinetic packet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#2d2f2f] py-32 px-6 md:px-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="sticky top-32">
            <h2 className="text-[56px] md:text-[80px] font-black text-white leading-[0.95] tracking-tighter mb-8">
              High-End<br />
              <span className="text-[#c1fd7c]">Operational</span><br />
              Capabilities.
            </h2>
            <p className="text-[#acadad] font-medium text-lg uppercase tracking-widest">
              Built for the Kinetic Enterprise
            </p>
          </div>

          <div className="space-y-12">
            {/* Feature 1 */}
            <div className="flex gap-6">
              <div className="w-12 h-12 shrink-0 bg-[#3c6600]/30 rounded flex items-center justify-center mt-1">
                <Activity className="w-6 h-6 text-[#c1fd7c]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Real-time analytics</h3>
                <p className="text-[#acadad] leading-relaxed">
                  High-fidelity data streams processed with zero latency, providing your team with immediate operational insights without disruption.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[#c1fd7c] font-bold text-sm tracking-widest uppercase cursor-pointer group">
                  Explore Insights <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-6">
              <div className="w-12 h-12 shrink-0 bg-[#3c6600]/30 rounded flex items-center justify-center mt-1">
                <Globe className="w-6 h-6 text-[#c1fd7c]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Global Compliance</h3>
                <p className="text-[#acadad] leading-relaxed">
                  Automated archival protocols that meet the world's most stringent regulatory standards across all sectors natively.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-6">
              <div className="w-12 h-12 shrink-0 bg-[#3c6600]/30 rounded flex items-center justify-center mt-1">
                <Grid className="w-6 h-6 text-[#c1fd7c]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Intelligent Automation</h3>
                <p className="text-[#acadad] leading-relaxed">
                  Kinetic AI workflows that adapt to your data patterns, reducing manual overhead by up to eighty percent.
                </p>
                <div className="mt-6 flex items-center gap-2 text-[#c1fd7c] font-bold text-sm tracking-widest uppercase cursor-pointer group">
                  Learn Automation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#f0f1f1] py-32 px-6 md:px-16 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#c1fd7c]/30 text-[#2c4d00] font-bold text-xs tracking-widest uppercase mb-10">
            Get Started
          </div>
          <h2 className="text-[64px] md:text-[80px] font-black text-[#2d2f2f] leading-none tracking-tighter mb-8">
            Ready for the<br />kinetic shift?
          </h2>
          <p className="text-[#5a5c5c] font-medium text-lg md:text-xl max-w-xl mb-12">
            Join 200+ global enterprises leveraging the ev Kinetic Archive for their mission-critical operational data.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/login" className="bg-[#2d2f2f] hover:bg-black text-white font-bold py-4 px-10 rounded-full transition w-full sm:w-auto text-lg leading-none">
              Access Portal Menu
            </Link>
            <Link to="/signup" className="bg-[#8BC34A] hover:bg-[#9ccc65] text-[#1a2e05] font-bold py-4 px-10 rounded-full transition w-full sm:w-auto text-lg leading-none">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="bg-[#0c0f0f] py-10 px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6 text-[#acadad] text-sm font-medium">
        <div>
          ev Enterprise Kinetic Archive. © 2024
        </div>
        <div className="flex gap-8">
          {/* Footer links removed */}
        </div>
      </footer>
    </div>
  );
}
