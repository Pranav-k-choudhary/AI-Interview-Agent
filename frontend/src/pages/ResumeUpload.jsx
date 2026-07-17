import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import API from '../services/api';
import { UploadCloud, FileText, CheckCircle2, ShieldAlert, Brain, Sparkles, FolderGit2, GraduationCap, Briefcase } from 'lucide-react';

export const ResumeUpload = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resumeData, setResumeData] = useState(null);

  // Load existing resume if it exists
  useEffect(() => {
    const fetchExistingResume = async () => {
      try {
        const { data } = await API.get('/resume');
        setResumeData(data);
      } catch (err) {
        // No resume found, keep state null
      }
    };
    fetchExistingResume();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setErrorMsg('');
      } else {
        setErrorMsg('Only PDF files are supported.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setErrorMsg('');
      } else {
        setErrorMsg('Only PDF files are supported.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select a file to upload.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const { data } = await API.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResumeData(data.data);
      setFile(null);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to process resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Resume Analyzer</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload your resume PDF. Gemini AI will extract key details to optimize your interview experience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-4">Upload New Resume</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                  dragActive
                    ? 'border-primary-500 bg-primary-50/10'
                    : 'border-slate-200 dark:border-dark-700 hover:border-slate-300 dark:hover:border-dark-600'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-picker').click()}
              >
                <input
                  type="file"
                  id="file-picker"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <UploadCloud size={36} className="text-slate-400 dark:text-slate-500 mb-3" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Drag & Drop PDF or Browse
                </p>
                <p className="text-[10px] text-slate-400">PDF up to 5MB</p>
              </div>

              {file && (
                <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-100 dark:border-dark-700 bg-slate-50/50 dark:bg-dark-850">
                  <FileText size={18} className="text-primary-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate flex-1">
                    {file.name}
                  </span>
                </div>
              )}

              {errorMsg && (
                <div className="flex items-start gap-2 p-3 rounded-lg border border-red-200 dark:border-red-950/40 bg-red-50 dark:bg-red-950/10 text-red-500 text-xs leading-relaxed">
                  <ShieldAlert size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !file}
                className="w-full py-3 rounded-xl text-sm font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/10 disabled:opacity-40 transition-colors"
              >
                {loading ? 'Processing File...' : 'Upload & Analyze'}
              </button>
            </form>
          </div>

          {loading && (
            <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center py-8">
              <div className="relative w-12 h-12 mb-4">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-100 rounded-full animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-primary-600 rounded-full animate-spin"></div>
              </div>
              <h4 className="text-sm font-bold flex items-center gap-1.5 justify-center">
                <Brain size={16} className="text-primary-500 animate-bounce" />
                Gemini Extracting Profile...
              </h4>
              <p className="text-[11px] text-slate-400 mt-2">
                This will take 5-10 seconds to read the PDF and categorize skills and projects.
              </p>
            </div>
          )}
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2 space-y-6">
          {resumeData ? (
            <div className="space-y-6">
              {/* Extract Summary Header */}
              <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 border-l-4 border-l-green-500">
                <CheckCircle2 size={32} className="text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-extrabold text-lg">Resume Analyzed Successfully</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Structured details saved. These skills are automatically added to your profile context.
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-slate-350">
                  <Sparkles size={16} className="text-primary-500" />
                  Extracted Tech Stack
                </h4>
                <div className="space-y-3">
                  {resumeData.programmingLanguages?.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-slate-400">Languages:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {resumeData.programmingLanguages.map((lang) => (
                          <span key={lang} className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-dark-800 font-medium">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {resumeData.frameworks?.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs font-semibold text-slate-400">Frameworks / Libraries:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {resumeData.frameworks.map((fw) => (
                          <span key={fw} className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-dark-800 font-medium">
                            {fw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {resumeData.skills?.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs font-semibold text-slate-400">Core Concepts / Tools:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {resumeData.skills.map((skill) => (
                          <span key={skill} className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-dark-800 font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Projects */}
              {resumeData.projects?.length > 0 && (
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-slate-350">
                    <FolderGit2 size={16} className="text-primary-500" />
                    Key Projects (AI-Extracted)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resumeData.projects.map((proj, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-dark-750 bg-slate-50/50 dark:bg-dark-850/30">
                        <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200">{proj.name}</h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {proj.description}
                        </p>
                        {proj.technologies?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {proj.technologies.map((tech) => (
                              <span key={tech} className="text-[10px] px-2 py-0.5 rounded-md bg-primary-500/10 text-primary-500 dark:text-primary-400 font-medium">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience and Education */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Experience */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-slate-350">
                    <Briefcase size={16} className="text-primary-500" />
                    Experience History
                  </h4>
                  <div className="space-y-4">
                    {resumeData.experience?.length > 0 ? (
                      resumeData.experience.map((exp, idx) => (
                        <div key={idx} className="border-l-2 border-slate-200 dark:border-dark-750 pl-3">
                          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">{exp.role}</h5>
                          <p className="text-[11px] text-slate-400 mt-0.5">{exp.company} | {exp.duration}</p>
                          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{exp.description}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No professional experience extracted.</p>
                    )}
                  </div>
                </div>

                {/* Education */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-700 dark:text-slate-350">
                    <GraduationCap size={16} className="text-primary-500" />
                    Education
                  </h4>
                  <div className="space-y-4">
                    {resumeData.education?.length > 0 ? (
                      resumeData.education.map((edu, idx) => (
                        <div key={idx} className="border-l-2 border-slate-200 dark:border-dark-750 pl-3">
                          <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">{edu.degree}</h5>
                          <p className="text-[11px] text-slate-400 mt-0.5">{edu.institution}</p>
                          <p className="text-xs text-slate-500 mt-1.5 font-semibold">Class of {edu.year}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No academic history extracted.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center">
              <FileText size={48} className="text-slate-300 dark:text-slate-700 mb-4 animate-bounce" style={{ animationDuration: '3s' }} />
              <h3 className="font-extrabold text-xl">No Resume Uploaded Yet</h3>
              <p className="text-sm text-slate-400 mt-2 max-w-md">
                Upload your resume so the AI interviewer can generate personalized questions based on your projects, frameworks, and academic profile.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
