import React, { useState, useEffect } from 'react';
import {
  Waves,
  TreePine,
  Mountain,
  Loader2
} from 'lucide-react';
import './App.css';
import * as api from './api';

function App() {
  const [entry, setEntry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [sessionType, setSessionType] = useState('Forest');
  const [entries, setEntries] = useState([]);
  const [insights, setInsights] = useState(null);

  const fetchInsights = async () => {
    try {
      const data = await api.getInsights('123');
      setInsights(data);
    } catch (err) {
      console.error('Failed to fetch insights', err);
    }
  };

  const fetchEntries = async () => {
    try {
      const data = await api.getEntries('123');
      setEntries(data);
    } catch (err) {
      console.error('Failed to fetch entries', err);
    }
  };

  useEffect(() => {
    fetchEntries();
    fetchInsights();
  }, []);

  const handleAnalyze = async () => {
    if (!entry.trim()) return;

    setIsAnalyzing(true);
    setAnalysis('');
    setError('');

    try {
      const data = await api.analyzeText(entry);
      setAnalysis(data);

      try {
        await api.createEntry({
          userId: '123',
          text: entry,
          ambience: sessionType.toLowerCase(),
          analysis: data,
        });
        fetchEntries();
        fetchInsights();
      } catch (saveErr) {
        console.error('Failed to save entry', saveErr);
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || err.message || 'An unexpected error occurred.';
      setError(errorMsg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="layout">
      {/* Main Content */}
      <main className="main-content">
        <header className="page-header">
          <h1 className="welcome-title">Welcome  ,Sarah</h1>
          <p className="welcome-subtitle">Here's your emotional journey and recent nature sessions.</p>
        </header>


        {/* Top Section Grid */}
        <div className="top-grid">
          {/* Form Card */}
          <div className="form-card">
            <h2 className="form-title">Post-Session Reflection</h2>

            <div className="form-group">
              <span className="form-label">Select Session Type</span>
              <div className="toggles-group">
                <button
                  className={`toggle-btn ${sessionType === 'Forest' ? 'active' : ''}`}
                  onClick={() => setSessionType('Forest')}
                >
                  <TreePine size={18} />
                  Forest
                </button>
                <button
                  className={`toggle-btn ${sessionType === 'Ocean' ? 'active' : ''}`}
                  onClick={() => setSessionType('Ocean')}
                >
                  <Waves size={18} />
                  Ocean
                </button>
                <button
                  className={`toggle-btn ${sessionType === 'Mountain' ? 'active' : ''}`}
                  onClick={() => setSessionType('Mountain')}
                >
                  <Mountain size={18} />
                  Mountain
                </button>
              </div>
            </div>

            <div className="form-group">
              <textarea
                className="journal-input"
                placeholder={`How are you feeling after your ${sessionType.toLowerCase()} session?`}
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                disabled={isAnalyzing}
              />
              {error && <p className="error-text">{error}</p>}
            </div>

            <div className="form-footer">
              <span className="footer-text">AI will analyze this entry for insights.</span>
              <button
                className="submit-btn"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !entry.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="loader-icon" size={16} />
                    Analyzing...
                  </>
                ) : (
                  'Generate'
                )}
              </button>
            </div>

            {/* Analysis View (if any) */}
            {analysis && (
              <div className="json-results-box">
                <h3 className="results-header-text">LLM Emotion Analysis</h3>
                <div className="json-field">
                  <span className="field-label">Emotion:</span>
                  <span className="field-value highlight-emotion">{analysis.emotion}</span>
                </div>
                <div className="json-field">
                  <span className="field-label">Keywords:</span>
                  <div className="keywords-wrap">
                    {analysis.keywords?.map(kw => <span key={kw} className="keyword-pill">{kw}</span>)}
                  </div>
                </div>
                <div className="json-field">
                  <span className="field-label">Summary:</span>
                  <span className="field-value">{analysis.summary}</span>
                </div>
              </div>
            )}
          </div>

          {/* Insights Card */}
          {insights && (
            <div className="insights-summary-card">
              <h2 className="insights-headline">Insights</h2>
              <div className="insights-divider" />
              <div className="insights-info-row">
                <span className="info-label">Total Entries:</span>
                <span className="info-value">{insights.totalEntries}</span>
              </div>
              <div className="insights-info-row">
                <span className="info-label">Top Emotion:</span>
                <span className="info-value highlight-bold">{insights.topEmotion}</span>
              </div>
              <div className="insights-info-row">
                <span className="info-label">Most Used Ambience:</span>
                <span className="info-value highlight-bold">{insights.mostUsedAmbience}</span>
              </div>
              <div className="insights-info-row">
                <span className="info-label">Keywords:</span>
                <span className="info-value keywords-text">{insights.recentKeywords?.join(', ')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Previous Entries Section */}
        {entries.length > 0 && (
          <div className="entries-list">
            <h2 className="section-title">Previous Entries</h2>
            <div className="entries-grid">
              {entries.map((item) => (
                <div key={item._id} className="entry-card">
                  <div className="entry-header">
                    <span className="entry-badge">{item.ambience || item.sessionType}</span>
                    <span className="entry-date">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="entry-content">{item.text || item.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}


      </main>
    </div>
  );
}

export default App;
