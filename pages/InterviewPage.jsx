
import React from 'react';
import InterviewWizard from '../components/interview/InterviewWizard';

const InterviewPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Interactive Tax Assistant</h1>
                    <p className="text-xl text-gray-600">
                        Answer a few simple questions to generate your tax summary.
                        <br className="hidden md:inline" />
                        Secure, private, and runs entirely in your browser.
                    </p>
                </div>

                <InterviewWizard />

                <div className="max-w-4xl mx-auto mt-12 text-center text-sm text-gray-500 pb-10">
                    <p>
                        Disclaimer: This tool is for informational and organizational purposes only.
                        It does not constitute professional tax advice or an official IRS filing.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InterviewPage;
