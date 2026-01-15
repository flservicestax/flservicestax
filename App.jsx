import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card.jsx';
import { Input } from './components/ui/input.jsx';
import { Label } from './components/ui/label.jsx';
import { Textarea } from './components/ui/textarea.jsx';
import { AlertCircle, CheckCircle2, FileText, Shield, TrendingUp, Users, Phone, Mail, MapPin, Download, ArrowRight, Calendar } from 'lucide-react'
import { submitToGoogleSheets, validateFormData } from './lib/formSubmission.js'
import VideoPopup from './components/VideoPopup.jsx'
import ChatBubble from './components/ChatBubble.jsx';

function App() {
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
      const validation = validateFormData(formData, 'general')
      if (!validation.valid) {
        alert(validation.errors.join('\n'))
        return
      }
      await submitToGoogleSheets(formData, 'general')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      alert('There was an error submitting your form. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary">
      {/* Hero Section */}
      <header className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-950 text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse animation-delay-400"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6TTAgMjZjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMi0xMi01LjM3My0xMi0xMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Tax Season {new Date().getFullYear()} - Don't Get Left Behind</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
              Expert Tax Preparation for Florida Residents and Businesses
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-fade-in-up animation-delay-200">
              Are You <em>Sure</em> You Want to File Your Own Taxes This Year?
            </p>
            <p className="text-lg mb-10 text-blue-50 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
              Every year, thousands of Floridians bravely tackle their own tax returns, armed with good intentions and a stack of IRS forms. But what if that bravery is actually costing you more than you think?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
              <Button
                size="lg"
                className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={() => navigate('/book-session')}
              >
                Get Your FREE Tax Strategy Session
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 text-lg px-8 py-6 shadow-xl transition-all duration-300"
                onClick={() => navigate('/pdf-guide')}
              >
                <Download className="mr-2 w-5 h-5" />
                Download Free PDF Guide
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </header>

      {/* Pain Points Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                The Allure of DIY vs. The Harsh Reality
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                It's tempting to save a few dollars by preparing your own taxes. But the truth is, the tax code is a labyrinth, and a single misstep can lead to significant consequences.
              </p>
              {/* Video Container */}
              <div className="mt-8 rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-auto object-cover"
                >
                  <source src="/tax-pro-calculating-person-credits-expenses-payments-refunds.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card className="glass group hover:border-primary/50 transition-all duration-500 transform hover:-translate-y-2">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <CardTitle className="text-xl">Complex Deductions & Credits</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Do you know all the specific requirements for the Qualified Business Income Deduction, education credits, or residential energy credits? Many taxpayers overlook legitimate savings because they simply don't know where to look.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass group hover:border-primary/50 transition-all duration-500 transform hover:-translate-y-2">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl">Fear of Errors & Penalties</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The thought of an IRS audit or receiving a notice about "underreported income" or an "estimated tax penalty" is enough to keep anyone up at night. Are you prepared to navigate these if a mistake occurs?
                  </p>
                </CardContent>
              </Card>

              <Card className="glass group hover:border-primary/50 transition-all duration-500 transform hover:-translate-y-2">
                <CardHeader>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                  <CardTitle className="text-xl">Missing Key Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The IRS highlights numerous credits and deductions that taxpayers might miss. Are you certain you're claiming every possible benefit? Leaving money on the table is a common outcome of DIY tax preparation.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-purple-500">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Digital Assets Complexity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    With the rise of digital assets, tax reporting has become even more complicated. Are you aware of the specific reporting requirements for income from forks, staking, or mining? The IRS is paying close attention.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Record-Keeping Headaches</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    The IRS emphasizes the importance of proper record-keeping. Do you have all your documents organized and readily accessible, not just for filing, but also in case of an inquiry?
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">New Tax Laws & Changes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Tax laws change every year. Are you up to date on the latest regulations, standard deduction amounts, and reporting requirements? Missing these updates can be costly.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-slate-100 to-blue-50 rounded-2xl p-8 md:p-12 text-center shadow-lg">
              <p className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                The IRS Form 1040 instructions alone are over 100 pages long.
              </p>
              <p className="text-xl text-slate-700">
                Are you truly confident you've mastered every detail?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reverse Psychology Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6TTAgMjZjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMi0xMi01LjM3My0xMi0xMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
              Why You <em>Shouldn't</em> Hire Us<br />
              <span className="text-blue-300">(Unless You Value Peace of Mind)</span>
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-8">
              <p className="text-xl md:text-2xl leading-relaxed mb-6">
                If you genuinely enjoy spending hours poring over tax documents, deciphering legal jargon, and constantly worrying about making a mistake, then perhaps you don't need a professional tax preparer.
              </p>
              <p className="text-xl md:text-2xl leading-relaxed">
                If you're confident that you can navigate every new tax law, identify every applicable deduction, and avoid every potential penalty, then by all means, continue to go it alone.
              </p>
            </div>
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-8 md:p-12 border-2 border-blue-400">
              <p className="text-xl md:text-2xl leading-relaxed font-semibold">
                However, if the thought of tax season fills you with dread, if you suspect you're missing out on savings, or if you simply want the peace of mind that comes from knowing your taxes are handled by an expert, then it's time to reconsider.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Florida Advantage Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                The Florida Advantage: Local Expertise, National Standards
              </h2>
              <p className="text-xl text-slate-600">
                As a tax preparer based in Florida, we understand the unique financial landscape and tax considerations that impact residents here. We combine this local insight with a deep understanding of federal tax law.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle>Expert Knowledge</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Deep understanding of both federal and Florida-specific tax regulations
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle>Maximum Refunds</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    We identify every deduction and credit you're entitled to claim
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle>Peace of Mind</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Sleep easy knowing your taxes are accurate and compliant
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Buttons Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-slate-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Don't Wait Until It's Too Late
              </h2>
              <p className="text-xl text-slate-600">
                Take control of your taxes today with our proven strategies
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-2xl">Think You've Got It Covered?</CardTitle>
                  <CardDescription className="text-base">
                    Get a FREE Second Look. No Obligation, Just Clarity.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Even if you've already filed, we can review your return and identify potential savings or issues. This appeals to confidence while offering real value.
                  </p>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => navigate('/free-review')}
                  >
                    Request Free Review
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-green-200">
                <CardHeader>
                  <CardTitle className="text-2xl">Florida Sales Tax Guide</CardTitle>
                  <CardDescription className="text-base">
                    Master Florida Sales Tax Exemptions & Save Thousands
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Learn about prescription drug exemptions, food tax rules, and advanced strategies to minimize your sales tax burden.
                  </p>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => navigate('/florida-sales-tax-guide')}
                  >
                    Read Free Guide
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-2xl">Meet Our Expert Team</CardTitle>
                  <CardDescription className="text-base">
                    Certified Tax Professionals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Our certified tax professionals bring decades of experience in tax planning, preparation, and IRS representation.
                  </p>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => navigate('/team')}
                  >
                    Meet the Team
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-orange-200">
                <CardHeader>
                  <CardTitle className="text-2xl">Local Tax Services</CardTitle>
                  <CardDescription className="text-base">
                    Miami & Tampa Tax Preparation Experts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Specialized tax services for Miami and Tampa residents and businesses. Local expertise with national standards.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-sm"
                      onClick={() => navigate('/miami-tax-services')}
                    >
                      Miami Services
                    </Button>
                    <Button
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-sm"
                      onClick={() => navigate('/tampa-tax-services')}
                    >
                      Tampa Services
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* New Comprehensive Guides Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Florida Tax Resources & Guides
              </h2>
              <p className="text-xl text-slate-600">
                Expert insights to help you navigate Florida's tax landscape
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-blue-400">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>Self-Service Tax Interview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Organize your tax information with our secure, interactive wizard. Get a PDF summary ready for filing.
                  </p>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => navigate('/interview')}
                  >
                    Start Interview
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>Florida Sales Tax Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Complete guide to Florida sales tax exemptions, rates, and strategies to save on purchases.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/florida-sales-tax-guide')}
                  >
                    Read Guide
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>Our Expert Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Meet our certified tax professionals for personalized advice.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/team')}
                  >
                    Meet Team
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle>Local Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">
                    Specialized tax services for Miami and Tampa residents and businesses.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate('/miami-tax-services')}
                    >
                      Miami
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate('/tampa-tax-services')}
                    >
                      Tampa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section id="contact-form" className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get Started Today
              </h2>
              <p className="text-xl text-blue-100">
                Fill out the form below and we'll be in touch within 24 hours
              </p>
            </div>

            <Card className="glass-dark border-white/10 shadow-3xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
              <CardContent className="p-8 md:p-12 relative z-10">
                {submitted ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                      <CheckCircle2 className="w-10 h-10 text-green-400" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 tracking-tight">Success!</h3>
                    <p className="text-blue-100/80 text-lg">
                      We've received your message. One of our specialists will reach out within 24 hours.
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
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-blue-400"
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
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-blue-400"
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
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-blue-400"
                        placeholder="(321) 234-6027"
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
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-blue-400 min-h-32"
                        placeholder="Tell us about your tax situation..."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg py-6"
                    >
                      Submit Your Request
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Contact Us Today
              </h2>
              <p className="text-xl text-slate-600">
                We're here to help you navigate your tax obligations with confidence
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Phone</h3>
                  <p className="text-slate-600">
                    <a href="tel:+13212346027" className="hover:text-blue-600 transition-colors">
                      (321) 234-6027
                    </a>
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    Mon-Fri: 9am - 6pm EST
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Email</h3>
                  <p className="text-slate-600">
                    <a href="mailto:flservicestax@gmail.com" className="hover:text-green-600 transition-colors">
                      flservicestax@gmail.com
                    </a>
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    We respond within 24 hours
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Office</h3>
                  <p className="text-slate-600">
                    Orlando FL USA
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    By appointment only
                  </p>
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

      {/* Floating Book Appointment Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-6 py-3 rounded-full shadow-lg flex items-center animate-bounce-slow"
          onClick={() => navigate("/book-session")}
        >
          <Calendar className="mr-2 w-5 h-5" />
          Book Appointment
        </Button>
      </div>

      {/* Video Popup */}
      <VideoPopup />
      <ChatBubble />
    </div>
  )
}

export default App
