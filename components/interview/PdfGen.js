
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

const createDoc = (data) => {
    const doc = new jsPDF();
    const taxYear = new Date().getFullYear() - 1;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185);
    doc.text(`Tax Interview Summary ${taxYear}`, 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    // Personal Info Section
    autoTable(doc, {
        startY: 35,
        head: [['Personal Information', '']],
        body: [
            ['Full Name', `${data.firstName || ''} ${data.lastName || ''}`],
            ['SSN', data.ssn || ''],
            ['Address', data.address || ''],
            ['City, State, Zip', `${data.city || ''}, ${data.state || ''} ${data.zip || ''}`],
            ['Phone', data.phone || '']
        ],
        theme: 'grid',
        headStyles: { fillColor: [66, 133, 244] },
    });

    // Filing Status Section
    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Filing Status & Dependents', '']],
        body: [
            ['Status', data.filingStatus || ''],
            ['Dependents Count', data.dependents?.length || 0],
        ],
        theme: 'grid',
        headStyles: { fillColor: [66, 133, 244] },
    });

    // Dependents List
    if (data.dependents && data.dependents.length > 0) {
        const dependentRows = data.dependents.map(d => [d.name, d.ssn, d.relationship]);
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 5,
            head: [['Dependent Name', 'SSN', 'Relationship']],
            body: dependentRows,
            theme: 'striped',
            headStyles: { fillColor: [100, 100, 100] },
        });
    }

    // Income Section
    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Income Source', 'Amount']],
        body: [
            ['Wages, Salaries, Tips', `$${data.wages || '0'}`],
            ['Taxable Interest', `$${data.interest || '0'}`],
            ['Ordinary Dividends', `$${data.dividends || '0'}`],
            ['IRA Distributions', `$${data.iraDistributions || '0'}`],
            ['Unemployment Comp.', `$${data.unemployment || '0'}`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [52, 168, 83] }, // Green for income
    });

    // Footer disclaimer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('This document is a summary of provided information and not an official IRS form.', 14, doc.internal.pageSize.height - 10);
    }

    return doc;
};

export const generatePDF = (data) => {
    const doc = createDoc(data);
    doc.save('Tax_Interview_Summary.pdf');
};

export const getPdfBase64 = (data) => {
    const doc = createDoc(data);
    // output as data uri, remove prefix for raw base64
    const dataUri = doc.output('datauristring');
    return dataUri.split(',')[1];
};

const createCsvContent = (data) => {
    let csvContent = "";

    // Flatten data
    const rows = [
        ["Category", "Field", "Value"],
        ["Personal", "First Name", data.firstName],
        ["Personal", "Last Name", data.lastName],
        ["Personal", "SSN", data.ssn],
        ["Personal", "Address", data.address],
        ["Personal", "City", data.city],
        ["Personal", "State", data.state],
        ["Personal", "Zip", data.zip],
        ["Personal", "Phone", data.phone],
        ["Filing", "Status", data.filingStatus],
        ["Income", "Wages", data.wages],
        ["Income", "Interest", data.interest],
        ["Income", "Dividends", data.dividends],
        ["Income", "IRA Distributions", data.iraDistributions],
        ["Income", "Unemployment", data.unemployment],
    ];

    // Dependents
    if (data.dependents) {
        data.dependents.forEach((d, i) => {
            rows.push(["Dependent", `Dependent ${i + 1} Name`, d.name]);
            rows.push(["Dependent", `Dependent ${i + 1} SSN`, d.ssn]);
            rows.push(["Dependent", `Dependent ${i + 1} Rel`, d.relationship]);
        });
    }

    rows.forEach(rowArray => {
        let row = rowArray.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(",");
        csvContent += row + "\r\n";
    });
    return csvContent;
};

export const generateCSV = (data) => {
    const csvContent = "data:text/csv;charset=utf-8," + createCsvContent(data);
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tax_data_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const getCsvString = (data) => {
    return createCsvContent(data);
};
