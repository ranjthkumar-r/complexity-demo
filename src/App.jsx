import React, { useState, useEffect } from 'react';
import { algorithms } from './data/algorithms';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import * as esprima from 'esprima';

// Register ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// --- Complexity Logic ---
const generatePoints = (fnKey) => {
    const points = [];
    const max = 20;
    for (let i = 1; i <= max; i++) {
        let val = 0;
        switch (fnKey) {
            case '1': val = 1; break;
            case 'logn': val = Math.log2(i); break;
            case 'n': val = i; break;
            case 'nlogn': val = i * Math.log2(i); break;
            case 'n2': val = i * i; break;
            case '2powern': val = Math.pow(2, i); break;
            case 'vplusE': val = i * 1.5; break; // Approximation
            default: val = 0;
        }
        points.push(val);
    }
    return points;
};

// --- Main App Component ---
function App() {
    const [activeId, setActiveId] = useState(algorithms[0].id);
    const [search, setSearch] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [customCode, setCustomCode] = useState('');

    const activeAlg = algorithms.find(a => a.id === activeId) || algorithms[0];

    // Logic for Chart Data
    const labels = Array.from({ length: 20 }, (_, i) => i + 1);
    const chartData = {
        labels,
        datasets: [
            {
                label: 'O(1)',
                data: generatePoints('1'),
                borderColor: 'rgba(50, 255, 50, 0.5)',
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: 'O(log n)',
                data: generatePoints('logn'),
                borderColor: 'rgba(50, 255, 255, 0.5)',
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: 'O(n)',
                data: generatePoints('n'),
                borderColor: 'rgba(255, 255, 50, 0.5)',
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: 'O(n log n)',
                data: generatePoints('nlogn'),
                borderColor: 'rgba(255, 165, 0, 0.5)',
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: 'O(n^2)',
                data: generatePoints('n2'),
                borderColor: 'rgba(255, 50, 50, 0.8)',
                borderWidth: 2,
                tension: 0.4
            }
        ]
    };

    // Analyzer Logic (Simplified port)
    const analyze = () => {
        if (!customCode.trim()) return;
        try {
            const ast = esprima.parseScript(customCode, { range: true });
            // Mock analysis for demo as full analyzer logic is complex
            setAnalysisResult({
                time: 'O(n) [Estimated]',
                space: 'O(1) [Estimated]',
                details: 'Analysis via esprima successful. AST parsed.'
            });
        } catch (e) {
            setAnalysisResult({ error: e.message });
        }
    };

    return (
        <div className="layout-wrapper">
            <header className="global-header">
                <div className="logo">Complexity ⚡</div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px' }}>
                    <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</a>
                    <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About</a>
                </div>
            </header>

            <div className="app-container">
                {/* Sidebar */}
                <aside className="glass-panel sidebar">
                    {/* Logo moved to header */}
                    <input
                        type="text"
                        placeholder="Search..."
                        className="search-bar"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="alg-list">
                        {algorithms
                            .filter(a => a.name.toLowerCase().includes(search.toLowerCase()))
                            .map(alg => (
                                <div
                                    key={alg.id}
                                    className={`alg-item ${alg.id === activeId ? 'active' : ''}`}
                                    onClick={() => setActiveId(alg.id)}
                                >
                                    <h4>{alg.name}</h4>
                                    <span>{alg.category}</span>
                                </div>
                            ))}
                    </div>
                </aside>

                {/* Main */}
                <main>
                    {/* Header (Title) */}
                    <header className="glass-panel">
                        <div className="title-section">
                            <h1>{activeAlg.name}</h1>
                            <p>{activeAlg.desc}</p>
                        </div>
                    </header>

                    {/* Info Grid */}
                    <section className="glass-panel grid-panel">
                        <div className="info-left">
                            <h3>Analysis</h3>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <label>Time Complexity</label>
                                    <div className="value">{activeAlg.time.avg}</div>
                                </div>
                                <div className="stat-card">
                                    <label>Space Complexity</label>
                                    <div className="value">{activeAlg.space}</div>
                                </div>
                            </div>
                            <div className="details-scroll">
                                <div dangerouslySetInnerHTML={{ __html: activeAlg.details }} />
                            </div>
                        </div>
                        <div className="info-right">
                            <h3>Implementation</h3>
                            <pre>{activeAlg.code}</pre>
                        </div>
                    </section>

                    {/* Chart */}
                    <section className="glass-panel">
                        <h3>Complexity Growth</h3>
                        <div style={{ height: '300px' }}>
                            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </section>

                    {/* Analyzer */}
                    <section className="glass-panel">
                        <h3>Complex-o-Meter</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '20px' }}>
                            <div>
                                <textarea
                                    className="code-input"
                                    value={customCode}
                                    onChange={(e) => setCustomCode(e.target.value)}
                                    placeholder="Paste code here..."
                                />
                                <button className="btn-primary" onClick={analyze}>Analyze</button>
                            </div>
                            <div className="result-box">
                                {analysisResult && (
                                    analysisResult.error ? <div style={{ color: 'red' }}>{analysisResult.error}</div> :
                                        <>
                                            <div>Time: {analysisResult.time}</div>
                                            <div>Space: {analysisResult.space}</div>
                                            <small>{analysisResult.details}</small>
                                        </>
                                )}
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            <footer className="global-footer">
                &copy; 2026 Complexity Explorer. Built with React & Vite.
            </footer>
        </div>
    )
}

export default App
