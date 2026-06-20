import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY is not defined in the environment. Falling back to offline intelligence.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// 1. Suggest CO endpoint
app.post("/api/ai/suggest-co", async (req, res) => {
  const { courseName, currentCOs } = req.body;
  const ai = getAi();
  
  if (!ai) {
    // Offline intelligence fallback
    const mockSuggestions = [
      {
        code: "CO4",
        description: "Design and implement transactional integrity mechanisms, indexing structures, and query optimization routines to satisfy enterprise data-warehousing latency targets.",
        bloomsLevel: "L6 - Create",
        reason: "Recommended based on standard DBMS course progression for unstructured systems or high-performance transaction systems."
      },
      {
        code: "CO4",
        description: "Formulate non-relational schemata and design robust document-store solutions using MongoDB or DynamoDB to address highly scalable, unstructured big data requirements.",
        bloomsLevel: "L6 - Create",
        reason: "Highly valuable for bridging relational database curriculum gaps with cutting edge NoSQL scalable database paradigms."
      }
    ];
    // Return a random mock suggestion
    const index = Math.random() > 0.5 ? 1 : 0;
    return res.json({ success: true, suggestion: mockSuggestions[index], isMock: true });
  }

  try {
    const coContext = currentCOs && Array.isArray(currentCOs) ? currentCOs.join("; ") : "None defined";
    const prompt = `You are an Outcomes-Based Education (OBE) curriculum design specialist.
For the course "${courseName || "Database Management Systems"}", suggest a new Course Outcome (CO) that complements existing outcomes: [${coContext}]. 
The recommendation should preferably address NoSQL systems, cloud data architecture, or database scaling, typically mapped to Bloom's Level L5 - Evaluate or L6 - Create.
Include a brief rationale explaining why this suggestion is beneficial for modern student employability.

Provide the response in structured JSON format matching this schema:
{
  "code": string (e.g., "CO4"),
  "description": string (the complete, professionally worded outcome narrative),
  "bloomsLevel": string (e.g., "L6 - Create" or "L5 - Evaluate"),
  "reason": string (brief justification for the course structure)
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            code: { type: Type.STRING, description: "Unique code for the course outcome, like CO4" },
            description: { type: Type.STRING, description: "Detailed narrative of what the student will be able to do" },
            bloomsLevel: { type: Type.STRING, description: "Bloom's taxonomy action classification, e.g. L6 - Create" },
            reason: { type: Type.STRING, description: "Short rationale for why this outcome is highly recommended" }
          },
          required: ["code", "description", "bloomsLevel", "reason"]
        }
      }
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    return res.json({ success: true, suggestion: parsed });
  } catch (error: any) {
    console.error("Gemini Suggest-CO failed:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Justify mapping endpoint
app.post("/api/ai/justify-mapping", async (req, res) => {
  const { coCode, coDesc, poCode, poDesc, strength } = req.body;
  const ai = getAi();

  if (!ai) {
    // Offline intelligence fallback
    const mockNarratives: Record<string, string> = {
      "3": `Strength of 3 for ${coCode || 'CO2'}-${poCode || 'PO3'} is fully justified by the semester-long core development project requiring hands-on schema normalization and rigorous SQL physical layout design.`,
      "2": `${coCode || 'CO1'}-${poCode || 'PO1'} (Strength 2) is addressed through 4 hours of theoretical lectures and 2 structured tutorial worksheets on Entity Relationship modelling metrics.`,
      "1": `CO3-${poCode || 'PO4'} is mapped at Low Correlation (Strength 1) as search-concurrency is briefly investigated during lab profiling but is not the main evaluation metric.`
    };
    return res.json({
      success: true,
      narrative: mockNarratives[String(strength)] || `Mapping strength ${strength} is supported by the corresponding syllabus lectures and active lab evaluations.`,
      isMock: true
    });
  }

  try {
    const prompt = `Act as an academic accreditation agent for Outcomes-Based Education (OBE).
For a Course Outcome: "${coCode}: ${coDesc}"
and a Program Outcome (PO): "${poCode}: ${poDesc}"
Write a professional, academic 1-sentence narrative justifying why this pair is mapped with a Strength level of ${strength} (out of 3). 
If strength is 3, explain how it has direct project-based design and high weight. If 2, state it's addressed through lectures, tutorials, or secondary assignments. If 1, state it has minor supportive correlation.
Ensure the justification is extremely realistic and looks drafted by a seasoned professor. No conversational fluff or meta-introduction, return ONLY the generated narrative.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return res.json({ success: true, narrative: (response.text || "").trim() });
  } catch (error: any) {
    console.error("Gemini Justify-Mapping failed:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Syllabus gaps / justifications endpoint
app.post("/api/ai/syllabus-gaps", async (req, res) => {
  const { courseName } = req.body;
  const ai = getAi();

  if (!ai) {
    // Offline logic
    return res.json({
      success: true,
      gaps: [
        {
          id: "gap-1",
          title: "Syllabus Justification: NoSQL Paradigm",
          tag: "REVIEW",
          description: "AI identified a secondary curriculum gap: The current relational outline neglects distributed non-relational clustering paradigms.",
          actionText: "ADOPT SUGGESTION",
          targetScreen: "courses"
        },
        {
          id: "gap-2",
          title: "Syllabus Justification: Performance Metrics",
          tag: "REVIEW",
          description: "AI identified a critical performance trend gap: Index-optimization is currently only evaluated in theoretical exam segments rather than active lab benchmarking.",
          actionText: "REVIEW AI",
          targetScreen: "courses"
        }
      ],
      isMock: true
    });
  }

  try {
    const prompt = `You are an educational auditor. Analyze the syllabus outline for "${courseName || "Database Management Systems"}".
Generate 2 distinct curriculum gap narratives about contemporary trends or performance assessment misalignments (e.g., missing distributed big-data storage paradigms or lack of automated stress testing in labs).
Provide the output in structured JSON matching this schema:
{
  "gaps": [
    {
      "id": string (unique identifier),
      "title": string (such as "Syllabus Justification: Distributed NoSQL Gaps"),
      "tag": string ("URGENT" or "DUE TODAY" or "REVIEW"),
      "description": string (the detailed academic gap assessment of 1-2 sentences),
      "actionText": string (a short button CTA like "REVIEW INTERVENTION" or "ADOPT SUGGESTION"),
      "targetScreen": string ("courses")
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            gaps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  tag: { type: Type.STRING },
                  description: { type: Type.STRING },
                  actionText: { type: Type.STRING },
                  targetScreen: { type: Type.STRING }
                },
                required: ["id", "title", "tag", "description", "actionText", "targetScreen"]
              }
            }
          },
          required: ["gaps"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, gaps: parsed.gaps });
  } catch (error: any) {
    console.error("Gemini Syllabus Gaps failed:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 4. CQI suggestions endpoint
app.post("/api/ai/cqi-suggestions", async (req, res) => {
  const { courseName, coIndex, poGap } = req.body;
  const ai = getAi();

  if (!ai) {
    return res.json({
      success: true,
      suggestions: [
        {
          id: "cqi-1",
          title: "Automate Continuous Testing in Labs",
          type: "CRITICAL",
          deltaValue: "-0.54 Delta",
          description: "Introduce continuous performance benchmarking script execution for CO4 (Graph algorithms) to alert instruction staff of code compilation failures before final lab assessments."
        },
        {
          id: "cqi-2",
          title: "Syllabus Realignment: Prerequisite Bridging",
          type: "MARGINAL",
          deltaValue: "-0.06 Delta",
          description: "Mandate a 2-hour bridge lecture on mathematical recurrence equations at the start of Semester V to boost CO3 computational modeling capabilities."
        },
        {
          id: "cqi-3",
          title: "Establish Industry Guest Lecture Series",
          type: "STABLE",
          deltaValue: "+0.90 Delta",
          description: "Leverage strong PO1 alignment to conduct collaborative code clinics reviewing industrial algorithm implementation standards with visiting technicians."
        }
      ],
      isMock: true
    });
  }

  try {
    const prompt = `Act as an OBE Continuous Quality Improvement (CQI) auditor.
For the course: "${courseName || "Theory of Computation"}", the current performance metadata includes:
- Course Outcome Index is ${coIndex || "2.84"}/3.0
- Program Outcome Attainment Gap is ${poGap || "-12.4%"}
Provide 3 concrete academic CQI suggestions to tackle gaps.
Provide the output in structured JSON format matching this schema:
{
  "suggestions": [
    {
      "id": string,
      "title": string (actionable title),
      "type": string ("CRITICAL" or "MARGINAL" or "STABLE"),
      "deltaValue": string (e.g. "-0.54 Delta" or "+0.90 Delta"),
      "description": string (the detailed academic intervention of 2 sentences)
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  type: { type: Type.STRING },
                  deltaValue: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["id", "title", "type", "deltaValue", "description"]
              }
            }
          },
          required: ["suggestions"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, suggestions: parsed.suggestions });
  } catch (error: any) {
    console.error("Gemini CQI Suggestions failed:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});


// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", time: new Date().toISOString() });
});

// Vite Integration & Static Assets
async function bootstrap() {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    // Mount Vite as middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`OBE Platform Fullstack Server running on http://0.0.0.0:${PORT} in ${isProduction ? 'production' : 'development'} mode.`);
  });
}

bootstrap().catch((err) => {
  console.error("Server bootstrap failed:", err);
});
