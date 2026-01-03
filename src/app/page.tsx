import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ZipCodeChecker } from "@/components/features/ZipCodeChecker";
import { Clock, ShieldCheck, Sparkles, MapPin, Truck, Shirt, ArrowRight, Star, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden pt-4 md:pt-0">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-mesh" />

        {/* Decorative Blobs - Hidden on mobile */}
        <div className="hidden md:block absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float-slow" />
        <div className="hidden md:block absolute bottom-20 right-10 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="hidden md:block absolute top-1/2 left-1/2 w-64 h-64 bg-success/10 rounded-full blur-3xl" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 pattern-grid opacity-30 md:opacity-50" />

        <div className="container mx-auto px-4 py-8 md:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="space-y-8">
              <div className="animate-fade-in-up">
                <Badge className="bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-primary/20 px-4 py-2 text-sm font-medium">
                  <Zap className="h-3.5 w-3.5 mr-1.5" />
                  Now Serving Toledo & BGSU Area
                </Badge>
              </div>

              <h1 className="animate-fade-in-up delay-100">
                <span className="heading-xl text-gray-900 block">
                  Premium Laundry
                </span>
                <span className="heading-xl gradient-text block">
                  Concierge Service
                </span>
              </h1>

              <p className="text-base md:text-xl text-gray-600 max-w-lg leading-relaxed animate-fade-in-up delay-200">
                We pickup, clean, and deliver your laundry with premium care.
                Experience the luxury of <span className="font-semibold text-gray-900">5lbs free</span> on your first order.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg btn-premium gradient-primary border-0 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 group"
                  asChild
                >
                  <Link href="/book">
                    Schedule Pickup
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg border-2 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                  asChild
                >
                  <Link href="#how-it-works">How it works</Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap gap-2 md:gap-6 animate-fade-in-up delay-400">
                {[
                  { icon: ShieldCheck, text: "Fully Insured", color: "text-emerald-500" },
                  { icon: Sparkles, text: "Eco-Friendly", color: "text-primary" },
                  { icon: Clock, text: "24h Turnaround", color: "text-violet-500" },
                ].map((item, index) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-1.5 md:gap-2.5 text-xs md:text-sm text-gray-600 font-medium bg-white/60 backdrop-blur-sm px-2.5 md:px-4 py-1.5 md:py-2 rounded-full border border-gray-100 shadow-sm"
                  >
                    <item.icon className={`h-3 w-3 md:h-4 md:w-4 ${item.color}`} />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-fade-in-up delay-200">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl rounded-full transform scale-90" />

              {/* Main Image Container */}
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/50 hover:shadow-glow-lg transition-shadow duration-500">
                  <Image
                    src="/images/leqaxa_laundry_van.png"
                    alt="LEQAXA Laundry Delivery Van"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    priority
                  />
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                {/* Floating Card - Satisfaction */}
                <div className="absolute -bottom-6 -left-6 glass-card p-4 rounded-2xl shadow-elevated-lg animate-float hidden md:flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Satisfaction</p>
                    <p className="font-bold text-gray-900 text-lg">Guaranteed</p>
                  </div>
                </div>

                {/* Floating Card - Rating */}
                <div className="absolute -top-4 -right-4 glass-card px-4 py-3 rounded-2xl shadow-elevated-lg animate-float hidden md:block" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-gray-900">5.0</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">500+ Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zip Check Section */}
      <section id="service-area" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 text-center max-w-2xl relative z-10">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold mb-4">
              <MapPin className="h-4 w-4" />
              SERVICE AREA
            </div>
            <h2 className="heading-lg text-gray-900 mb-4">Are we in your neighborhood?</h2>
            <p className="text-gray-600 mb-8 text-lg">
              We serve Toledo, Bowling Green (BGSU), Perrysburg, and surrounding areas.
            </p>
          </div>
          <div className="animate-fade-in-up delay-100">
            <ZipCodeChecker />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary-soft" />
        <div className="absolute inset-0 pattern-dots" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <Badge className="mb-4 bg-white/80 text-primary border-primary/20">Simple Process</Badge>
            <h2 className="heading-lg text-gray-900 mb-4">Laundry Day, Done Differently.</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to fresh, folded clothes delivered to your door.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Book Online",
                description: "Schedule a pickup in seconds. Customize your preferences in our Care Menu.",
                icon: "📱",
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "2",
                title: "We Pickup & Clean",
                description: "We collect your bags and process them with eco-friendly detergents and expert care.",
                icon: "🚐",
                color: "from-violet-500 to-purple-500"
              },
              {
                step: "3",
                title: "Fresh Delivery",
                description: "Your clothes return crisp, folded, and ready for your drawer in 24-48 hours.",
                icon: "✨",
                color: "from-emerald-500 to-teal-500"
              },
            ].map((item, index) => (
              <div
                key={item.step}
                className="animate-fade-in-up group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative bg-white rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                  {/* Step Number with Gradient */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{item.icon}</span>
                  </div>

                  {/* Step Badge */}
                  <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-400">
                    {item.step}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Connector Lines - Desktop Only */}
          <div className="hidden md:block absolute top-[45%] left-[30%] right-[30%] h-0.5">
            <div className="w-full h-full bg-gradient-to-r from-blue-200 via-violet-200 to-emerald-200 rounded-full" />
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section id="services" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 animate-fade-in-up">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl transform rotate-3 scale-105" />
                <Image
                  src="/images/folded_premium_linens.png"
                  alt="Folded Linens"
                  width={600}
                  height={600}
                  className="relative rounded-3xl shadow-2xl"
                />
              </div>
            </div>

            <div className="order-1 md:order-2 space-y-8">
              <div className="animate-fade-in-up">
                <Badge className="mb-4 bg-primary/10 text-primary border-0">Our Services</Badge>
                <h2 className="heading-lg text-gray-900 mb-4">
                  More Than Just Wash & Fold
                </h2>
                <p className="text-lg text-gray-600">
                  We handle everything from your daily casuals to delicate linens and bulky beddings.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: Shirt,
                    title: "Standard Wash & Fold",
                    price: "$2.00/lb",
                    description: "Perfect for everyday clothes, towels, and sheets.",
                    color: "from-primary to-cyan-500",
                    bg: "bg-primary/10"
                  },
                  {
                    icon: Sparkles,
                    title: "Heavy Items & Bedding",
                    price: "From $20",
                    description: "Comforters, Rugs, and Sleeping Bags.",
                    color: "from-violet-500 to-purple-600",
                    bg: "bg-violet-100"
                  },
                  {
                    icon: null,
                    title: "Student Special",
                    price: "$25 flat",
                    description: 'BGSU Students get the "Stuff-a-Bag" deal. Must use .edu email.',
                    color: "from-orange-500 to-amber-500",
                    bg: "bg-orange-100",
                    badge: "BG",
                    isStudent: true
                  },
                ].map((service, index) => (
                  <div
                    key={service.title}
                    className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors animate-fade-in-up group cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-12 h-12 rounded-xl ${service.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      {service.badge ? (
                        <span className="font-bold text-orange-600">{service.badge}</span>
                      ) : service.icon ? (
                        <service.icon className="h-5 w-5 text-primary" />
                      ) : null}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">{service.title}</h3>
                        {service.isStudent && (
                          <Badge className="bg-orange-500 text-white text-xs">Popular</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{service.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                        {service.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Button asChild className="btn-premium gradient-primary border-0 shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group">
                <Link href="/services">
                  View All Services
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Teaser */}
      <section className="py-24 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-white">
              <div className="animate-fade-in-up">
                <Badge className="bg-white/20 text-white border-white/30 mb-4">Coming Soon</Badge>
                <h2 className="heading-lg mb-4">Track clean clothes in your pocket.</h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  Our real-time tracking lets you know exactly when your laundry is picked up, washing, folding, and out for delivery.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 animate-fade-in-up delay-100">
                {[
                  "Live GPS Tracking",
                  "Push Notifications",
                  "Photo Updates",
                  "Easy Rebooking"
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="animate-fade-in-up delay-200">
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-14 px-8 bg-white text-primary font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  Get Started Now
                </Button>
              </div>
            </div>

            <div className="relative animate-fade-in-up delay-100">
              <div className="relative mx-auto w-fit">
                {/* Phone Glow */}
                <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-150" />

                {/* Phone Frame */}
                <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl transform hover:rotate-0 rotate-[-5deg] transition-transform duration-500">
                  <Image
                    src="/images/mobile_app_interface_progress_bar.png"
                    alt="Mobile App Interface"
                    width={280}
                    height={560}
                    className="rounded-[2.5rem]"
                  />
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -left-8 bg-white rounded-2xl px-4 py-2 shadow-xl animate-bounce-subtle hidden md:block">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-medium text-gray-900">Out for delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
