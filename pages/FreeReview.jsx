import { useState } from 'react'
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Textarea } from '../components/ui/textarea.jsx';
import { CheckCircle2, ArrowLeft, Shield, FileCheck, TrendingUp, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { submitToGoogleSheets } from '../lib/formSubmission.js'

function FreeReview() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    taxYear: '',
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
      await submitToGoogleSheets(formData, 'freeReview')
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
              <span className="text-sm font-medium">Expert Second Opinion</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Think You've Got It Covered?
            </h1>
            <p className="text-xl text-blue-100/80 max-w-2xl mx-auto">
              Get a professional second look at your previous returns. Identification of missing credits is our specialty.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-20 -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">

            {/* Benefits Section */}
            <div className="grid md:grid-cols-3 gap-6 mb-16 px-4">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-100 shadow-sm animate-fade-in-up">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Expert Analysis</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Professional review by licensed tax experts.</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-100 shadow-sm animate-fade-in-up animation-delay-200">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <FileCheck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold mb-2">Hidden Savings</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">We find what general software often misses.</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-100 shadow-sm animate-fade-in-up animation-delay-400">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold mb-2">Zero Risk</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">No obligation review to ensure total accuracy.</p>
              </div>
            </div>

            {/* Form Section */}
            <Card className="glass shadow-3xl border-white/40 overflow-hidden">
              <div className="h-2 bg-primary w-full"></div>
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-3xl text-center">Request Your Free Review</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                {submitted ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Request Received!</h3>
                    <p className="text-muted-foreground text-lg mb-6">
                      One of our specialists will review your details and contact you within 24 hours.
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

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="(555) 123-4567" className="bg-white/50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxYear">Tax Year to Review *</Label>
                        <Input id="taxYear" name="taxYear" required value={formData.taxYear} onChange={handleInputChange} placeholder="2024" className="bg-white/50" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Any specific concerns?</Label>
                      <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} className="min-h-32 bg-white/50" placeholder="e.g., I'm not sure if I claimed the energy credit correctly..." />
                    </div>

                    <Button type="submit" size="lg" className="w-full h-14 text-lg shadow-xl hover:shadow-2xl transition-all">
                      Submit Review Request
                      <CheckCircle2 className="ml-2 w-5 h-5" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

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

export default FreeReview


