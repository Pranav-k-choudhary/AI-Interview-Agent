import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// gemini-2.0-flash was shut down June 2026; free-tier quota is 0 for deprecated models.
const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || "gemini-3.5-flash";

const isRetryableGeminiError = (error) =>
  error?.status === 503 || error?.status === 429;

const generateJSON = async (prompt) => {
  const models = [...new Set([PRIMARY_MODEL, FALLBACK_MODEL])];
  let lastError;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      return parseJSONResponse(response.text);
    } catch (error) {
      lastError = error;
      const hasFallback = model !== models[models.length - 1];

      if (isRetryableGeminiError(error) && hasFallback) {
        console.warn(
          `Gemini model "${model}" unavailable (${error.status}). Trying "${models[models.indexOf(model) + 1]}"...`
        );
        continue;
      }

      throw error;
    }
  }

  throw lastError;
};

/*
 * Clean helper to handle response text parsing
 */
const parseJSONResponse = (responseText) => {
  try {
    // Remove markdown code block symbols if Gemini adds them despite json mode
    let cleanText = responseText.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.substring(7);
    }
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    return JSON.parse(cleanText.trim());
  } catch (error) {
    console.error('Error parsing JSON from Gemini response:', error);
    console.error('Raw response was:', responseText);
    throw new Error('Failed to parse structured response from AI.');
  }
};

/**
 * Extracts candidate details from resume text
 */
export const analyzeResume = async (resumeText) => {
  const prompt = `
    Analyze the following raw text extracted from a resume. Extract key structured information.

    Return ONLY valid JSON.

    {
      "skills": [],
      "programmingLanguages": [],
      "frameworks": [],
      "projects": [],
      "education": [],
      "experience": []
    }

    Resume:
    ${resumeText}
  `;

  return generateJSON(prompt);
};
/**
 * Generates the next adaptive interview question based on history and candidate profile
 */
export const generateNextQuestion = async (interview, userProfile, resumeData) => {

  // Re-map the interview questions and evaluations history for context
  const history = interview.questions.map((q, idx) => ({
    index: idx + 1,
    questionText: q.text,
    type: q.questionType,
    userAnswer: q.userAnswer,
    score: q.evaluation?.score || 0,
    weaknesses: q.evaluation?.weaknesses || '',
  }));

  const totalQuestions = interview.questions.length;
  const lastQuestion = totalQuestions > 0 ? interview.questions[totalQuestions - 1] : null;

  // Let's decide what prompt instructions to give based on previous answer quality
  let adaptiveDirective = '';
  if (lastQuestion) {
    const lastScore = lastQuestion.evaluation?.score || 0;
    if (lastScore < 5) {
      adaptiveDirective = 'The candidate struggled with the previous question (score: ' + lastScore + '/10). Ask an easier follow-up or break down the concept in a simpler manner.';
    } else if (lastScore >= 8) {
      adaptiveDirective = 'The candidate did exceptionally well on the previous question (score: ' + lastScore + '/10). Increase the difficulty level, ask a more advanced conceptual/design question, or follow up on details they provided.';
    } else {
      adaptiveDirective = 'The candidate gave an average answer. Keep a steady difficulty and probe further.';
    }
  } else {
    adaptiveDirective = 'This is the first question of the interview. Start with a welcoming, role-specific introductory technical question.';
  }

  // Project-based question guidance: if a project is available in the resume, make sure we ask about it at some point (e.g. around question 2 or 3)
  const hasProjects = resumeData && resumeData.projects && resumeData.projects.length > 0;
  let projectDirective = '';
  if (hasProjects && totalQuestions === 1) {
    const project = resumeData.projects[0];
    projectDirective = `For this second question, ask a detailed question specifically focusing on their project "${project.name}" and the technologies they used: "${project.technologies?.join(', ') || ''}". Ask about architectural choices, problems faced, or how they implemented a feature.`;
  }

  const prompt = `
    You are an expert AI Interviewer conducting a real-time, adaptive technical and behavioral interview.
    
    Interview Details:
    - Target Role: ${interview.targetRole}
    - Difficulty Level: ${interview.difficulty}
    - Candidate Name: ${userProfile.name}
    - Candidate Core Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
    - Resume Extracted Info: ${JSON.stringify(resumeData || {})}
    
    Current Progress:
    - Questions asked so far: ${totalQuestions}
    - Question/Answer History: ${JSON.stringify(history)}
    
    Directives:
    - ${adaptiveDirective}
    - ${projectDirective}
    - Choose a question type suitable for the role. Available question types: 'technical', 'behavioral', 'hr', 'project', 'problem-solving', 'scenario', 'system-design'.
    - DO NOT repeat questions that have already been asked or are highly similar to ones in the history.
    - Ask only ONE clear, concise question at a time.
    
    You MUST respond with a JSON object in this format:
    {
      "text": "The question text to ask next.",
      "questionType": "one of: technical, behavioral, hr, project, problem-solving, scenario, system-design"
    }
  `;

  return generateJSON(prompt);
};

/**
 * Evaluates the user's answer to a single question
 */
export const evaluateAnswer = async (questionText, questionType, userAnswer) => {
  const prompt = `
    You are an expert technical interviewer. Evaluate the candidate's answer to the following question.
    
    Question Type: ${questionType}
    Question: ${questionText}
    Candidate's Answer: ${userAnswer}
    
    Evaluate based on:
    - Correctness (technical accuracy)
    - Depth of knowledge shown
    - Confidence (judged by language and certainty of the explanation)
    - Communication (clarity, coherence, structure)
    - Completeness
    
    You MUST respond with a JSON object in this format:
    {
      "score": 8, // An integer score between 0 and 10
      "correctness": "Brief assessment of correctness",
      "depth": "Assessment of how detailed the response was",
      "confidence": "Assessment of the confidence level shown",
      "communication": "Assessment of how clearly and professionally they communicated",
      "technicalAccuracy": "Assessment of their technical terminology and concepts",
      "completeness": "Whether they answered all parts of the question",
      "strengths": "1-2 key strengths of this answer",
      "weaknesses": "1-2 weaknesses or gaps in this answer",
      "suggestedAnswer": "A model/recommended answer that would secure a perfect 10/10 score, written in a natural, clear style."
    }
  `;

  return generateJSON(prompt);
};

/**
 * Compiles the entire interview session, grades total performance, and outlines learning path
 */
export const generateOverallReport = async (interview, userProfile, resumeData) => {
  // Aggregate stats
  const questionsCount = interview.questions.length;
  const questionsEvaluations = interview.questions.map((q, idx) => ({
    index: idx + 1,
    questionText: q.text,
    type: q.questionType,
    userAnswer: q.userAnswer,
    score: q.evaluation.score,
    strengths: q.evaluation.strengths,
    weaknesses: q.evaluation.weaknesses,
  }));

  const prompt = `
    You are an expert career counselor and senior engineering manager.
    Evaluate the candidate's complete interview and provide a comprehensive performance report and learning roadmap.
    
    Candidate Profile:
    - Name: ${userProfile.name}
    - Target Role: ${interview.targetRole}
    - Target Seniority: ${interview.difficulty}
    - Current Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
    
    Interview Details:
    - Total Questions: ${questionsCount}
    - Full Q&A History with individual scores: ${JSON.stringify(questionsEvaluations)}
    
    Evaluate the following and output scores from 0 to 100:
    - overallScore (Weighted average of all question scores, scaled out of 100)
    - communicationScore (Grammar, clarity, structured explaining)
    - technicalScore (Frameworks, coding concepts, core CS knowledge)
    - problemSolvingScore (Scenarios, algorithmic/reasoning depth)
    - projectKnowledgeScore (For project-based questions or general system construction depth)
    
    Also perform a Skill Gap Analysis matching their target role (${interview.targetRole}) with their performance and current skills.
    Identify missing skills, recommended technologies, steps for a learning roadmap, and 2 tailored projects they should build.
    
    You MUST respond with a JSON object in this format:
    {
      "overallScore": 82, // 0 - 100
      "communicationScore": 85, // 0 - 100
      "technicalScore": 80, // 0 - 100
      "problemSolvingScore": 75, // 0 - 100
      "projectKnowledgeScore": 88, // 0 - 100
      "summary": "Detailed summary of candidate performance, overall impression, and career advice.",
      "weakAreas": ["List of weak topics/areas identified during the interview"],
      "strongAreas": ["List of strong topics/areas identified during the interview"],
      "learningRoadmap": {
        "missingSkills": ["List of missing skills required for the target role"],
        "recommendedTechnologies": ["Technologies/Libraries/Frameworks they should learn next"],
        "roadmapSteps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
        "suggestedProjects": [
          {
            "title": "Project Title",
            "description": "Detailed project description designed to fill their skill gaps.",
            "stack": ["Tech1", "Tech2"]
          }
        ]
      }
    }
  `;

  return generateJSON(prompt);
};
