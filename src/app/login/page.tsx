import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AstralLogo } from "@/components/icons/astral-logo";
import { ImageSlider } from "@/components/auth/image-slider";
import { AuthFooter } from "@/components/ui/auth-footer";
import { Brain, Zap, Shield, TrendingUp, Atom, Waves, ChevronDown } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="purple relative min-h-dvh overflow-hidden bg-black">
      {/* Enhanced Neural Background matching welcome page */}
      <div className="fixed inset-0 z-0">
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-purple-950/80 to-cyan-950/70 animate-pulse" 
             style={{animationDuration: '4s'}} />
        
        {/* Moving particles */}
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/60 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                filter: 'blur(0.5px)'
              }}
            />
          ))}
        </div>

        {/* Neural network lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 1000">
          <defs>
            <linearGradient id="neuralGradLogin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(59,130,246)" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="rgb(147,51,234)" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="rgb(6,182,212)" stopOpacity="0.4"/>
            </linearGradient>
          </defs>
          
          {/* Dynamic neural connections */}
          <path d="M100,200 Q300,100 500,200 T900,200" stroke="url(#neuralGradLogin)" strokeWidth="2" className="animate-pulse" fill="none"/>
          <path d="M100,400 Q300,300 500,400 T900,400" stroke="url(#neuralGradLogin)" strokeWidth="2" className="animate-pulse" fill="none" style={{animationDelay: '0.8s'}}/>
          <path d="M100,600 Q300,500 500,600 T900,600" stroke="url(#neuralGradLogin)" strokeWidth="2" className="animate-pulse" fill="none" style={{animationDelay: '1.6s'}}/>
          
          {/* Neural nodes */}
          <circle cx="200" cy="200" r="4" fill="rgb(59,130,246)" className="animate-pulse" opacity="0.8"/>
          <circle cx="500" cy="300" r="4" fill="rgb(147,51,234)" className="animate-pulse" opacity="0.8" style={{animationDelay: '0.5s'}}/>
          <circle cx="800" cy="500" r="4" fill="rgb(6,182,212)" className="animate-pulse" opacity="0.8" style={{animationDelay: '1s'}}/>
        </svg>

        {/* Holographic grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Enhanced Top Banner */}
      <div className="relative z-30 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          {/* Live AI Status */}
          <div className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl rounded-full border border-blue-500/30">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
            <span className="text-blue-400 font-bold text-xs sm:text-sm tracking-wider">● AstralCore ACTIVE</span>
          </div>
          
          {/* Stats */}
          <div className="hidden sm:flex items-center gap-3">
            <Badge variant="outline" className="border-green-400/40 text-green-300 bg-green-400/10 px-3 py-1">
              <Waves className="w-3 h-3 mr-1" />
              99.9% Uptime
            </Badge>
            <Badge variant="outline" className="border-purple-400/40 text-purple-300 bg-purple-400/10 px-3 py-1">
              <Brain className="w-3 h-3 mr-1" />
              Neural AI
            </Badge>
          </div>
        </div>
      </div>

      {/* Hero Header Section */}
      <section className="relative z-30 text-center py-8 px-4">
        <div className="relative mb-8">
          {/* Quantum Logo Animation */}
          <div className="relative mx-auto w-20 h-20 mb-6">
            {/* Rotating energy rings */}
            <div className="absolute inset-0 border-2 border-blue-400/30 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
            <div className="absolute inset-2 border-2 border-purple-400/40 rounded-full animate-spin" style={{animationDuration: '6s', animationDirection: 'reverse'}}></div>
            
            {/* Central logo */}
            <div className="absolute inset-4 flex items-center justify-center">
              <AstralLogo className="h-12 w-12 text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
            </div>
            
            {/* Orbiting elements */}
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-blue-400 rounded-full animate-bounce shadow-[0_0_6px_rgba(59,130,246,0.8)]" style={{animationDelay: '0s'}} />
            <div className="absolute top-1/2 right-0 w-1 h-1 bg-purple-400 rounded-full animate-bounce shadow-[0_0_6px_rgba(147,51,234,0.8)]" style={{animationDelay: '0.5s'}} />
            <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-bounce shadow-[0_0_6px_rgba(6,182,212,0.8)]" style={{animationDelay: '1s'}} />
            <div className="absolute top-1/2 left-0 w-1 h-1 bg-pink-400 rounded-full animate-bounce shadow-[0_0_6px_rgba(236,72,153,0.8)]" style={{animationDelay: '1.5s'}} />
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4 leading-tight">
          Welcome Back to AstralCore
        </h1>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <Atom className="w-4 h-4 text-blue-400 animate-spin" style={{animationDuration: '3s'}} />
          <p className="text-lg text-gray-300 font-light tracking-wide">
            Access Your Hyperdrive Trading Intelligence
          </p>
          <Atom className="w-4 h-4 text-purple-400 animate-spin" style={{animationDuration: '3s', animationDirection: 'reverse'}} />
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <Badge variant="outline" className="border-blue-400/50 text-blue-300 bg-blue-400/10 px-3 py-1">
            <Brain className="w-3 h-3 mr-1" />
            Neural Networks
          </Badge>
          <Badge variant="outline" className="border-purple-400/50 text-purple-300 bg-purple-400/10 px-3 py-1">
            <Zap className="w-3 h-3 mr-1" />
            24/7 Trading
          </Badge>
          <Badge variant="outline" className="border-cyan-400/50 text-cyan-300 bg-cyan-400/10 px-3 py-1">
            <Shield className="w-3 h-3 mr-1" />
            Hyperdrive Security
          </Badge>
        </div>
      </section>

      {/* Image Slider Section */}
      <section className="relative z-30 px-4 mb-8">
        <ImageSlider />
      </section>

      {/* Main Content */}
      <div className="relative z-30 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Left Side - Enhanced Feature Cards */}
          <div className="hidden lg:block space-y-6">
            {/* Main AI Robot Card */}
            <Card className="group relative overflow-hidden border-blue-400/20 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl hover:border-blue-400/40 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(59,130,246,0.2)] hover:scale-105">
              <CardContent className="p-0">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2Fd72854716aa64419b8ee08255a39ecea?format=webp&width=800"
                    alt="Quantum AI Assistant"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Holographic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-blue-500/10 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.2),transparent_70%)] group-hover:opacity-80 transition-opacity duration-500" />
                  
                  {/* Floating AI indicators */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span className="text-blue-300 text-xs font-medium">NEURAL</span>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-blue-400" />
                      Hyperdrive AI Assistant
                    </h3>
                    <p className="text-blue-300 text-sm leading-relaxed">Advanced neural networks analyzing market patterns in real-time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Two Column Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="group relative overflow-hidden border-cyan-400/20 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-500 hover:shadow-[0_15px_30px_rgba(6,182,212,0.2)] hover:scale-105">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2Fa2491b59a9954c639f7ba11de7b12709?format=webp&width=800"
                      alt="Quantum Secure Wallet"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-cyan-500/10 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.2),transparent_70%)] group-hover:opacity-80 transition-opacity duration-500" />
                    
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
                      <span className="text-cyan-300 text-xs">SECURE</span>
                    </div>
                    
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-cyan-400" />
                        Hyperdrive Vault
                      </h4>
                      <p className="text-cyan-300 text-xs">Military-grade encryption</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-green-400/20 bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-xl hover:border-green-400/40 transition-all duration-500 hover:shadow-[0_15px_30px_rgba(34,197,94,0.2)] hover:scale-105">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2Ff2f1e22fb1424efbade2ab911a446901?format=webp&width=800"
                      alt="Multi-Asset Network"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-green-500/10 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.2),transparent_70%)] group-hover:opacity-80 transition-opacity duration-500" />
                    
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-300 text-xs">MULTI</span>
                    </div>
                    
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        Hyperdrive Network
                      </h4>
                      <p className="text-green-300 text-xs">100+ cryptocurrencies</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Features Grid */}
            <div className="grid grid-cols-4 gap-3">
              <Card className="border-blue-400/20 bg-blue-900/10 backdrop-blur-xl hover:bg-blue-900/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-3 text-center">
                  <div className="relative mb-2">
                    <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-sm animate-pulse" />
                    <div className="relative w-8 h-8 mx-auto bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-full flex items-center justify-center border border-blue-400/30">
                      <Brain className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                  <p className="text-xs text-blue-300 font-medium">Hyperdrive AI</p>
                </CardContent>
              </Card>

              <Card className="border-purple-400/20 bg-purple-900/10 backdrop-blur-xl hover:bg-purple-900/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-3 text-center">
                  <div className="relative mb-2">
                    <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-sm animate-pulse" />
                    <div className="relative w-8 h-8 mx-auto bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-full flex items-center justify-center border border-purple-400/30">
                      <Zap className="w-4 h-4 text-purple-400" />
                    </div>
                  </div>
                  <p className="text-xs text-purple-300 font-medium">24/7 Trading</p>
                </CardContent>
              </Card>

              <Card className="border-cyan-400/20 bg-cyan-900/10 backdrop-blur-xl hover:bg-cyan-900/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-3 text-center">
                  <div className="relative mb-2">
                    <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-sm animate-pulse" />
                    <div className="relative w-8 h-8 mx-auto bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-full flex items-center justify-center border border-cyan-400/30">
                      <Shield className="w-4 h-4 text-cyan-400" />
                    </div>
                  </div>
                  <p className="text-xs text-cyan-300 font-medium">Secure</p>
                </CardContent>
              </Card>

              <Card className="border-green-400/20 bg-green-900/10 backdrop-blur-xl hover:bg-green-900/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-3 text-center">
                  <div className="relative mb-2">
                    <div className="absolute inset-0 bg-green-400/20 rounded-full blur-sm animate-pulse" />
                    <div className="relative w-8 h-8 mx-auto bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full flex items-center justify-center border border-green-400/30">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                  <p className="text-xs text-green-300 font-medium">Profitable</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Side - Enhanced Login Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <LoginForm />

              {/* Enhanced Stats Footer */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-3 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 text-center">
                    <div className="text-lg font-bold text-blue-400">99.9%</div>
                    <div className="text-xs text-gray-400">Uptime</div>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-3 border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 text-center">
                    <div className="text-lg font-bold text-purple-400">75K+</div>
                    <div className="text-xs text-gray-400">Users</div>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-3 border border-green-400/20 hover:border-green-400/40 transition-all duration-300 text-center">
                    <div className="text-lg font-bold text-green-400">3.2%</div>
                    <div className="text-xs text-gray-400">Daily Avg</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
        <ChevronDown className="w-5 h-5 text-blue-400 opacity-60" />
      </div>

      {/* Footer */}
      <AuthFooter />
    </main>
  );
}
