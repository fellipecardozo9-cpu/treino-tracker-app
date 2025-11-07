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

function ProtectedRoute({ component: Component }: { component: React.ComponentType<any> }) {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

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

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path={"/login"} component={Login} />
      <Route path={"/"} component={() => <ProtectedRoute component={Home} />} />
      <Route path={"/workout/:day/:week"} component={(props: any) => (
        <ProtectedRoute component={() => <WorkoutDay day={props.params.day} week={parseInt(props.params.week)} />} />
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
