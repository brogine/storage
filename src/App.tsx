import CommandHistory from './components/CommandHistory/CommandHistory';
import CommandInput from './components/CommandInput/CommandInput';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <>
      <h1>Key-Value storage</h1>
      <ErrorBoundary><CommandInput /></ErrorBoundary>
      <ErrorBoundary><CommandHistory /></ErrorBoundary>
    </>
  );
}

export default App;
