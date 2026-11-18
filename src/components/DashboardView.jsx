import React, { useState } from 'react';
import { RefreshCw, Info, Check } from 'lucide-react';

const DashboardView = ({ docBlocks, analysis, previewRef, onUpdateText, onAcceptFix, onRefresh, onPreviewClick }) => {
    const [tab, setTab] = useState('scores');

    return (
        <div className="page-dashboard">
            {/* Left: Analysis/Editor */}
            <div className="panel-left">
                <div className="panel-tabs">
                    <button className={`tab-btn ${tab === 'scores' ? 'active' : ''}`} onClick={() => setTab('scores')}>Scores</button>
                    {analysis?.jobMatch && <button className={`tab-btn ${tab === 'job' ? 'active' : ''}`} onClick={() => setTab('job')}>Job Match</button>}
                    <button className={`tab-btn ${tab === 'editor' ? 'active' : ''}`} onClick={() => setTab('editor')}>Editor</button>
                </div>

                <div className="panel-content">
                    {/* SCORES TAB */}
                    {tab === 'scores' && analysis && (
                        <div className="scores-view">
                            <div className="score-hero">
                                <div className="score-hero-val">{analysis.overallScore}</div>
                                <div className="score-hero-label">Overall Score</div>
                            </div>

                            <div className="metrics-grid">
                                {Object.entries(analysis.metrics).map(([k, v]) => (
                                    <div key={k} className="metric-card" onClick={() => window.Swal.fire({ title: k.toUpperCase(), text: analysis.feedback[k], background: '#1e293b', color: '#fff', confirmButtonColor: '#8b5cf6' })}>
                                        <div className="metric-title">{k} <Info size={12} /></div>
                                        <div className="metric-val">{v}</div>
                                    </div>
                                ))}
                            </div>

                            <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, margin: '20px 0', borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>Suggestions</h4>

                            {analysis.suggestions.map((s, i) => (
                                <div key={i} className="suggestion-card">
                                    <span className="text-original">{s.originalText}</span>
                                    <span className="text-changed">{s.changedText}</span>
                                    <div className="reason">{s.reason}</div>
                                    <button className="btn btn-success" style={{ width: '100%', marginTop: 10, justifyContent: 'center' }} onClick={() => onAcceptFix(s)}>
                                        <Check size={16} /> Accept Change
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* JOB TAB */}
                    {tab === 'job' && analysis?.jobMatch && (
                        <div className="scores-view">
                            <div className="score-hero">
                                <div className="score-hero-val">{analysis.jobMatch.score}%</div>
                                <div className="score-hero-label">Match Score</div>
                            </div>
                            <p style={{ lineHeight: 1.6, color: 'var(--text-main)', marginBottom: 20 }}>{analysis.jobMatch.reason}</p>

                            <div className="form-label" style={{ color: 'var(--danger)' }}>Missing Keywords</div>
                            <div className="pill-wrap" style={{ marginBottom: 20 }}>
                                {analysis.jobMatch.missingKeywords.map((k, i) => <span key={i} className="pill red">{k}</span>)}
                            </div>

                            <div className="form-label" style={{ color: 'var(--success)' }}>Matching Keywords</div>
                            <div className="pill-wrap">
                                {analysis.jobMatch.matchingKeywords.map((k, i) => <span key={i} className="pill green">{k}</span>)}
                            </div>
                        </div>
                    )}

                    {/* EDITOR TAB */}
                    {tab === 'editor' && (
                        <div className="editor-view">
                            {docBlocks.map((b, bi) => (
                                <div key={b.block_id} className="doc-para">
                                    {b.segments.map((s, si) => (
                                        <span
                                            key={s.globalId}
                                            className={`doc-seg ${s.value !== s.originalValue ? 'mod' : ''}`}
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => {
                                                if (e.target.innerText !== s.value) onUpdateText(bi, si, e.target.innerText);
                                            }}
                                        >{s.value}</span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Preview */}
            <div className="panel-right">
                <div className="preview-toolbar">
                    <button className="btn btn-secondary" onClick={onRefresh} style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: 'white', border: 'none' }}>
                        <RefreshCw size={14} /> Refresh
                    </button>
                </div>
                <div className="preview-area" onClick={onPreviewClick}>
                    <div ref={previewRef} className="docx-wrapper" />
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
