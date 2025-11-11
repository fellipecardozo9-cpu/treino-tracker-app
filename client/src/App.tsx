import React from 'react';
import { Route, Switch } from 'wouter';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from './components/ui/toaster'; // CORRIGIDO: Importação do Toaster
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import MasterAdminDashboard from './pages/MasterAdminDashboard';
import PersonalTrainerDashboard from './pages/PersonalTrainerDashboard';
import AssignWorkout from './pages/AssignWorkout';
import ForgotPassword from './pages/ForgotPassword';
import WorkoutTracking from './pages/WorkoutTracking';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      
      {/* Rotas Protegidas */}
      <Route path="/master/dashboard" component={() => <ProtectedRoute component={MasterAdminDashboard} />} />
      <Route path="/personal/dashboard" component={() => <ProtectedRoute component={PersonalTrainerDashboard} />} />
      <Route path="/personal/assign-workout/:studentId" component={({ params }) => <ProtectedRoute component={AssignWorkout} studentId={params.studentId} />} />
      <Route path="/track/:workoutId" component={({ params }) => <ProtectedRoute component={WorkoutTracking} workoutId={params.workoutId} />} />

      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
