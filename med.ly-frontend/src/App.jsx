import { BrowserRouter } from 'react-router';
import { AuthProvider } from './services/authContext';
import Pages from './pages';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Pages />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;