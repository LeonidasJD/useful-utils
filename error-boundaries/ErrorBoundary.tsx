import React from "react";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
//**global error boundary wrapper around the <App/> */
type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center flex flex-col gap-5">
            <Text asChild variant="h1">
              <p>Ooops! Something went wrong</p>
            </Text>

            <Text asChild variant="p" color="gray">
              <p>An unexpected error occurred. </p>
            </Text>

            <div className="flex flex-row gap-3 mt-6 items-center justify-center">
              <Button
                onClick={() => window.location.reload()}
                variant="primary"
                size="md"
                className="w-full"
              >
                Try again
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-6">
              If the problem persists, contact technical support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
