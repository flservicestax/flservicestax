import { useState } from 'react'
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Textarea } from '../components/ui/textarea.jsx';
import { CheckCircle2, ArrowLeft, Calendar, Clock, Users, Shield, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { submitToGoogleSheets } from '../lib/formSubmission.js'

function BookSession() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await submitToGoogleSheets(formData, 'bookSession')
      setSubmitted(true)
      setTimeout(() => navigate('/'), 5000)
    } catch (error) {
      alert('There was an error submitting your form. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-slate-950 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 blur-[100px] transform -translate-y-1/2"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 mb-8"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-primary/30">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Limited Availability Strategy Sessions</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Ready to Stop Worrying?
            </h1>
            <p className="text-xl text-blue-100/80 max-w-2xl mx-auto">
              Schedule Your No-Cost Tax Strategy Session Now. 30 minutes that could save you thousands.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-20 -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-4 gap-4 mb-12">
              {[
                { icon: Calendar, title: "Flexible", desc: "Your schedule" },
                { icon: Users, title: "Expert", desc: "Licensed CPA" },
                { icon: Shield, title: "Private", desc: "100% Secure" },
                { icon: Clock, title: "Quick", desc: "30 Minutes" }
              ].map((item, idx) => (
                <div key={idx} className="glass p-4 text-center rounded-xl animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
                  <item.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="font-bold text-sm">{item.title}</div>
                  <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-3">
                <Card className="glass shadow-3xl border-white/40">
                  <CardHeader>
                    <CardTitle className="text-2xl">Reserve Your Slot</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    {submitted ? (
                      <div className="text-center py-12 animate-fade-in">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-3xl font-bold mb-4">Session Requested!</h3>
                        <p className="text-muted-foreground text-lg mb-6">
                          Check your email. We're matching you with a specialist for your selected time.
                        </p>
                        <Button onClick={() => navigate('/')}>Return Home</Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input id="name" name="name" required value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="bg-white/50" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className="bg-white/50" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleInputChange} placeholder="(555) 123-4567" className="bg-white/50" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="preferredDate">Preferred Date *</Label>
                            <Input id="preferredDate" name="preferredDate" type="date" required value={formData.preferredDate} onChange={handleInputChange} className="bg-white/50" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="preferredTime">Preferred Time *</Label>
                            <Input id="preferredTime" name="preferredTime" type="time" required value={formData.preferredTime} onChange={handleInputChange} className="bg-white/50" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Main Concern</Label>
                          <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} className="min-h-32 bg-white/50" placeholder="e.g., Audit protection, maximum refund, or business tax strategy..." />
                        </div>

                        <Button type="submit" size="lg" className="w-full h-14 text-lg shadow-xl hover:shadow-2xl transition-all">
                          Confirm Booking
                          <Calendar className="ml-2 w-5 h-5" />
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Info Sidebar */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="glass bg-slate-900 border-slate-800 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-900">What to Expect</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      { step: "1", title: "Situation Analysis", desc: "Detailed review of your 2024 tax profile." },
                      { step: "2", title: "Saving Identification", desc: "We pinpoint credits you are missing." },
                      { step: "3", title: "Custom Roadmap", desc: "A step-by-step plan for your filing." }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <div className="font-bold">{item.title}</div>
                          <div className="text-xs text-slate-400">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                  <p className="text-sm text-muted-foreground italic">
                    "This 30-minute call saved me over $4,200 on my last return. Don't skip it."
                  </p>
                  <p className="text-xs font-bold mt-2">â€” Sarah J., Orlando Small Business Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white/40 py-12 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} FL Tax Services. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default BookSession

