import React, { useState } from 'react';
import { Upload, FileText, Loader2, BarChart2, Briefcase, Boxes } from 'lucide-react';

const UploadView = ({ onAnalyze, isAnalyzing }) => {
    const [key, setKey] = useState("");
    const [file, setFile] = useState(null);
    const [role, setRole] = useState("");
    const [desc, setDesc] = useState("");

    return (
        <div className="page-upload">
            <div className="upload-card">
                <div className="upload-title">
                    <h2><Boxes style={{ display: 'inline', marginBottom: -4, color: 'var(--primary)' }} /> Resume AI Analyst</h2>
                    <p>Structure-aware editing & analysis for modern resumes.</p>
                </div>

                <div className="drop-zone" onClick={() => document.getElementById('f-up').click()}>
                    <Upload size={40} style={{ marginBottom: 10, opacity: 0.5 }} />
                    {file ? (
                        <div className="file-name"><FileText size={18} /> {file.name}</div>
                    ) : (
                        <p>Click to select DOCX Resume</p>
                    )}
                    <input id="f-up" type="file" hidden accept=".docx" onChange={e => setFile(e.target.files[0])} />
                </div>

                <div className="form-group">
                    <label className="form-label">Gemini API Key</label>
                    <input type="password" className="form-input" placeholder="Required" value={key} onChange={e => setKey(e.target.value)} />
                </div>

                <div style={{ borderTop: '1px solid var(--border)', margin: '20px 0' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)', fontWeight: 600, marginBottom: 15 }}>
                    <Briefcase size={18} /> Target Job (Optional)
                </div>

                <div className="form-group">
                    <label className="form-label">Job Role</label>
                    <input className="form-input" placeholder="e.g. Product Manager" value={role} onChange={e => setRole(e.target.value)} />
                </div>

                <div className="form-group">
                    <label className="form-label">Job Description</label>
                    <textarea className="form-input form-textarea" placeholder="Paste JD here for match score..." value={desc} onChange={e => setDesc(e.target.value)} />
                </div>

                <button
                    className="btn btn-primary btn-large"
                    onClick={() => {
                        if (!key || !file) return alert("API Key and File are required.");
                        onAnalyze(key, file, role, desc);
                    }}
                    disabled={isAnalyzing}
                >
                    {isAnalyzing ? <Loader2 className="animate-spin" /> : <BarChart2 size={20} />}
                    {isAnalyzing ? "Analyzing..." : "Start Analysis"}
                </button>
            </div>
        </div>
    );
};

export default UploadView;
