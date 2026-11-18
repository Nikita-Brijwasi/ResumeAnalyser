import React from 'react';

const AppStyles = () => (
  <style>{`
    :root {
      --primary: #8b5cf6; /* Violet 500 */
      --primary-hover: #7c3aed;
      --bg-dark: #0f172a; /* Slate 900 */
      --bg-card: #1e293b; /* Slate 800 */
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --border: #334155;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --editor-paper: #ffffff;
      --editor-text: #0f172a;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: var(--bg-dark);
      color: var(--text-main);
      height: 100vh;
    }

    .app-container {
      max-width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 30px;
      background: var(--bg-card);
      border-bottom: 1px solid var(--border);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      z-index: 10;
      flex-shrink: 0;
    }
    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-main);
      letter-spacing: -0.5px;
    }

    .toolbar { display: flex; gap: 12px; }

    /* Buttons */
    .btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .btn-primary { background-color: var(--primary); color: white; box-shadow: 0 0 15px rgba(139, 92, 246, 0.3); }
    .btn-primary:hover { background-color: var(--primary-hover); transform: translateY(-1px); }
    .btn-secondary { background-color: transparent; color: var(--text-muted); border: 1px solid var(--border); }
    .btn-secondary:hover { border-color: var(--text-main); color: var(--text-main); background: rgba(255,255,255,0.05); }
    .btn-success { background-color: var(--success); color: white; }
    .btn-large { padding: 14px 28px; font-size: 1rem; width: 100%; justify-content: center; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    /* --- PAGE: UPLOAD (Scrollable) --- */
    .page-upload {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 40px 20px;
      background: radial-gradient(circle at top center, #1e293b 0%, #0f172a 100%);
      overflow-y: auto;
    }
    
    .upload-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 550px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      animation: slideUp 0.4s ease-out;
      margin: auto;
      flex-shrink: 0;
    }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    .upload-title { text-align: center; margin-bottom: 30px; }
    .upload-title h2 { font-size: 1.8rem; margin: 0 0 8px 0; color: var(--text-main); }
    .upload-title p { color: var(--text-muted); font-size: 0.95rem; }

    .drop-zone {
      border: 2px dashed var(--border);
      border-radius: 12px;
      padding: 40px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: rgba(0,0,0,0.2);
      margin-bottom: 25px;
    }
    .drop-zone:hover { border-color: var(--primary); background: rgba(139, 92, 246, 0.05); }
    .file-name { color: var(--success); font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; }

    .form-group { margin-bottom: 20px; }
    .form-label { display: block; margin-bottom: 8px; font-size: 0.85rem; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
    .form-input {
      width: 100%;
      background: var(--bg-dark);
      border: 1px solid var(--border);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: border-color 0.2s;
    }
    .form-input:focus { outline: none; border-color: var(--primary); }
    .form-textarea { min-height: 100px; resize: vertical; font-family: inherit; }


    /* --- PAGE: DASHBOARD --- */
    .page-dashboard {
      flex: 1;
      display: grid;
      grid-template-columns: 500px 1fr;
      overflow: hidden;
    }

    /* Left Panel */
    .panel-left {
      background: var(--bg-card);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .panel-tabs {
      display: flex;
      border-bottom: 1px solid var(--border);
      padding: 0 20px;
      flex-shrink: 0;
    }
    .tab-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      padding: 15px 20px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }
    .tab-btn:hover { color: var(--text-main); }
    .tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); }

    .panel-content {
      flex: 1;
      overflow-y: auto;
      padding: 0;
    }

    /* Right Panel */
    .panel-right {
      background: #525659;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }
    .preview-toolbar {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 100;
    }
    .preview-area {
      flex: 1;
      overflow-y: auto;
      display: flex;
      justify-content: center;
    }

    .docx-wrapper { background: transparent !important; padding: 0 !important; width: 100%; max-width: 900px; height: 100%; }
    .docx-wrapper > section.docx {
      background: white !important;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important;
      margin-bottom: 40px !important;
      padding: 50px !important;
      min-height: 1000px;
      color: black !important;
    }
    .docx-wrapper span[style*="background-color"] { 
      cursor: pointer; 
      border-bottom: 2px solid #10b981; 
      transition: all 0.2s;
      background-color: rgba(16, 185, 129, 0.2) !important; /* Override Word's dark green */
    }
    .docx-wrapper span[style*="background-color"]:hover {
      background-color: rgba(16, 185, 129, 0.4) !important;
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.4);
    }

    /* Scores */
    .scores-view { padding: 30px; }
    
    .score-hero {
      background: var(--bg-dark);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      margin-bottom: 20px;
      box-shadow: inset 0 0 40px rgba(0,0,0,0.3);
    }
    .score-hero-val { font-size: 4rem; font-weight: 800; color: var(--primary); line-height: 1; text-shadow: 0 0 30px rgba(139, 92, 246, 0.2); }
    .score-hero-label { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); margin-top: 10px; }

    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 30px;
    }
    .metric-card {
      background: var(--bg-dark);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      transition: transform 0.2s, border-color 0.2s;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 140px;
    }
    .metric-card:hover { transform: translateY(-3px); border-color: var(--primary); }
    .metric-val { font-size: 2.5rem; font-weight: 700; color: var(--primary); margin: 5px 0; }
    .metric-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; justify-content: center; gap: 6px; }
    
    .score-high { color: var(--success); }
    .score-mid { color: var(--warning); }
    .score-low { color: var(--danger); }

    /* Suggestions */
    .suggestion-header { color: var(--text-muted); font-size: 0.85rem; letter-spacing: 1px; margin-bottom: 15px; text-transform: uppercase; border-bottom: 1px solid var(--border); padding-bottom: 10px; }
    .suggestion-card {
      background: var(--bg-dark);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 12px;
      transition: border-color 0.2s;
    }
    .suggestion-card:hover { border-color: var(--text-muted); }
    .text-original { text-decoration: line-through; color: var(--danger); font-size: 0.9rem; display: block; margin-bottom: 6px; opacity: 0.7; }
    .text-changed { color: var(--success); font-weight: 600; font-size: 0.95rem; display: block; margin-bottom: 8px; }
    .reason { font-size: 0.85rem; color: var(--text-muted); font-style: italic; line-height: 1.4; }

    /* Editor */
    .editor-view {
      background: var(--editor-paper);
      color: var(--editor-text);
      padding: 40px;
      min-height: 100%;
      font-family: 'Times New Roman', Times, serif;
      line-height: 1.6;
      font-size: 1.1rem;
    }
    .doc-para { margin-bottom: 1em; }
    .doc-seg {
      padding: 1px 2px; border-radius: 2px; cursor: text; border-bottom: 1px dashed transparent;
    }
    .doc-seg:hover { background: rgba(139, 92, 246, 0.1); border-bottom-color: var(--primary); }
    .doc-seg.mod { background: #dcfce7; border-bottom: 2px solid var(--success); }

    /* SweetAlert */
    .swal2-popup { font-family: sans-serif !important; background: #1e293b !important; border: 1px solid #334155 !important; color: #fff !important; }
    .swal2-title { color: #fff !important; }
    .swal2-html-container { color: #cbd5e1 !important; }
    
    /* This class matches the one used in your handlePreviewClick JS */
    .swal-custom-textarea {
      width: 100%; 
      background: #0f172a; 
      border: 1px solid #334155; 
      color: #f8fafc; 
      padding: 12px;
      border-radius: 6px; 
      margin-top: 15px; 
      font-family: inherit;
      font-size: 0.95rem;
      line-height: 1.5;
      min-height: 120px; /* Ensures the box isn't crushed */
      resize: vertical;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
    }
    
    .swal-custom-textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
    }
    
    /* Pills */
    .pill-wrap { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    .pill { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; border: 1px solid; background: rgba(255,255,255,0.05); }
    .pill.red { border-color: var(--danger); color: var(--danger); }
    .pill.green { border-color: var(--success); color: var(--success); }

      /* --- MOBILE RESPONSIVENESS --- */
    @media (max-width: 900px) {
      .app-container {
        height: auto;
        min-height: 100vh;
        overflow-y: auto;
      }
      .header {
        padding: 10px 15px;
        flex-wrap: wrap;
        gap: 10px;
      }
      
      .header-title {
        font-size: 1.1rem;
      }
      /* Stack Dashboard */
      .page-dashboard {
        display: flex;
        flex-direction: column;
        height: auto;
        overflow: visible;
      }
      .panel-left {
        width: 100%;
        height: auto;
        border-right: none;
        border-bottom: 1px solid var(--border);
        overflow: visible;
      }
      .panel-content {
        overflow-y: visible;
        height: auto;
        max-height: 600px; /* Limit height of editor/scores so preview is accessible */
        overflow-y: auto; /* Scroll inside if too tall */
      }
      .panel-right {
        width: 100%;
        height: 600px;
        flex: none;
      }
      
      .preview-toolbar {
        top: 10px;
        right: 10px;
      }
      /* Upload Page */
      .page-upload {
        padding: 20px 15px;
        height: auto;
        min-height: calc(100vh - 60px);
      }
      
      .upload-card {
        padding: 25px 20px;
        margin: 0;
        max-width: 100%;
      }
      
      .upload-title h2 {
        font-size: 1.5rem;
      }
      /* Metrics */
      .metrics-grid {
        grid-template-columns: 1fr 1fr; /* Keep 2 cols if possible, else 1 */
      }
      
      .score-hero-val {
        font-size: 3rem;
      }
    }
    @media (max-width: 480px) {
      .metrics-grid {
        grid-template-columns: 1fr;
      }
      
      .panel-tabs {
        padding: 0 10px;
        overflow-x: auto; /* Allow horizontal scroll for tabs if needed */
      }
      
      .tab-btn {
        padding: 12px 15px;
        font-size: 0.85rem;
        white-space: nowrap;
      }
      
      .btn-large {
        font-size: 0.95rem;
      }
    }
  `}</style>
);

export default AppStyles;
