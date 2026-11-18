import React, { useState, useEffect, useRef } from 'react';
import { Download, Boxes } from 'lucide-react';
import useExternalScript from './hooks/useExternalScript';
import AppStyles from './components/AppStyles';
import api from './services/api';
import UploadView from './components/UploadView';
import DashboardView from './components/DashboardView';

export default function App() {
    const [view, setView] = useState('upload');
    const [loading, setLoading] = useState(false);

    // Data
    const [apiKey, setApiKey] = useState("");
    const [xml, setXml] = useState("");
    const [blocks, setBlocks] = useState([]);
    const [buffer, setBuffer] = useState(null);
    const [analysis, setAnalysis] = useState(null);

    const zipRef = useRef(null);
    const previewRef = useRef(null);

    const loadScriptOnce = (src, { forceReload = false } = {}) => new Promise((resolve, reject) => {
        if (!src) return resolve();
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing && !forceReload) {
            // if script already present, wait for load if not finished
            if (existing.getAttribute('data-loaded') === 'true') return resolve();
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', () => reject(new Error('Failed to load ' + src)));
            return;
        }
        // if forcing reload and existing script exists, remove it so browser reloads
        if (existing && forceReload) {
            existing.remove();
            try { // also attempt to clear global if library attached to window
                const name = src.includes('jszip') ? 'JSZip' : (src.includes('docx-preview') ? 'docx' : null);
                if (name && window[name]) delete window[name];
            } catch (e) { /* ignore */ }
        }
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = () => { s.setAttribute('data-loaded', 'true'); resolve(); };
        s.onerror = () => reject(new Error('Failed to load ' + src));
        document.body.appendChild(s);
    });
    // ...existing code...

    const ensureExternalLibs = async () => {
        const jszipUrl = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        const docxUrl = "https://cdn.jsdelivr.net/npm/docx-preview@0.3.2/dist/docx-preview.js";

        // Always ensure JSZip is present first
        if (!window.JSZip) {
            await loadScriptOnce(jszipUrl);
        }

        // If docx exists but JSZip was missing when it was loaded, reload docx so it picks up JSZip
        if (window.docx && !window.JSZip) {
            // remove script tag if present and clear global
            const existingDocx = document.querySelector(`script[src="${docxUrl}"]`);
            if (existingDocx) existingDocx.remove();
            try { delete window.docx; } catch (e) { }
            // now load JSZip then docx
            await loadScriptOnce(jszipUrl);
            await loadScriptOnce(docxUrl);
            return;
        }

        // Normal path: ensure docx is loaded (after JSZip)
        if (!window.docx) {
            await loadScriptOnce(docxUrl);
        }
    };

    useExternalScript('https://cdn.jsdelivr.net/npm/sweetalert2@11', 'https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css');

    useEffect(() => {
        const load = (s) => new Promise(r => {
            if (document.querySelector(`script[src="${s}"]`)) return r();
            const el = document.createElement('script'); el.src = s; el.onload = r; document.body.appendChild(el);
        });
        load("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js")
            .then(() => load("https://cdn.jsdelivr.net/npm/docx-preview@0.3.2/dist/docx-preview.js"));
    }, []);

    useEffect(() => {
        if (view === 'dashboard' && buffer && previewRef.current && window.docx) {
            previewRef.current.innerHTML = '';
            window.docx.renderAsync(buffer, previewRef.current, null, { inWrapper: true, breakPages: true });
        }
    }, [view, buffer]);

    const handleAnalyze = async (key, file, role, desc) => {
        setApiKey(key);
        setLoading(true);
        try {
            await ensureExternalLibs();
            const buf = await file.arrayBuffer();
            const zip = await window.JSZip.loadAsync(buf);
            zipRef.current = zip;
            const xmlStr = await zip.file("word/document.xml").async("string");
            setXml(xmlStr);

            const parser = new DOMParser();
            const doc = parser.parseFromString(xmlStr, "text/xml");
            const paras = doc.getElementsByTagName("w:p");
            const parsedBlocks = [];
            let gid = 0;
            for (let i = 0; i < paras.length; i++) {
                const segs = [];
                const runs = paras[i].getElementsByTagName("w:t");
                for (let j = 0; j < runs.length; j++) segs.push({ localId: j, globalId: gid++, value: runs[j].textContent, originalValue: runs[j].textContent });
                parsedBlocks.push({ block_id: `p${i}`, role: 'body', segments: segs });
            }
            setBlocks(parsedBlocks);
            setBuffer(buf);

            const res = await api.analyze(key, parsedBlocks, role, desc);
            setAnalysis(res);
            setView('dashboard');
        } catch (e) { alert("Error: " + e.message); }
        finally { setLoading(false); }
    };

    const updateDoc = async (newBlocks, isDownload = false) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "text/xml");
        const runs = doc.getElementsByTagName("w:t");

        newBlocks.forEach(b => b.segments.forEach(s => {
            if (runs[s.globalId]) {
                runs[s.globalId].textContent = s.value;
                const rNode = runs[s.globalId].parentNode;
                if (rNode && rNode.nodeName === 'w:r') {
                    let rPr = rNode.getElementsByTagName('w:rPr')[0];
                    if (!isDownload && s.value !== s.originalValue) {
                        if (!rPr) { rPr = doc.createElementNS("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "w:rPr"); rNode.insertBefore(rPr, rNode.firstChild); }
                        if (!rPr.getElementsByTagName("w:highlight").length) {
                            const hl = doc.createElementNS("http://schemas.openxmlformats.org/wordprocessingml/2006/main", "w:highlight");
                            hl.setAttribute("w:val", "green"); rPr.appendChild(hl);
                        }
                    } else if (rPr) {
                        const hl = rPr.getElementsByTagName("w:highlight")[0];
                        if (hl) rPr.removeChild(hl);
                    }
                }
            }
        }));

        const ser = new XMLSerializer();
        let newXml = ser.serializeToString(doc);
        if (!newXml.startsWith('<?xml')) newXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' + newXml;

        zipRef.current.file("word/document.xml", newXml);
        return await zipRef.current.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    };

    const handleTextUpdate = async (bIdx, sIdx, val) => {
        const nb = [...blocks];
        nb[bIdx].segments[sIdx].value = val;
        setBlocks(nb);
        const blob = await updateDoc(nb);
        setBuffer(await blob.arrayBuffer());
    };

    const handleAccept = async (sugg) => {
        let foundB = -1, foundS = -1;
        // Prioritize Segment ID lookup (Integer match)
        if (sugg.segment_id !== undefined) {
            for (let i = 0; i < blocks.length; i++) {
                const sIdx = blocks[i].segments.findIndex(s => s.globalId === sugg.segment_id);
                if (sIdx !== -1) { foundB = i; foundS = sIdx; break; }
            }
        }
        // Fallback to text match if ID failed
        if (foundB === -1) {
            blocks.forEach((b, bi) => b.segments.forEach((s, si) => {
                if (s.value.includes(sugg.originalText) || sugg.originalText.includes(s.value)) {
                    if (s.value === sugg.originalText) { foundB = bi; foundS = si; }
                }
            }));
        }

        if (foundB === -1) return alert("Could not locate text to replace.");

        const nb = [...blocks];
        nb[foundB].segments[foundS] = { ...nb[foundB].segments[foundS], value: sugg.changedText, revertOriginal: sugg.originalText, revertReason: sugg.reason };
        setBlocks(nb);
        setAnalysis(prev => ({ ...prev, suggestions: prev.suggestions.filter(x => x !== sugg) }));

        const blob = await updateDoc(nb);
        setBuffer(await blob.arrayBuffer());
    };

    const handlePreviewClick = async (e) => {
        const span = e.target.closest('span[style*="background-color"]');
        if (!span) return;
        const txt = span.innerText;

        let found = null, bIdx = -1, sIdx = -1;
        blocks.forEach((b, bi) => b.segments.forEach((s, si) => {
            if (s.value === txt && s.value !== s.originalValue) { found = s; bIdx = bi; sIdx = si; }
        }));

        if (found) {
            const { isConfirmed, isDenied, value } = await window.Swal.fire({
                title: 'Edit Change',
                html: `<div style="text-align:left;margin-bottom:5px;color:#aaa">Original:</div>
                  <div style="text-align:left;text-decoration:line-through;color:#ef4444;margin-bottom:10px">${found.revertOriginal || found.originalValue}</div>
                  <textarea id="sw-edit" class="swal-custom-textarea" rows="3">${found.value}</textarea>`,
                background: '#1e293b', color: '#fff', confirmButtonColor: '#8b5cf6', showDenyButton: true, denyButtonText: 'Revert', confirmButtonText: 'Save',
                preConfirm: () => document.getElementById('sw-edit').value
            });

            const nb = [...blocks];
            if (isConfirmed) nb[bIdx].segments[sIdx].value = value;
            else if (isDenied) nb[bIdx].segments[sIdx].value = nb[bIdx].segments[sIdx].originalValue;

            setBlocks(nb);
            const blob = await updateDoc(nb);
            setBuffer(await blob.arrayBuffer());
        }
    };

    return (
        <>
            <AppStyles />
            <div className="app-container">
                <div className="header">
                    <div className="header-title"><Boxes /> Resume AI Analyst</div>
                    {view === 'dashboard' && (
                        <div className="toolbar">
                            <button className="btn btn-secondary" onClick={() => { setView('upload'); setAnalysis(null); setBlocks([]); }}>New</button>
                            <button className="btn btn-primary" onClick={async () => {
                                const blob = await updateDoc(blocks, true);
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a'); a.href = url; a.download = "Analyzed_Resume.docx"; a.click();
                            }}><Download size={18} /> Download</button>
                        </div>
                    )}
                </div>

                {view === 'upload' ? (
                    <UploadView onAnalyze={handleAnalyze} isAnalyzing={loading} />
                ) : (
                    <DashboardView
                        docBlocks={blocks}
                        analysis={analysis}
                        previewRef={previewRef}
                        onUpdateText={handleTextUpdate}
                        onAcceptFix={handleAccept}
                        onRefresh={async () => {
                            const blob = await updateDoc(blocks);
                            setBuffer(await blob.arrayBuffer());
                        }}
                        onPreviewClick={handlePreviewClick}
                    />
                )}
            </div>
        </>
    );
}

