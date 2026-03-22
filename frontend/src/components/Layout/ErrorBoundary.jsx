import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("App error boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F6F6F5] px-4">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 text-center max-w-md mb-6">
            Please refresh the page. If the problem continues, try again later.
          </p>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-[#4F8CFF] text-white font-medium"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
