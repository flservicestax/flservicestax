import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import FreeReview from './pages/FreeReview.jsx'
import PdfGuide from './pages/PdfGuide.jsx'
import SavingsCalculator from './pages/SavingsCalculator.jsx'
import BookSession from './pages/BookSession.jsx'
import MiamiTaxServices from './pages/MiamiTaxServices.jsx'
import TampaTaxServices from './pages/TampaTaxServices.jsx'
import OrlandoTaxServices from './pages/OrlandoTaxServices.jsx'
import FloridaSalesTaxGuide from './pages/FloridaSalesTaxGuide.jsx'
import Team from './pages/Team.jsx'
import InterviewPage from './pages/InterviewPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/free-review" element={<FreeReview />} />
        <Route path="/pdf-guide" element={<PdfGuide />} />
        <Route path="/savings-calculator" element={<SavingsCalculator />} />
        <Route path="/book-session" element={<BookSession />} />
        <Route path="/miami-tax-services" element={<MiamiTaxServices />} />
        <Route path="/tampa-tax-services" element={<TampaTaxServices />} />
        <Route path="/orlando-tax-services" element={<OrlandoTaxServices />} />
        <Route path="/florida-sales-tax-guide" element={<FloridaSalesTaxGuide />} />
        <Route path="/team" element={<Team />} />
        <Route path="/interview" element={<InterviewPage />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
