import { useState } from 'react'
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { CheckCircle2, ArrowLeft, Download, FileText, BookOpen, CheckSquare, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { submitToGoogleSheets } from '../lib/formSubmission.js'

function PdfGuide() {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear();
  const taxYear = currentYear - 1;

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
      await submitToGoogleSheets(formData, 'pdfGuide')
      setSubmitted(true)

      // Immediately download the PDF
      const link = document.createElement('a')
      link.href = '/Florida & Federal Master Tax Booklet.pdf'
      link.download = 'Florida & Federal Master Tax Booklet.pdf'
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Redirect to main page after download
      setTimeout(() => navigate('/'), 3000)
    } catch (error) {
      alert('There was an error submitting your form. Please try again.')
    }
  }

  const features = [
    { icon: BookOpen, title: "Insider Tips", desc: `Expert strategies to maximize your ${taxYear} deductions.` },
    { icon: CheckSquare, title: "Avoid Pitfalls", desc: "Common mistakes that trigger unwanted IRS audits." },
    { icon: CheckCircle2, title: "Refund Checklist", desc: "Step-by-step list to ensure no money is left behind." }
  ];

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
              <span className="text-sm font-medium">Free Educational Resource</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Still Confused by Form 1040?
            </h1>
            <p className="text-xl text-blue-100/80 max-w-2xl mx-auto">
              Download Our 'Florida Taxpayer's Survival Guide' - Absolutely Free!
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-20 -mt-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">

            {/* Features Row */}
            <div className="grid md:grid-cols-3 gap-6 mb-16 px-4">
              {features.map((item, idx) => (
                <div key={idx} className="glass p-8 text-center rounded-2xl animate-fade-in-up" style={{ animationDelay: `${idx * 200}ms` }}>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Form Section */}
              <div>
                <Card className="glass shadow-3xl border-white/40 overflow-hidden">
                  <div className="h-2 bg-primary w-full"></div>
                  <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-3xl">Get Your Copy</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-4">
                    {submitted ? (
                      <div className="text-center py-12 animate-fade-in">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-3xl font-bold mb-4">Download Started!</h3>
                        <p className="text-muted-foreground text-lg mb-4">
                          Your guide is on its way. Check your downloads folder.
                        </p>
                        <p className="text-sm italic text-muted-foreground">Redirecting you home...</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input id="name" name="name" required value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="bg-white/50" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className="bg-white/50" />
                        </div>
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-xs text-muted-foreground">
                          <strong>Privacy Promise:</strong> We never share your data. You'll only receive the guide and essential tax updates.
                        </div>
                        <Button type="submit" size="lg" className="w-full h-14 text-lg shadow-xl hover:shadow-2xl transition-all">
                          Download Free Guide
                          <Download className="ml-2 w-5 h-5" />
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Preview Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Key Topics Covered</h2>
                  <div className="space-y-4">
                    {[
                      "Qualified Business Income Deductions",
                      "Education Credits for Florida Students",
                      "Digital Asset & Crypto Reporting",
                      "Florida Homeowner Tax Breaks",
                      "IRS Audit Triggers to Avoid"
                    ].map((topic, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-slate-700 font-medium">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8 rounded-2xl bg-slate-900 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] group-hover:bg-primary/30 transition-all"></div>
                  <FileText className="w-12 h-12 text-primary mb-4" />
                  <div className="text-2xl font-bold mb-2">{taxYear} Edition</div>
                  <p className="text-slate-400 text-sm">Updated with the latest {taxYear} federal tax laws and Florida-specific regulations.</p>
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

export default PdfGuide

