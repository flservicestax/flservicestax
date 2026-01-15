
import React from 'react';

const filingStatuses = [
    { id: 'single', label: 'Single', description: 'Unmarried or legally separated' },
    { id: 'married_joint', label: 'Married Filing Jointly', description: 'Married couples filing a combined return' },
    { id: 'married_separate', label: 'Married Filing Separately', description: 'Married couples filing separate returns' },
    { id: 'head_household', label: 'Head of Household', description: 'Unmarried paying more than half of home costs' },
    { id: 'widower', label: 'Qualifying Surviving Spouse', description: 'Widow/widower with dependent child' },
];

const StepFilingStatus = ({ data, onChange }) => {
    return (
        <div className="space-y-8 animate-fadeIn">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Filing Status & Dependents</h3>

            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Filing Status</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filingStatuses.map((status) => (
                        <div
                            key={status.id}
                            className={`relative p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md ${data.filingStatus === status.id
                                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                    : 'border-gray-200 hover:border-blue-300'
                                }`}
                            onClick={() => onChange('filingStatus', status.id)}
                        >
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        type="radio"
                                        name="filingStatus"
                                        value={status.id}
                                        checked={data.filingStatus === status.id}
                                        onChange={() => onChange('filingStatus', status.id)}
                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label className="font-medium text-gray-900 block pointer-events-none">
                                        {status.label}
                                    </label>
                                    <p className="text-gray-500 pointer-events-none">{status.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">Dependents</label>
                    <button
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        onClick={() => {
                            const newDependents = [...(data.dependents || []), { name: '', ssn: '', relationship: '' }];
                            onChange('dependents', newDependents);
                        }}
                    >
                        + Add Dependent
                    </button>
                </div>

                {(!data.dependents || data.dependents.length === 0) && (
                    <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg text-gray-400">
                        No dependents added.
                    </div>
                )}

                {data.dependents?.map((dependent, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative group">
                        <button
                            onClick={() => {
                                const newDependents = data.dependents.filter((_, i) => i !== index);
                                onChange('dependents', newDependents);
                            }}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            &times;
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={dependent.name}
                                    onChange={(e) => {
                                        const newDependents = [...data.dependents];
                                        newDependents[index].name = e.target.value;
                                        onChange('dependents', newDependents);
                                    }}
                                    className="w-full px-3 py-1.5 rounded border border-gray-300 text-sm"
                                    placeholder="Child's Name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">SSN</label>
                                <input
                                    type="text"
                                    value={dependent.ssn}
                                    onChange={(e) => {
                                        const newDependents = [...data.dependents];
                                        newDependents[index].ssn = e.target.value;
                                        onChange('dependents', newDependents);
                                    }}
                                    className="w-full px-3 py-1.5 rounded border border-gray-300 text-sm"
                                    placeholder="XXX-XX-XXXX"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Relationship</label>
                                <input
                                    type="text"
                                    value={dependent.relationship}
                                    onChange={(e) => {
                                        const newDependents = [...data.dependents];
                                        newDependents[index].relationship = e.target.value;
                                        onChange('dependents', newDependents);
                                    }}
                                    className="w-full px-3 py-1.5 rounded border border-gray-300 text-sm"
                                    placeholder="Son/Daughter"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StepFilingStatus;
