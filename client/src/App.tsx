import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import WorkoutDay from "./pages/WorkoutDay";
import Statistics from "./pages/Statistics";
import ExerciseDetail from "./pages/ExerciseDetail";
import ExerciseManager from "./pages/ExerciseManager";
import WorkoutManager from "./pages/WorkoutManager";
import MasterAdminDashboard from "./pages/MasterAdminDashboard";
import PersonalTrainerDashboard from "./pages/PersonalTrainerDashboard";
import WorkoutTracking from "./pages/WorkoutTracking";

function ProtectedRoute({ component: Component, requiredRole }: { component: React.ComponentType<any>, requiredRole?: 'master' | 'personal' | 'aluno' }) {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redireciona para a home se a role não for a requerida
    navigate('/');
    return null;
  }

  if (user?.role === 'personal' && user?.status === 'pendente') {
    // Tela de aguardando aprovação para Personal Trainer
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-yellow-500">Aguardando aprovação do Master Admin...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path={"/login"} component={Login} />
      <Route path={"/master/dashboard"} component={() => <ProtectedRoute component={MasterAdminDashboard} requiredRole="master" />} />
      <Route path={"/personal/dashboard"} component={() => <ProtectedRoute component={PersonalTrainerDashboard} requiredRole="personal" />} />
      <Route path={"/"} component={() => <ProtectedRoute component={Home} />} />
      <Route path={"/workout/:day/:week"} component={(props: any) => (
        <ProtectedRoute component={() => <WorkoutDay day={props.params.day} week={parseInt(props.params.week)} />} />
      )} />
      <Route path={"/track/:workoutId"} component={(props: any) => (
        <ProtectedRoute component={() => <WorkoutTracking workoutId={props.params.workoutId} />} />
      )} />
      <Route path={"/workout/:dayIndex"} component={(props: any) => (
        <ProtectedRoute component={() => <WorkoutDay dayIndex={parseInt(props.params.dayIndex)} />} />
      )} />
      <Route path={"/statistics"} component={() => <ProtectedRoute component={Statistics} />} />
      <Route path={"/exercise/:name"} component={(props: any) => (
        <ProtectedRoute component={() => <ExerciseDetail exerciseName={decodeURIComponent(props.params.name)} />} />
      )} />
      {/* Rotas de gerenciamento */}
      <Route path={"/exercise-manager"} component={() => <ProtectedRoute component={ExerciseManager} />} />
      <Route path={"/workout-manager"} component={() => <ProtectedRoute component={WorkoutManager} />} />
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
