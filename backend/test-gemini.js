import dotenv from 'dotenv';
import { analyzeResume, evaluateAnswer } from './services/geminiService.js';

dotenv.config();

const runTest = async () => {
  console.log('--- Starting Gemini Service Local Integration Test ---');
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.warn('WARNING: GEMINI_API_KEY is not set or using placeholder in .env!');
    console.log('Please obtain an API key from Google AI Studio and place it in backend/.env to run this test.');
    return;
  }

  try {
    console.log('Testing Resume analysis mock text parsing...');
    const mockResumeText = `
      John Doe
      Software Developer
      Email: john@example.com
      Skills: JavaScript, Node.js, React, MongoDB, HTML, CSS, Git.
      Education: BS in Computer Science, State University, 2023.
      Projects:
      - Chat App: A real-time socket chat app built with Node.js and React.
    `;

    const resumeResult = await analyzeResume(mockResumeText);
    console.log('SUCCESS: Resume parsed successfully!');
    console.log(JSON.stringify(resumeResult, null, 2));

    console.log('\nTesting answer evaluation...');
    const question = 'What is the difference between Virtual DOM and Real DOM in React?';
    const answer = 'Virtual DOM is a lightweight copy of the real DOM. React updates the virtual DOM first, finds the differences through diffing, and then updates the real DOM in batch, making UI updates faster.';
    
    const evaluationResult = await evaluateAnswer(question, 'technical', answer);
    console.log('SUCCESS: Answer graded successfully!');
    console.log(JSON.stringify(evaluationResult, null, 2));

  } catch (error) {
    console.error('ERROR: Test failed due to:');
    console.error(error);
  }
};

runTest();
