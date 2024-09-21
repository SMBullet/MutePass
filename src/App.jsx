import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaCopy, FaMoon, FaSun } from 'react-icons/fa';
import { FiKey } from 'react-icons/fi'; // MutePass logo placeholder

function App() {
  const [password, setPassword] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(12);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSpecial, setUseSpecial] = useState(true);
  const [copyMessage, setCopyMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generatePassword(); // Regenerate password when passwordLength changes
  }, [passwordLength, useUpper, useLower, useDigits, useSpecial]);

  const analyzePassword = () => {
    let score = 0;
    let newSuggestions = [];

    if (password.length >= 8) {
      score++;
    } else {
      newSuggestions.push('Increase the password length to at least 8 characters.');
    }

    if (/[A-Z]/.test(password)) {
      score++;
    } else {
      newSuggestions.push('Add at least one uppercase letter.');
    }

    if (/[a-z]/.test(password)) {
      score++;
    } else {
      newSuggestions.push('Add at least one lowercase letter.');
    }

    if (/[0-9]/.test(password)) {
      score++;
    } else {
      newSuggestions.push('Include at least one number.');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score++;
    } else {
      newSuggestions.push('Use at least one special character (e.g., @, #, $).');
    }

    let strength = '';
    switch (score) {
      case 1:
      case 2:
        strength = 'Weak';
        break;
      case 3:
      case 4:
        strength = 'Moderate';
        break;
      case 5:
        strength = 'Strong';
        break;
      default:
        strength = 'Very Weak';
    }

    setAnalysis({ score, strength });
    setSuggestions(newSuggestions);
  };

  const generatePassword = () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const digits = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    if (useUpper) chars += upper;
    if (useLower) chars += lower;
    if (useDigits) chars += digits;
    if (useSpecial) chars += special;

    if (chars === '') {
      setGeneratedPassword('Please select at least one character type');
      return;
    }

    let result = '';
    for (let i = 0; i < passwordLength; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(result);
    setCopyMessage(''); // Reset the copy message
    setCopied(false); // Reset copied state
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopyMessage('Password copied to clipboard!');
    setCopied(true); // Set copied state to true
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'} flex flex-col font-sans transition duration-300`}>
      <header className={`py-6 shadow-md flex items-center justify-between px-10 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} transition`}>
        <div className="flex items-center">
          <FiKey className={`text-3xl ${darkMode ? 'text-green-400' : 'text-green-600'} mr-3`} />
          <h1 className={`text-4xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>MutePass</h1>
        </div>
        <button onClick={toggleDarkMode} className="text-2xl">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </header>

      <main className="flex-grow grid md:grid-cols-2 gap-10 p-10 max-w-screen-lg mx-auto">
        {/* Password Generator Section - Left */}
        <section className={`rounded-lg shadow-lg p-8 w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} transition`}>
          <h2 className={`text-3xl font-light mb-6 text-center ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Strong Password Generator</h2>

          <button
            onClick={generatePassword}
            className={`w-full px-6 py-3 rounded-md ${darkMode ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-green-600 text-white hover:bg-green-700'} transition`}
          >
            Generate Secure Password
          </button>

          {/* Generated Password and Copy Functionality */}
          {generatedPassword && (
            <>
              <div
                className={`mt-6 p-4 border rounded-md flex items-center justify-between cursor-pointer ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-800'} ${copied ? 'border-green-500' : ''}`}
                onClick={copyToClipboard}
              >
                <p className={`text-center break-all font-medium flex-1 ${darkMode ? 'text-gray-100' : 'text-gray-800'} hover:text-${darkMode ? 'green-300' : 'green-700'} transition duration-300`}>{generatedPassword}</p>
                <FaCopy className={`ml-4 cursor-pointer transition ${darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-800'}`} />
              </div>
              {copyMessage && (
                <p className={`text-sm mt-2 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{copyMessage}</p>
              )}
            </>
          )}

          {/* Password Settings */}
          <div className="mt-6 space-y-4">
            <label className="flex items-center justify-between">
              <span className={`text-lg ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Password Length</span>
              <input
                type="range"
                min="8"
                max="32"
                value={passwordLength}
                onChange={(e) => setPasswordLength(Number(e.target.value))}
                className={`w-2/3 accent-${darkMode ? 'green-400' : 'green-600'} transition`}
              />
              <span className={`ml-2 px-4 py-2 rounded text-sm w-12 text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>{passwordLength}</span>
            </label>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useUpper}
                  onChange={() => setUseUpper(!useUpper)}
                  className={`rounded text-green-500 focus:ring-${darkMode ? 'green-400' : 'green-600'} transition`}
                />
                <span className={`${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Uppercase Letters</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useLower}
                  onChange={() => setUseLower(!useLower)}
                  className={`rounded text-green-500 focus:ring-${darkMode ? 'green-400' : 'green-600'} transition`}
                />
                <span className={`${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Lowercase Letters</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useDigits}
                  onChange={() => setUseDigits(!useDigits)}
                  className={`rounded text-green-500 focus:ring-${darkMode ? 'green-400' : 'green-600'} transition`}
                />
                <span className={`${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Numbers</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useSpecial}
                  onChange={() => setUseSpecial(!useSpecial)}
                  className={`rounded text-green-500 focus:ring-${darkMode ? 'green-400' : 'green-600'} transition`}
                />
                <span className={`${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Special Characters</span>
              </label>
            </div>
          </div>
        </section>

        {/* Password Strength Checker Section - Right */}
        <section className={`rounded-lg shadow-lg p-8 w-full ${darkMode ? 'bg-gray-800' : 'bg-white'} transition`}>
          <h2 className={`text-3xl font-light mb-6 text-center ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Password Strength Checker</h2>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-800'} transition`}
            />
            <button
              onClick={toggleShowPassword}
              className={`absolute inset-y-0 right-4 text-xl ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'} transition`}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            onClick={analyzePassword}
            className={`w-full mt-6 px-6 py-3 rounded-md ${darkMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'} transition`}
          >
            Check Strength
          </button>

          {analysis && (
            <div className={`mt-6 p-4 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-800'}`}>
              <p><span className="font-medium text-blue-600">Strength:</span> {analysis.strength}</p>
              <p><span className="font-medium text-blue-600">Score:</span> {analysis.score}/5</p>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className={`mt-6 p-4 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-100 border-gray-300 text-gray-800'}`}>
              <h3 className="text-blue-600 text-lg font-medium mb-2">Suggestions for Improvement:</h3>
              <ul className="list-disc list-inside space-y-2">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className={`${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Additional Content Section */}
        <section className={`col-span-full rounded-lg shadow-md p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl font-light mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Why Password Complexity Matters</h2>
          <p className={`mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Using a strong, complex password is crucial for protecting your online accounts. A complex password helps prevent unauthorized access by making it difficult for attackers to guess or crack. Here's why complexity matters:
          </p>
          <ul className={`list-disc list-inside space-y-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            <li><strong>Prevents Brute Force Attacks:</strong> Complex passwords are harder for attackers to guess using automated tools.</li>
            <li><strong>Enhances Security:</strong> Using a mix of letters, numbers, and special characters reduces the likelihood of your password being compromised.</li>
            <li><strong>Protects Sensitive Information:</strong> Strong passwords safeguard personal, financial, and sensitive data from unauthorized access.</li>
          </ul>
        </section>

        {/* FAQ Section */}
        <section className={`col-span-full rounded-lg shadow-md p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl font-light mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>FAQ</h2>
          <div className="space-y-4">
            <div>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'} mb-2`}>What is a strong password?</h3>
              <p className={`${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>A strong password is one that is difficult to guess or crack. It typically includes a mix of uppercase and lowercase letters, numbers, and special characters, and is longer than eight characters.</p>
            </div>
            <div>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'} mb-2`}>How can I remember complex passwords?</h3>
              <p className={`${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>You can use a password manager to store and generate complex passwords securely. Alternatively, create a passphrase by combining random words or phrases that are easy for you to remember but hard for others to guess.</p>
            </div>
            <div>
              <h3 className={`text-lg font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'} mb-2`}>How often should I change my passwords?</h3>
              <p className={`${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>It is recommended to change your passwords regularly, especially if you suspect any security breach. For most users, changing passwords every 3-6 months is a good practice.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={`py-6 text-center text-lg ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-600'}`}>
        <p>© 2024 MutePass</p>
      </footer>
    </div>
  );
}

export default App;
