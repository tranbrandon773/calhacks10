import React, { useState } from 'react';
import { pdfjs, Document } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './Upload.css';
import logo from './logo.svg';
import { Link } from "react-router-dom";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
import { api } from "../convex/_generated/api";
import { useAction } from "convex/react";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string | null>(null);
  const createSeedMessage = useAction(api.init.createSeedMessage);
  
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
    createSeedMessage({ extractedText })
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
        {text ? (
          <Link to="/chat" className="file-upload" style={{ backgroundColor: '#27c261', color: 'white', textDecoration: 'none', fontWeight: 800 }}>
            Get started
          </Link>
        ) : (
          <label htmlFor="fileInput" className="file-upload">
            Upload report
            <input 
                type="file" 
                id="fileInput" 
                accept=".pdf" 
                onChange={handleFileChange}
                className="file-input"
            />
          </label>
        )}
        {file && (
            <Document
                file={URL.createObjectURL(file)}
                onLoadSuccess={onDocumentLoadSuccess}
            />
        )}
      </header>
    </div>
  );
};

export default Upload;
