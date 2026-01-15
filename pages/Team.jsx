import { useState } from 'react'
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { CheckCircle2, ArrowLeft, Users, Award, GraduationCap, Briefcase, Star, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Team() {
  const navigate = useNavigate()

  const teamMembers = [
    {
      name: "Cristian Vergara",
      title: "Tax Pro & Founder",
      credentials: "Tax Specialist, Authorized IRS e-file Provider",
      bio: "As the founder of Tax Pro FL in Orlando, Cristian Vergara provides expert tax solutions tailored to the Central Florida community. With a deep understanding of federal and state tax regulations, he has dedicated his career to helping individuals and small businesses navigate the complexities of the tax code. Cristian focuses on maximizing refunds and minimizing liabilities through strategic planning and meticulous preparation.",
      expertise: ["Individual Tax Returns", "Small Business Accounting", "Orlando Local Tax", "Tax Planning", "IRS Compliance", "Spanish-Speaking Services"],
      image: "/api/placeholder/150/150",
      featured: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 via-purple-800 to-slate-900 text-white py-6">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 mb-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to taxprofl.com
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-purple-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Meet Orlando's Trusted Tax Pro
            </h1>
            <p className="text-xl md:text-2xl text-purple-600 mb-4">
              Professional Expertise Dedicated to Your Financial Success
            </p>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Led by Cristian Vergara, our team brings local Orlando expertise and personalized care to every tax return. We stay current with the latest IRS updates to provide you with reliable, year-round guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              {teamMembers.filter(member => member.featured).map((member, index) => (
                <Card key={`featured-${index}`} className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-blue-50">
                  <CardHeader className="text-center pb-6">
                    <div className="relative">
                      <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
                        <Users className="w-16 h-16 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        FOUNDER
                      </div>
                    </div>
                    <CardTitle className="text-2xl mb-2">{member.name}</CardTitle>
                    <p className="text-purple-600 font-medium text-lg mb-2">{member.title}</p>
                    <p className="text-slate-500 text-base mb-4 font-medium">{member.credentials}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 mb-6 text-lg leading-relaxed">{member.bio}</p>

                    <div className="mb-6">
                      <h4 className="font-semibold mb-3 flex items-center text-lg">
                        <Award className="w-5 h-5 mr-2 text-purple-600" />
                        Specialized Expertise:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span className="flex items-center">
                          <Shield className="w-4 h-4 mr-1 text-green-600" />
                          Orlando Authorized E-File Provider
                        </span>
                        <span className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          Local Top Rated
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-100 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              Professional Standards
            </h2>
            <p className="text-xl text-slate-600">
              Tax Pro FL maintains the highest levels of integrity and accuracy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Certified Tax Experts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Focused on precise preparation to ensure you receive every credit and deduction you deserve.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">Small Business Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Helping Orlando entrepreneurs manage their bookkeeping and business tax obligations efficiently.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Secure & Confidential</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Utilizing bank-level encryption to protect your sensitive financial documents and identity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Need Help with Your Taxes in Orlando?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Work with Cristian Vergara for a stress-free tax season.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-purple-500 hover:bg-purple-600 text-white text-lg px-8 py-6"
                onClick={() => navigate('/book-session')}
              >
                Book Your Session
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-900 text-lg px-8 py-6"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 mb-4 text-sm md:text-base italic">
            <strong>Disclaimer:</strong> Content provided on taxprofl.com is for informational purposes and not professional legal or tax advice. Cristian Vergara is a tax professional; please schedule a consultation for specific advice related to your finances.
          </p>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} FL Tax Services. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Team

