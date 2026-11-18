const api = {
    async analyze(apiKey, docBlocks, jobRole, jobDesc) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

        const simplified = docBlocks.map(b => ({
            id: b.block_id,
            role: b.role,
            segments: b.segments.map(s => ({ id: s.globalId, text: s.value })).filter(s => s.text.trim().length > 0)
        })).filter(b => b.segments.length > 0);

        let prompt = `
  You are a Pragmatic Senior Hiring Manager who is a perfectionist but wants the candidate to succeed. 
  Your goal is to "red-line" this resume to make it as competitive as possible.

  **YOUR MINDSET: "PROACTIVE OPTIMIZATION"**
  - The user has an "Accept/Reject" button for your suggestions. Therefore, do NOT hold back. 
  - If a sentence is "Okay," make it "Great." 
  - If a sentence is "Good," make it "Excellent."
  - Don't worry about being too critical. It is better to offer 10 suggestions and have the user accept 5, than to offer only 1 suggestion.

  **YOUR "REAL WORLD" FILTER:**
  1. **Kill Buzzwords:** If the user says "Synergized" or "Utilized", change it to "Partnered" or "Used".
  2. **Active Voice:** Aggressively hunt down passive voice (e.g., "was responsible for"). Change it to active power verbs (e.g., "Directed," "Built," "Executed").
  3. **Metric Injection:** If a bullet point is vague (e.g., "Improved performance"), rewrite it to prompt the user for numbers (e.g., "Improved performance by [X]%").
  4. **Tighten Phrasing:** If a sentence is 3 lines long, cut the fluff. Real experts speak concisely.

  **SCORING GUIDELINES (calibrated for encouragement):**
  - **The Floor:** The minimum score for any existing content is 20 (unless the section is totally empty). Do not give single-digit scores like "5".
  - **Base Range:** An average bullet point gets a 50. 
  - **High Range:** Only give 80+ if it includes specific metrics ($ revenue, % growth, time saved) and perfect keywords.
  - **Deductions:** -5 pts for passive voice, -5 pts for missing specific hard skills.

  **OUTPUT FORMAT (JSON):**
  Return a JSON object with:
  1. "overallScore": (integer 0-100)
  2. "metrics": { "impact": int, "brevity": int, "style": int, "skills": int }
  3. "feedback": { 
      "impact": "Advice on metrics (e.g. 'You have a floor of 20 points here because you lack numbers. Add % to boost this.')", 
      "style": "Comment on tone/voice",
      "brevity": "Comment on length and conciseness (e.g. 'Remove fluff', 'Keep it under 3 lines')", 
      "skills": "Comment on hard skills (e.g. 'Missing key technologies for this role')" 
  }
  4. "suggestions": Array of objects. **Aim to provide at least 2-3 suggestions per resume section if possible.**
     { 
       "segment_id": int, 
       "originalText": string, 
       "changedText": string, 
       "reason": string 
     }
     (In "reason", be brief and punchy: "Stronger verb needed here" or "Too passive, changed to active voice.")
`;

        if (jobRole && jobDesc) {
            prompt += `
  **CONTEXT:**
  Target Role: ${jobRole}
  JD Snippet: ${jobDesc.substring(0, 800)}...
  
  - If the user describes a task that roughly matches the JD but uses different words, REWRITE it to use the JD's exact keywords (ATS Optimization).
  - If they are completely missing a required skill, mention it in the "feedback" section.
  
  ADD JSON field:
  5. "jobMatch": { "score": number, "reason": string, "missingKeywords": ["string"], "matchingKeywords": ["string"] }
  `;
        }
        const payload = {
            contents: [{ parts: [{ text: prompt }, { text: JSON.stringify(simplified) }] }],
            generationConfig: { responseMimeType: "application/json" }
        };

        const res = await fetch(apiUrl, { method: 'POST', body: JSON.stringify(payload) });
        const json = await res.json();
        return JSON.parse(json.candidates[0].content.parts[0].text);
    }
};

export default api;
