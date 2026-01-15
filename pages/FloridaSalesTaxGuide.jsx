import { useState } from 'react'
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { CheckCircle2, ArrowLeft, Download, FileText, BookOpen, CheckSquare, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { submitToGoogleSheets } from '../lib/formSubmission.js'

function FloridaSalesTaxGuide() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: ''
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
      await submitToGoogleSheets(formData, 'floridaSalesTaxGuide')
      console.log('Florida Sales Tax Guide Form submitted:', formData)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-900 via-orange-800 to-slate-900 text-white py-6">
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
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-orange-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              The Ultimate Guide to Florida Sales Tax Exemptions
            </h1>
            <p className="text-xl md:text-2xl text-orange-600 mb-4">
              Save Thousands on Your Purchases - Legally
            </p>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Florida's sales tax system is complex, but understanding it can save you significant money. This comprehensive guide covers everything from basic exemptions to advanced strategies used by savvy Florida taxpayers.
            </p>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Why Florida Sales Tax Exemptions Matter
              </h2>
              <p className="text-xl text-slate-600">
                Understanding these rules can save you thousands annually
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <CheckSquare className="w-6 h-6 text-orange-600" />
                  </div>
                  <CardTitle>Major Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Florida's average sales tax rate is 6.85%, but many purchases are exempt, saving consumers hundreds or thousands annually.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>Complex Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    With over 20 different tax rates across counties and numerous exemptions, understanding the system is crucial for maximum savings.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>Legal Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Proper use of exemptions ensures you're following Florida law while maximizing your purchasing power.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-100 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {/* Basic Exemptions */}
              <Card className="p-8">
                <CardTitle className="text-2xl mb-6">Essential Exemptions Every Floridian Should Know</CardTitle>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">1. Prescription Drugs & Medical Supplies</h3>
                    <p className="text-slate-600 mb-2">All prescription medications and medically necessary supplies are exempt from sales tax.</p>
                    <p className="text-sm text-slate-500">Source: <a href="https://floridarevenue.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Florida Department of Revenue <ExternalLink className="inline w-3 h-3" /></a></p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">2. Food & Groceries</h3>
                    <p className="text-slate-600 mb-2">Most food items for home consumption are exempt, but prepared foods and restaurant meals are taxed.</p>
                    <p className="text-sm text-slate-500">Source: <a href="https://floridarevenue.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Florida Department of Revenue <ExternalLink className="inline w-3 h-3" /></a></p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">3. Agricultural Equipment & Supplies</h3>
                    <p className="text-slate-600 mb-2">Farm equipment, fertilizers, and supplies used in agricultural production are exempt.</p>
                    <p className="text-sm text-slate-500">Source: <a href="https://floridarevenue.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Florida Department of Revenue <ExternalLink className="inline w-3 h-3" /></a></p>
                  </div>
                </div>
              </Card>

              {/* Advanced Strategies */}
              <Card className="p-8">
                <CardTitle className="text-2xl mb-6">Advanced Tax-Saving Strategies</CardTitle>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Cross-County Shopping</h3>
                    <p className="text-slate-600 mb-2">Take advantage of varying local tax rates. Miami-Dade County has a 1% local tax while some rural counties have none.</p>
                    <p className="text-sm text-slate-500">For specialized help with tax planning, contact <a href="#contact" className="text-blue-600 hover:underline">FL Tax Services</a>.</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Business Purchases</h3>
                    <p className="text-slate-600 mb-2">Businesses can claim exemptions on equipment and supplies with proper resale certificates.</p>
                    <p className="text-sm text-slate-500">Source: <a href="https://floridarevenue.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Florida Department of Revenue <ExternalLink className="inline w-3 h-3" /></a></p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Seasonal Exemptions</h3>
                    <p className="text-slate-600 mb-2">Back-to-school shopping periods and hurricane preparedness supplies often qualify for temporary exemptions.</p>
                    <p className="text-sm text-slate-500">Source: <a href="https://floridarevenue.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Florida Department of Revenue <ExternalLink className="inline w-3 h-3" /></a></p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-orange-900 via-orange-800 to-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Your Complete Florida Sales Tax Guide
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Download our comprehensive guide with checklists, exemption certificates, and expert tips
            </p>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                    <p className="text-orange-100">
                      Check your email for the complete Florida Sales Tax Guide.
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
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-orange-400"
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
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-orange-400"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="bg-orange-500/20 backdrop-blur-sm rounded-lg p-4">
                      <p className="text-sm text-white">
                        <strong>Privacy Promise:</strong> We respect your privacy. Your email will only be used to send you the guide and occasional tax tips. You can unsubscribe at any time.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-6"
                    >
                      <Download className="mr-2 w-5 h-5" />
                      Download Free Complete Guide
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
                Florida Sales Tax FAQ
              </h2>
              <p className="text-xl text-slate-600">
                Answers to common questions about Florida sales tax
              </p>
            </div>

            <div className="space-y-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">What is Florida's current sales tax rate?</h3>
                  <p className="text-slate-600">Florida's state sales tax rate is 6%, but combined with local taxes, rates range from 6% to 7.5% depending on the county.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Are clothing and shoes exempt from sales tax?</h3>
                  <p className="text-slate-600">No, clothing and shoes are subject to sales tax in Florida. However, some items like protective clothing may qualify for exemptions.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">Can I get a refund for taxes paid on exempt purchases?</h3>
                  <p className="text-slate-600">Generally no, but some businesses offer tax-free shopping days or you can shop in areas with lower tax rates.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3">How do I claim an exemption when purchasing?</h3>
                  <p className="text-slate-600">Present a valid exemption certificate or resale certificate to the seller before purchase. Different certificates are required for different types of exemptions.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-orange-900 to-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need Help with Tax Planning?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Our tax experts can help you maximize savings and ensure compliance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-6"
                onClick={() => navigate('/book-session')}
              >
                Schedule Free Consultation
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-900 text-lg px-8 py-6"
                onClick={() => navigate('/')}
              >
                Learn More About FL Tax Services
              </Button>
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

export default FloridaSalesTaxGuide

