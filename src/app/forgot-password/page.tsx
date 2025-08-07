import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AstralLogo } from "@/components/icons/astral-logo";
import { ImageSlider } from "@/components/auth/image-slider";
import { AuthFooter } from "@/components/ui/auth-footer";
import { Brain, Shield, KeyRound, Lock, Atom, Waves, ChevronDown, RefreshCw } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Password Recovery - AstralCore",
    description: "Recover your AstralCore account with quantum security protocols.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="purple relative min-h-dvh overflow-hidden bg-black">
      {/* Enhanced Neural Background matching welcome page */}
      <div className="fixed inset-0 z-0">
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/90 via-orange-950/80 to-yellow-950/70 animate-pulse" 
             style={{animationDuration: '4s'}} />
        
        {/* Moving particles */}
        <div className="absolute inset-0">
          {[...Array(35)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-orange-400/60 rounded-full animate-bounce"
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
            <linearGradient id="neuralGradForgot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(239,68,68)" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="rgb(251,146,60)" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="rgb(250,204,21)" stopOpacity="0.4"/>
            </linearGradient>
          </defs>
          
          {/* Dynamic neural connections */}
          <path d="M100,200 Q300,100 500,200 T900,200" stroke="url(#neuralGradForgot)" strokeWidth="2" className="animate-pulse" fill="none"/>
          <path d="M100,400 Q300,300 500,400 T900,400" stroke="url(#neuralGradForgot)" strokeWidth="2" className="animate-pulse" fill="none" style={{animationDelay: '0.8s'}}/>
          <path d="M100,600 Q300,500 500,600 T900,600" stroke="url(#neuralGradForgot)" strokeWidth="2" className="animate-pulse" fill="none" style={{animationDelay: '1.6s'}}/>
          
          {/* Neural nodes */}
          <circle cx="200" cy="200" r="4" fill="rgb(239,68,68)" className="animate-pulse" opacity="0.8"/>
          <circle cx="500" cy="300" r="4" fill="rgb(251,146,60)" className="animate-pulse" opacity="0.8" style={{animationDelay: '0.5s'}}/>
          <circle cx="800" cy="500" r="4" fill="rgb(250,204,21)" className="animate-pulse" opacity="0.8" style={{animationDelay: '1s'}}/>
        </svg>

        {/* Holographic grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Enhanced Top Banner */}
      <div className="relative z-30 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          {/* Security Status */}
          <div className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl rounded-full border border-orange-500/30">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(251,146,60,0.6)]" />
            <span className="text-orange-400 font-bold text-xs sm:text-sm tracking-wider">● QUANTUM RECOVERY</span>
          </div>
          
          {/* Security Badges */}
          <div className="hidden sm:flex items-center gap-3">
            <Badge variant="outline" className="border-red-400/40 text-red-300 bg-red-400/10 px-3 py-1">
              <Shield className="w-3 h-3 mr-1" />
              Secure Reset
            </Badge>
            <Badge variant="outline" className="border-orange-400/40 text-orange-300 bg-orange-400/10 px-3 py-1">
              <KeyRound className="w-3 h-3 mr-1" />
              Encrypted
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
            <div className="absolute inset-0 border-2 border-red-400/30 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
            <div className="absolute inset-2 border-2 border-orange-400/40 rounded-full animate-spin" style={{animationDuration: '6s', animationDirection: 'reverse'}}></div>
            
            {/* Central logo */}
            <div className="absolute inset-4 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-400/30 rounded-lg blur-md animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-red-500/20 to-orange-500/10 p-2 rounded-lg border border-orange-400/30">
                  <KeyRound className="h-8 w-8 text-orange-400 drop-shadow-[0_0_20px_rgba(251,146,60,0.8)]" />
                </div>
              </div>
            </div>
            
            {/* Orbiting elements */}
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-red-400 rounded-full animate-bounce shadow-[0_0_6px_rgba(239,68,68,0.8)]" style={{animationDelay: '0s'}} />
            <div className="absolute top-1/2 right-0 w-1 h-1 bg-orange-400 rounded-full animate-bounce shadow-[0_0_6px_rgba(251,146,60,0.8)]" style={{animationDelay: '0.5s'}} />
            <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-bounce shadow-[0_0_6px_rgba(250,204,21,0.8)]" style={{animationDelay: '1s'}} />
            <div className="absolute top-1/2 left-0 w-1 h-1 bg-pink-400 rounded-full animate-bounce shadow-[0_0_6px_rgba(236,72,153,0.8)]" style={{animationDelay: '1.5s'}} />
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4 leading-tight">
          Quantum Password Recovery
        </h1>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <Atom className="w-4 h-4 text-red-400 animate-spin" style={{animationDuration: '3s'}} />
          <p className="text-lg text-gray-300 font-light tracking-wide">
            Secure Account Recovery Protocol
          </p>
          <Atom className="w-4 h-4 text-orange-400 animate-spin" style={{animationDuration: '3s', animationDirection: 'reverse'}} />
        </div>

        {/* Security Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <Badge variant="outline" className="border-red-400/50 text-red-300 bg-red-400/10 px-3 py-1">
            <Shield className="w-3 h-3 mr-1" />
            Quantum Encryption
          </Badge>
          <Badge variant="outline" className="border-orange-400/50 text-orange-300 bg-orange-400/10 px-3 py-1">
            <Lock className="w-3 h-3 mr-1" />
            Secure Recovery
          </Badge>
          <Badge variant="outline" className="border-yellow-400/50 text-yellow-300 bg-yellow-400/10 px-3 py-1">
            <RefreshCw className="w-3 h-3 mr-1" />
            Instant Reset
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

          {/* Left Side - Enhanced Security Feature Cards */}
          <div className="hidden lg:block space-y-6">
            {/* Main Security Card */}
            <Card className="group relative overflow-hidden border-red-400/20 bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-xl hover:border-red-400/40 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(239,68,68,0.2)] hover:scale-105">
              <CardContent className="p-0">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2F52f48e5632374229b8d5254907e7dc34?format=webp&width=800"
                    alt="Quantum Security Matrix"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Holographic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-red-500/10 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.2),transparent_70%)] group-hover:opacity-80 transition-opacity duration-500" />
                  
                  {/* Floating security indicators */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                    <span className="text-red-300 text-xs font-medium">SECURE</span>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-400" />
                      Quantum Security Matrix
                    </h3>
                    <p className="text-red-300 text-sm leading-relaxed">Advanced encryption protocols protecting your account recovery process</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Two Column Security Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="group relative overflow-hidden border-orange-400/20 bg-gradient-to-br from-orange-900/20 to-yellow-900/20 backdrop-blur-xl hover:border-orange-400/40 transition-all duration-500 hover:shadow-[0_15px_30px_rgba(251,146,60,0.2)] hover:scale-105">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2Fa2491b59a9954c639f7ba11de7b12709?format=webp&width=800"
                      alt="Encrypted Recovery"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-orange-500/10 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.2),transparent_70%)] group-hover:opacity-80 transition-opacity duration-500" />
                    
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse" />
                      <span className="text-orange-300 text-xs">ENCRYPT</span>
                    </div>
                    
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-orange-400" />
                        Encrypted Recovery
                      </h4>
                      <p className="text-orange-300 text-xs">End-to-end security</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden border-yellow-400/20 bg-gradient-to-br from-yellow-900/20 to-red-900/20 backdrop-blur-xl hover:border-yellow-400/40 transition-all duration-500 hover:shadow-[0_15px_30px_rgba(250,204,21,0.2)] hover:scale-105">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2F4b279aceeead46d4bb4166202e68dc54%2Faa19381a004d49dabf38b45dce30fd13?format=webp&width=800"
                      alt="Instant Recovery"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-yellow-500/10 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.2),transparent_70%)] group-hover:opacity-80 transition-opacity duration-500" />
                    
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse" />
                      <span className="text-yellow-300 text-xs">INSTANT</span>
                    </div>
                    
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 text-yellow-400" />
                        Instant Reset
                      </h4>
                      <p className="text-yellow-300 text-xs">Quick recovery</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Security Features Grid */}
            <div className="grid grid-cols-4 gap-3">
              <Card className="border-red-400/20 bg-red-900/10 backdrop-blur-xl hover:bg-red-900/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-3 text-center">
                  <div className="relative mb-2">
                    <div className="absolute inset-0 bg-red-400/20 rounded-full blur-sm animate-pulse" />
                    <div className="relative w-8 h-8 mx-auto bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-full flex items-center justify-center border border-red-400/30">
                      <Shield className="w-4 h-4 text-red-400" />
                    </div>
                  </div>
                  <p className="text-xs text-red-300 font-medium">Quantum Safe</p>
                </CardContent>
              </Card>

              <Card className="border-orange-400/20 bg-orange-900/10 backdrop-blur-xl hover:bg-orange-900/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-3 text-center">
                  <div className="relative mb-2">
                    <div className="absolute inset-0 bg-orange-400/20 rounded-full blur-sm animate-pulse" />
                    <div className="relative w-8 h-8 mx-auto bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-full flex items-center justify-center border border-orange-400/30">
                      <Lock className="w-4 h-4 text-orange-400" />
                    </div>
                  </div>
                  <p className="text-xs text-orange-300 font-medium">Encrypted</p>
                </CardContent>
              </Card>

              <Card className="border-yellow-400/20 bg-yellow-900/10 backdrop-blur-xl hover:bg-yellow-900/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-3 text-center">
                  <div className="relative mb-2">
                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-sm animate-pulse" />
                    <div className="relative w-8 h-8 mx-auto bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-full flex items-center justify-center border border-yellow-400/30">
                      <RefreshCw className="w-4 h-4 text-yellow-400" />
                    </div>
                  </div>
                  <p className="text-xs text-yellow-300 font-medium">Instant</p>
                </CardContent>
              </Card>

              <Card className="border-pink-400/20 bg-pink-900/10 backdrop-blur-xl hover:bg-pink-900/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-3 text-center">
                  <div className="relative mb-2">
                    <div className="absolute inset-0 bg-pink-400/20 rounded-full blur-sm animate-pulse" />
                    <div className="relative w-8 h-8 mx-auto bg-gradient-to-br from-pink-500/20 to-pink-600/10 rounded-full flex items-center justify-center border border-pink-400/30">
                      <Brain className="w-4 h-4 text-pink-400" />
                    </div>
                  </div>
                  <p className="text-xs text-pink-300 font-medium">AI Verify</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Side - Enhanced Forgot Password Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <ForgotPasswordForm />

              {/* Enhanced Security Footer */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-3 border border-red-400/20 hover:border-red-400/40 transition-all duration-300 text-center">
                    <div className="text-lg font-bold text-red-400">256-bit</div>
                    <div className="text-xs text-gray-400">Encryption</div>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
                  <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-3 border border-orange-400/20 hover:border-orange-400/40 transition-all duration-300 text-center">
                    <div className="text-lg font-bold text-orange-400">&lt;30s</div>
                    <div className="text-xs text-gray-400">Recovery Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30">
        <ChevronDown className="w-5 h-5 text-orange-400 opacity-60" />
      </div>

      {/* Footer */}
      <AuthFooter />
    </main>
  );
}
