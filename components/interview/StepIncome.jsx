
import React from 'react';

const StepIncome = ({ data, onChange }) => {
    return (
        <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Income Information</h3>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                    Please enter amounts from your W-2, 1099, or other income statements. Round to the nearest dollar.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wages, Salaries, Tips (Form W-2, Box 1)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                            type="number"
                            value={data.wages || ''}
                            onChange={(e) => onChange('wages', e.target.value)}
                            className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Taxable Interest (Form 1099-INT)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                            type="number"
                            value={data.interest || ''}
                            onChange={(e) => onChange('interest', e.target.value)}
                            className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ordinary Dividends (Form 1099-DIV)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                            type="number"
                            value={data.dividends || ''}
                            onChange={(e) => onChange('dividends', e.target.value)}
                            className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IRA Distributions (Taxable Amount)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                            type="number"
                            value={data.iraDistributions || ''}
                            onChange={(e) => onChange('iraDistributions', e.target.value)}
                            className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="0.00"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unemployment Compensation</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                            type="number"
                            value={data.unemployment || ''}
                            onChange={(e) => onChange('unemployment', e.target.value)}
                            className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="0.00"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepIncome;
