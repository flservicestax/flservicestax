
import React from 'react';
import { generatePDF, generateCSV } from './PdfGen';
import { FileDown, Download } from 'lucide-react';

const StepReview = ({ data }) => {
    return (
        <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Review & Download</h3>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-medium text-blue-900 mb-4">Summary of your entry</h4>

                <div className="space-y-4 text-sm text-gray-700">
                    <div className="grid grid-cols-2 border-b border-blue-200 pb-2">
                        <span className="font-semibold">Name:</span>
                        <span>{data.firstName} {data.lastName}</span>
                    </div>
                    <div className="grid grid-cols-2 border-b border-blue-200 pb-2">
                        <span className="font-semibold">Filing Status:</span>
                        <span>{data.filingStatus}</span>
                    </div>
                    <div className="grid grid-cols-2 border-b border-blue-200 pb-2">
                        <span className="font-semibold">Total Income Reporting:</span>
                        <span>
                            ${(parseInt(data.wages || 0) + parseInt(data.interest || 0) + parseInt(data.dividends || 0) + parseInt(data.iraDistributions || 0) + parseInt(data.unemployment || 0)).toLocaleString()}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 pb-2">
                        <span className="font-semibold">Dependents:</span>
                        <span>{data.dependents?.length || 0}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-gray-600">
                    Your data is ready to be processed. You can download a PDF summary for your records or a CSV file to import into other software.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => generatePDF(data)}
                        className="flex-1 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 shadow-sm transition-all"
                    >
                        <FileDown className="w-5 h-5 mr-2" />
                        Download PDF Summary
                    </button>

                    <button
                        onClick={() => generateCSV(data)}
                        className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all"
                    >
                        <Download className="w-5 h-5 mr-2" />
                        Export as CSV
                    </button>
                </div>

                <div className="text-xs text-center text-gray-400 mt-4">
                    <p>Data is processed locally in your browser. No information is stored on our servers.</p>
                </div>
            </div>
        </div>
    );
};

export default StepReview;
