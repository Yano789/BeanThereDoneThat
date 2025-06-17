import { useState } from 'react';
import './App.css';
import ModuleReviewsPage from './components/ModuleReviewsPage';

function App() {
  const [currentModule, setCurrentModule] = useState('50.001'); // Default module

  return (
    <div className="app">
      <header className="app-header">
        <h1>SUTD Module Reviews</h1>
      </header>
      <main>
        <ModuleReviewsPage moduleCode={currentModule} />
      </main>
    </div>
  );
}

export default App;