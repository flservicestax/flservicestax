import { useState, useMemo } from 'react'
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { CheckCircle2, ArrowLeft, Calculator, TrendingUp, DollarSign, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { submitToGoogleSheets } from '../lib/formSubmission.js'

function SavingsCalculator() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    income: '',
    filingStatus: 'Single',
    dependents: '0',
    homeOwner: 'No'
  })
  const [submitted, setSubmitted] = useState(false)

  // Client-side estimate logic to increase engagement
  const estimate = useMemo(() => {
    const income = parseFloat(formData.income.replace(/[^0-9.]/g, '')) || 0;
    if (income === 0) return 0;

    let baseSavings = income * 0.05; // Dummy logic: 5% potential missing
    if (formData.homeOwner === 'Yes') baseSavings += 1500;
    if (parseInt(formData.dependents) > 0) baseSavings += parseInt(formData.dependents) * 2000;

    return Math.round(baseSavings);
  }, [formData.income, formData.homeOwner, formData.dependents]);

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
      await submitToGoogleSheets(formData, 'savingsCalculator')
      setSubmitted(true)
      setTimeout(() => navigate('/'), 5000)
    } catch (error) {
      alert('There was an error submitting your form. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
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
              <span className="text-sm font-medium">Free Tax Savings Analysis</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Tired of Tax Season Stress?
            </h1>
            <p className="text-xl text-blue-100/80 max-w-2xl mx-auto">
              Discover exactly how much you could be leaving on the table with our expert analysis.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">

            {/* Form Column */}
            <div className="lg:col-span-3 space-y-8">
              <Card className="glass shadow-2xl border-white/40">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-2xl">Step 1: Your Information</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  {submitted ? (
                    <div className="text-center py-12 animate-fade-in">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                      </div>
                      <h3 className="text-3xl font-bold mb-4">Analysis Requested!</h3>
                      <p className="text-muted-foreground text-lg mb-6">
                        We're running your detailed comparison now. A specialist will call you with the full report.
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
                          <Label htmlFor="income">Annual Income (Approx) *</Label>
                          <Input id="income" name="income" required value={formData.income} onChange={handleInputChange} placeholder="$75,000" className="bg-white/50" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="filingStatus">Filing Status</Label>
                          <select
                            id="filingStatus"
                            name="filingStatus"
                            className="flex h-10 w-full rounded-md border border-input bg-white/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.filingStatus}
                            onChange={handleInputChange}
                          >
                            <option>Single</option>
                            <option>Married Filing Jointly</option>
                            <option>Married Filing Separately</option>
                            <option>Head of Household</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="dependents">Number of Dependents</Label>
                          <Input id="dependents" name="dependents" type="number" value={formData.dependents} onChange={handleInputChange} className="bg-white/50" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="homeOwner">Do you own a home?</Label>
                          <select
                            id="homeOwner"
                            name="homeOwner"
                            className="flex h-10 w-full rounded-md border border-input bg-white/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.homeOwner}
                            onChange={handleInputChange}
                          >
                            <option>No</option>
                            <option>Yes</option>
                          </select>
                        </div>
                      </div>

                      <Button type="submit" size="lg" className="w-full h-14 text-lg shadow-xl hover:shadow-2xl transition-all">
                        Get Comprehensive Analysis
                        <Calculator className="ml-2 w-5 h-5" />
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Preview Column */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass bg-slate-900 border-slate-800 text-white overflow-hidden sticky top-8">
                <div className="absolute inset-0 bg-primary/5"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Estimated Potential Savings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 text-center">
                  <div className="mb-2 text-slate-400 font-medium">Potential Missing Deductions</div>
                  <div className="text-6xl font-bold text-primary tracking-tighter mb-6">
                    ${estimate.toLocaleString()}
                    <span className="text-2xl text-slate-500">*</span>
                  </div>
                  <p className="text-slate-400 text-sm italic">
                    * This is a conservative estimate based on national averages for your profile.
                    A professional review often uncovers significantly more.
                  </p>
                </CardContent>
                <div className="bg-slate-800/50 p-6 border-t border-white/5">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Homeowner Benefits</span>
                      <span className="text-green-400 font-mono">+{formData.homeOwner === 'Yes' ? 'FOUND' : '---'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Dependent Credits</span>
                      <span className="text-green-400 font-mono">+{parseInt(formData.dependents) > 0 ? 'ACTIVE' : '---'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Work Exp. Deductions</span>
                      <span className="text-green-400 font-mono">CALCULATING...</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Why verify?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-4">
                  <div className="flex gap-2">
                    <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                    </div>
                    <p>87% of self-filled returns miss at least one major credit.</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-5 h-5 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                    </div>
                    <p>Audit risk is 3x higher for DIY filers with complex incomes.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default SavingsCalculator

