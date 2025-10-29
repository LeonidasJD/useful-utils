import { useRouteError, useNavigate } from "react-router-dom";
import { Button } from "@/shared/global-components/ui/button";
import { Text } from "@/shared/global-components/ui/text";

//**Route error fallback component is for errorElement: <RouteErrorFallback />, in the routes.tsx file */
const RouteErrorFallback = () => {
  const error = useRouteError() as Error;
  const navigate = useNavigate();

  const isDev = import.meta.env.DEV;

  const handleGoHome = () => {
    navigate("/");
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center flex flex-col gap-5">
        <Text asChild variant="h1">
          <p>Ooops! Something went wrong</p>
        </Text>

        <Text asChild variant="p" color="gray">
          <p>An unexpected error occurred. </p>
        </Text>

        {isDev && error?.message && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-6 mt-4">
            <p className="text-sm text-red-800 font-mono text-left">
              <strong>Dev Info:</strong> {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-row gap-3 mt-6 items-center justify-center">
          <Button
            onClick={handleReload}
            variant="primary"
            size="md"
            className="w-full"
          >
            Try again
          </Button>
          <Text asChild variant="p" color="gray">
            <p>OR</p>
          </Text>
          <Button
            onClick={handleGoHome}
            variant="secondary"
            size="md"
            className="w-full"
          >
            Go to home
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          If the problem persists, contact technical support.
        </p>
      </div>
    </div>
  );
};

export default RouteErrorFallback;
