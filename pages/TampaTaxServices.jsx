import { useState } from 'react'
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Textarea } from '../components/ui/textarea.jsx';
import { CheckCircle2, ArrowLeft, MapPin, Phone, Mail, Calendar, Star, Users, Shield, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { submitToGoogleSheets } from '../lib/formSubmission.js'

function TampaTaxServices() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
      await submitToGoogleSheets(formData, 'tampaTaxServices')
      console.log('Tampa Tax Services Form submitted:', formData)
      setSubmitted(true)
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (error) {
      console.error('Form submission failed:', error)
      alert('There was an error submitting your form. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-900 via-green-800 to-slate-900 text-white py-6">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 mb-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Professional Tax Services in Tampa, Florida
            </h1>
            <p className="text-xl md:text-2xl text-green-600 mb-4">
              FL Tax Services: Your Trusted Local Tax Experts
            </p>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Serving Tampa residents and businesses with expert tax preparation, accounting services, and financial guidance. As a Florida-based firm, we understand the unique tax landscape of the Tampa Bay area.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Tax Services for Tampa Residents & Businesses
              </h2>
              <p className="text-xl text-slate-600">
                Comprehensive tax preparation and accounting services tailored to Tampa's growing community
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>Individual Tax Preparation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Expert preparation of federal and Florida state tax returns for Tampa residents, including complex deductions and credits.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>Business Tax Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Specialized tax services for Tampa businesses, including LLCs, corporations, and self-employed professionals in the Tampa Bay area.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle>Tax Planning & Consulting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Year-round tax planning and consulting to help Tampa taxpayers minimize their tax liability and maximize savings.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-100 to-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Why Choose FL Tax Services in Tampa?
              </h2>
              <p className="text-xl text-slate-600">
                Local expertise with national standards
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Local Florida Expertise</h3>
                    <p className="text-slate-600">Deep understanding of Florida tax laws and Tampa Bay-specific economic considerations.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Maximum Refunds</h3>
                    <p className="text-slate-600">We find every deduction and credit you're entitled to claim.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Peace of Mind</h3>
                    <p className="text-slate-600">Accurate, compliant tax returns with professional representation if needed.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Year-Round Support</h3>
                    <p className="text-slate-600">Ongoing tax planning and support throughout the year.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Digital Convenience</h3>
                    <p className="text-slate-600">Secure online filing and digital document management.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Affordable Rates</h3>
                    <p className="text-slate-600">Competitive pricing with transparent fees and no hidden costs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-green-900 to-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get Started with Tampa Tax Services
              </h2>
              <p className="text-xl text-green-100">
                Contact FL Tax Services today for professional tax help in Tampa
              </p>
            </div>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                    <p className="text-green-100">
                      We've received your message and will be in touch soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-white text-base mb-2 block">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-green-400"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-white text-base mb-2 block">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-green-400"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-white text-base mb-2 block">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-green-400"
                        placeholder="(813) 555-0123"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-white text-base mb-2 block">
                        How Can We Help You?
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-green-400 min-h-32"
                        placeholder="Tell us about your tax situation in Tampa..."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-green-500 hover:bg-green-600 text-white text-lg py-6"
                    >
                      Contact Tampa Tax Experts
                      <ArrowLeft className="ml-2 w-5 h-5 rotate-180" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Tampa Tax Services FAQ
              </h2>
              <p className="text-xl text-slate-600">
                Common questions about tax preparation in Tampa
              </p>
            </div>

            <div className="space-y-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Do you serve all areas of Tampa Bay?</h3>
                  <p className="text-slate-600">Yes, FL Tax Services provides tax preparation services throughout the Tampa Bay area, including St. Petersburg, Clearwater, and surrounding communities.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">What tax forms do you handle for Tampa residents?</h3>
                  <p className="text-slate-600">We handle all federal forms (1040, 1040A, 1040EZ) and Florida state forms (F-1040, F-7004) for Tampa residents and businesses.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Are you familiar with Tampa-specific tax considerations?</h3>
                  <p className="text-slate-600">Absolutely. We understand Tampa's diverse economy, including healthcare, finance, tourism, and local tax incentives in the Tampa Bay region.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Do you offer same-day tax preparation in Tampa?</h3>
                  <p className="text-slate-600">For urgent situations, we offer expedited service. Contact us to discuss your timeline and we'll accommodate when possible.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-slate-400 mb-4">
              <strong>Disclaimer:</strong> This content is for informational purposes only and does not constitute tax advice. Please consult with a qualified tax professional for personalized advice. Tax laws are subject to change. Always refer to official IRS publications for the most up-to-date information.
            </p>
            <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} FL Tax Services. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default TampaTaxServices

