"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function RoastForm() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roastStream, setRoastStream] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (roastStream && resultsRef.current) {
      // scroll to bottom of the results while streaming
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [roastStream]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const clearFile = () => setFile(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobDescription.trim()) return;
    
    setIsLoading(true);
    setRoastStream("");
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to roast resume');
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          
          // Raw text streaming
          setRoastStream(prev => prev + chunk);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred while roasting.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <form onSubmit={onSubmit} className="space-y-8">
        
        {/* Step 1: Upload Resume */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-zinc-300 block">
            1. Upload Resume (PDF only)
          </label>
          
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer flex flex-col items-center justify-center space-y-3 relative overflow-hidden group
                ${isDragging ? "border-rose-500 bg-rose-500/5" : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50"}
              `}
            >
              <input 
                type="file" 
                accept=".pdf" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <div className="p-3 bg-zinc-800 rounded-full group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-zinc-400" />
              </div>
              <div className="text-sm text-zinc-400">
                <span className="font-medium text-zinc-200">Click to upload</span> or drag and drop
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl">
              <div className="flex items-center space-x-3 overflow-hidden">
                <FileText className="w-8 h-8 text-rose-500 shrink-0" />
                <div className="truncate">
                  <p className="text-sm font-medium text-zinc-200 truncate">{file.name}</p>
                  <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={clearFile}
                className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-zinc-700/50 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Job Description */}
        <div className="space-y-3">
          <label htmlFor="jd" className="text-sm font-semibold text-zinc-300 block">
            2. Paste Job Description (Mandatory)
          </label>
          <textarea
            id="jd"
            rows={6}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={isLoading}
            placeholder="Paste the requirements, responsibilities, and about us section here..."
            className="w-full bg-zinc-950 border border-zinc-700 rounded-2xl p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all resize-y"
          />
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex flex-row items-start space-x-3 text-red-500 whitespace-pre-wrap">
             <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
             <span className="text-sm">{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || !jobDescription.trim() || isLoading}
          className="w-full flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 px-6 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] active:scale-[0.98]"
        >
          {isLoading ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <span>Roast My Resume 🔥</span>
          )}
        </button>

      </form>

      {/* Results Section */}
      {(roastStream || isLoading) && (
         <div ref={resultsRef} className="pt-8 border-t border-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="p-6 md:p-8 bg-zinc-950/50 border border-zinc-800 rounded-2xl prose prose-invert prose-rose max-w-none">
             {roastStream ? (
               <ReactMarkdown>{roastStream}</ReactMarkdown>
             ) : (
               <div className="flex flex-col items-center justify-center space-y-4 py-8 text-zinc-500">
                  <div className="w-8 h-8 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
                  <p className="animate-pulse">Reading between the lines...</p>
               </div>
             )}
           </div>
         </div>
      )}
    </div>
  );
}
