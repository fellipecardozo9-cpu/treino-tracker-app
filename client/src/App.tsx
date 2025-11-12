import React from 'react';
import { Route, Switch } from 'wouter';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from './components/ui/toaster';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute'; // Importação corrigida

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import MasterAdminDashboard from './pages/MasterAdminDashboard';
import PersonalTrainerDashboard from './pages/PersonalTrainerDashboard';
import AssignWorkout from './pages/AssignWorkout';
import ForgotPassword from './pages/ForgotPassword';
import WorkoutTracking from './pages/WorkoutTracking';
import Statistics from './pages/Statistics';
import ExerciseDetail from './pages/ExerciseDetail';
import ExerciseManager from './pages/ExerciseManager';
import WorkoutManager from './pages/WorkoutManager';
import WorkoutDay from './pages/WorkoutDay';

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />
      
      {/* Rotas Protegidas */}
      <Route path="/master/dashboard" component={() => <ProtectedRoute component={MasterAdminDashboard} requiredRole="master" />} />
      <Route path="/personal/dashboard" component={() => <ProtectedRoute component={PersonalTrainerDashboard} requiredRole="personal" />} />
      <Route path="/personal/assign-workout/:studentId" component={({ params }) => <ProtectedRoute component={AssignWorkout} studentId={params.studentId} requiredRole="personal" />} />
      <Route path="/track/:workoutId" component={({ params }) => <ProtectedRoute component={WorkoutTracking} workoutId={params.workoutId} />} />
      <Route path="/" component={() => <ProtectedRoute component={Home} />} />
      <Route path="/statistics" component={() => <ProtectedRoute component={Statistics} />} />
      <Route path="/exercise/:name" component={({ params }) => <ProtectedRoute component={ExerciseDetail} exerciseName={decodeURIComponent(params.name)} />} />
      <Route path="/exercise-manager" component={() => <ProtectedRoute component={ExerciseManager} />} />
      <Route path="/workout-manager" component={() => <ProtectedRoute component={WorkoutManager} />} />
      <Route path="/workout/:day/:week" component={({ params }) => <ProtectedRoute component={WorkoutDay} day={params.day} week={parseInt(params.week)} />} />
      <Route path="/workout/:dayIndex" component={({ params }) => <ProtectedRoute component={WorkoutDay} dayIndex={parseInt(params.dayIndex)} />} />
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
