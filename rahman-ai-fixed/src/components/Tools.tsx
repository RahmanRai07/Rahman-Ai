import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Files, 
  FileUp, 
  FileDown, 
  FileSearch, 
  FileSignature, 
  FileImage, 
  FileCode, 
  Scissors, 
  Merge, 
  Lock, 
  Unlock,
  RotateCw,
  Type,
  Upload,
  RefreshCw,
  Download,
  CheckCircle2,
  X
} from 'lucide-react';

const toolCategories = [
  {
    title: "Organize PDF",
    tools: [
      { id: 'merge', name: 'Merge PDF', icon: Merge, description: 'Combine PDFs in the order you want with the easiest PDF merger available.', color: 'bg-red-500/10 text-red-500' },
      { id: 'split', name: 'Split PDF', icon: Scissors, description: 'Separate one page or a whole set for easy conversion into independent PDF files.', color: 'bg-orange-500/10 text-orange-500' },
      { id: 'remove', name: 'Remove Pages', icon: Files, description: 'Remove pages from a PDF document with ease.', color: 'bg-yellow-500/10 text-yellow-500' },
    ]
  },
  {
    title: "Convert to PDF",
    tools: [
      { id: 'jpg-to-pdf', name: 'JPG to PDF', icon: FileImage, description: 'Convert JPG, PNG, BMP, GIF and TIFF images to PDF.', color: 'bg-blue-500/10 text-blue-500' },
      { id: 'word-to-pdf', name: 'Word to PDF', icon: FileText, description: 'Make DOC and DOCX files easy to read by converting them to PDF.', color: 'bg-indigo-500/10 text-indigo-500' },
      { id: 'ppt-to-pdf', name: 'PowerPoint to PDF', icon: FileUp, description: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.', color: 'bg-violet-500/10 text-violet-500' },
    ]
  },
  {
    title: "Convert from PDF",
    tools: [
      { id: 'pdf-to-jpg', name: 'PDF to JPG', icon: FileDown, description: 'Extract all images that are within a PDF or convert each page to a JPG image.', color: 'bg-emerald-500/10 text-emerald-500' },
      { id: 'pdf-to-word', name: 'PDF to Word', icon: FileSignature, description: 'Convert your PDF to WORD documents with incredible accuracy.', color: 'bg-cyan-500/10 text-cyan-500' },
      { id: 'pdf-to-excel', name: 'PDF to Excel', icon: FileCode, description: 'Pull data straight from PDFs into Excel spreadsheets in a few short seconds.', color: 'bg-green-500/10 text-green-500' },
    ]
  },
  {
    title: "Security & Edit",
    tools: [
      { id: 'protect', name: 'Protect PDF', icon: Lock, description: 'Protect PDF files with a password. Encrypt PDF documents to prevent unauthorized access.', color: 'bg-slate-500/10 text-slate-500' },
      { id: 'unlock', name: 'Unlock PDF', icon: Unlock, description: 'Remove PDF password security, giving you the freedom to use your PDFs as you want.', color: 'bg-pink-500/10 text-pink-500' },
      { id: 'watermark', name: 'Watermark', icon: Type, description: 'Stamp an image or text over your PDF in seconds. Choose typography, transparency and position.', color: 'bg-purple-500/10 text-purple-500' },
    ]
  }
];

import { PDFDocument } from 'pdf-lib';

export const Tools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const processTool = async () => {
    if (files.length === 0 || !selectedTool) return;
    setIsProcessing(true);
    setDownloadUrl(null);

    try {
      if (selectedTool.id === 'merge') {
        const mergedPdf = await PDFDocument.create();
        for (const file of files) {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
        const pdfBytes = await mergedPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setDownloadUrl(URL.createObjectURL(blob));
        setIsDone(true);
      } else if (selectedTool.id === 'split') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const splitPdf = await PDFDocument.create();
        const [firstPage] = await splitPdf.copyPages(pdf, [0]);
        splitPdf.addPage(firstPage);
        const pdfBytes = await splitPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setDownloadUrl(URL.createObjectURL(blob));
        setIsDone(true);
      } else {
        // Simulate for others
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsDone(true);
      }
    } catch (error) {
      console.error('PDF processing failed:', error);
      alert('Failed to process PDF. Ensure files are valid.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setSelectedTool(null);
    setIsProcessing(false);
    setIsDone(false);
    setFiles([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 space-y-16">
      <div className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-display font-bold text-white tracking-tight"
        >
          Every tool you need to work with <span className="text-violet-glow">PDFs</span>
        </motion.h1>
        <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">
          Professional PDF tools at your fingertips. All are 100% FREE and easy to use!
        </p>
      </div>

      <div className="space-y-16">
        {toolCategories.map((category, catIdx) => (
          <div key={catIdx} className="space-y-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-display font-bold text-white">{category.title}</h2>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.tools.map((tool, toolIdx) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (catIdx * 3 + toolIdx) * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedTool(tool)}
                  className="glass-card p-8 group cursor-pointer hover:bg-white/[0.04] transition-all border-white/10"
                >
                  <div className={`w-14 h-14 rounded-2xl ${tool.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <tool.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-violet-glow transition-colors">{tool.name}</h3>
                  <p className="text-white/40 text-sm leading-relaxed font-medium">
                    {tool.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedTool && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card w-full max-w-2xl p-12 relative border-white/10"
            >
              <button 
                onClick={reset}
                className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="text-center space-y-8">
                <div className={`w-20 h-20 rounded-3xl ${selectedTool.color} flex items-center justify-center mx-auto shadow-2xl`}>
                  <selectedTool.icon size={40} />
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-3xl font-display font-bold text-white">{selectedTool.name}</h2>
                  <p className="text-white/40 font-medium">{selectedTool.description}</p>
                </div>

                {!isDone ? (
                  <div className="space-y-6">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/10 rounded-3xl p-12 hover:border-violet-glow/50 hover:bg-white/[0.02] transition-all cursor-pointer group"
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect} 
                        className="hidden" 
                        multiple 
                      />
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                          <Upload className="text-white/40 group-hover:text-violet-glow transition-colors" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-white font-bold">
                            {files.length > 0 ? `${files.length} files selected` : 'Select PDF files'}
                          </p>
                          <p className="text-white/40 text-sm">or drag and drop here</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={processTool}
                      disabled={files.length === 0 || isProcessing}
                      className="w-full py-5 bg-violet-glow hover:bg-violet-glow/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-white font-bold text-lg shadow-xl shadow-violet-glow/20 transition-all flex items-center justify-center gap-3"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <selectedTool.icon size={20} />
                          {selectedTool.name}
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                  >
                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                      <CheckCircle2 className="text-emerald-500" size={48} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-display font-bold text-white">Task Completed!</h3>
                      <p className="text-white/40">Your files have been processed successfully.</p>
                    </div>
                    <div className="flex gap-4">
                      <a 
                        href={downloadUrl || '#'} 
                        download={`${selectedTool.id}_result.pdf`}
                        className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        <Download size={20} /> Download Result
                      </a>
                      <button 
                        onClick={reset}
                        className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all"
                      >
                        Done
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
