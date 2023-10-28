import React, { useState } from 'react';
import { pdfjs, Document } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './Upload.css';
import logo from './logo.svg';
import { Outlet, Link } from "react-router-dom";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

let extractedTextGlobal = '';
const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    setFile(selectedFile ? selectedFile : null);
  };

  const onDocumentLoadSuccess = async (pdf: pdfjs.PdfDocument) => {
    let extractedText = '';
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const pageTextContent = await page.getTextContent();
      extractedText += pageTextContent.items.map(item => item.str).join(' ');
    }
    setText(extractedText);
    extractedTextGlobal = extractedText;
    localStorage.setItem('extractedText', extractedText); 
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-logo">
        <img src={logo} className="App-logo" alt="logo" />
        </div>
        <div>
          <h1>Welcome to </h1> 
          <h2>ChickyAI</h2>
          <p>Translating medical jargon to everyday language, one report at a time.</p>
        </div>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        {file && (
          <Document
            file={URL.createObjectURL(file)}
            onLoadSuccess={onDocumentLoadSuccess}
          />
        )}
        {text && (
          <div>
            <Link to={`/chat`}><h4>Click to talk with your medical report!</h4></Link>
          </div>
        )}
      </header>
    </div>
  );
};

export default Upload;
  