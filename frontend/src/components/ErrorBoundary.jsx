import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true
    };
  }

  componentDidCatch(error) {
    console.log(error);
  }

  render() {
    if (
      this.state.hasError
    ) {
      return (
        <div className="loading-screen">
          <h1>
            UCCIS FAILURE
          </h1>

          <p>
            Operational UI
            crashed
          </p>

          <button
            className="signal-btn"
            onClick={() =>
              window.location.reload()
            }
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;