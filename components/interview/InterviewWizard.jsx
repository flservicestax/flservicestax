import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Save, FileText, Loader2 } from 'lucide-react';
import StepPersonalDetails from './StepPersonalDetails';
import StepFilingStatus from './StepFilingStatus';
import StepIncome from './StepIncome';
import StepReview from './StepReview';
import { getPdfBase64, getCsvString } from './PdfGen';
import { submitToGoogleSheets } from '../../lib/formSubmission';

const steps = [
    { id: 1, title: 'Personal Details', component: StepPersonalDetails },
    { id: 2, title: 'Filing Status', component: StepFilingStatus },
    { id: 3, title: 'Income', component: StepIncome },
    { id: 4, title: 'Review & Download', component: StepReview },
];

const InterviewWizard = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '', // Ensure email is in initial state
        phone: '',
        ssn: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        filingStatus: 'single', // default
        dependents: [],
        wages: '',
        interest: '',
        dividends: '',
        iraDistributions: '',
        unemployment: '',
    });

    const handleFinish = async () => {
        setIsSubmitting(true);
        try {
            // Generate Files
            const pdfBase64 = getPdfBase64(formData);
            const csvContent = getCsvString(formData);
            const csvBase64 = window.btoa(unescape(encodeURIComponent(csvContent)));

            const submissionData = {
                ...formData,
                files: [
                    {
                        name: `Tax_Interview_${formData.firstName}_${formData.lastName}.pdf`,
                        type: 'application/pdf',
                        content: pdfBase64
                    },
                    {
                        name: `Tax_Data_${formData.firstName}_${formData.lastName}.csv`,
                        type: 'text/csv',
                        content: csvBase64
                    }
                ]
            };

            await submitToGoogleSheets(submissionData, 'selfInterview');
            alert('Success! Your interview data has been submitted securely.');
            // Optional: You could navigate away or reset here
        } catch (error) {
            console.error('Submission failed:', error);
            alert('There was an error submitting your data. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleFinish();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const CurrentStepComponent = steps.find(s => s.id === currentStep)?.component || StepPersonalDetails;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg my-10 border border-gray-100">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Tax Interview Mode</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Step {currentStep} of {steps.length}</span>
                    <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${(currentStep / steps.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="mb-8 min-h-[400px]">
                <CurrentStepComponent
                    data={formData}
                    onChange={handleChange}
                />
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 1 || isSubmitting}
                    className={`flex items-center px-6 py-2 rounded-lg text-sm font-medium transition-colors
            ${currentStep === 1 || isSubmitting
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                </button>

                <button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            {currentStep === steps.length ? 'Finish' : 'Next'}
                            {currentStep !== steps.length && <ChevronRight className="w-4 h-4 ml-2" />}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default InterviewWizard;
