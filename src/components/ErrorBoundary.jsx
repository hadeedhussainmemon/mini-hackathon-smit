import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Log to console and preserve info for display
    // In production you might send this to a monitoring service
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error', error, info)
    this.setState({ info })
  }

  handleReset = () => {
    try { localStorage.removeItem('lastPitch') } catch (e) {}
    try { window.__lastGeneratedPitch = undefined } catch (e) {}
    try { window.__currentPitch = undefined } catch (e) {}
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="max-w-3xl p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <pre className="text-sm text-gray-800 whitespace-pre-wrap mb-4">{String(this.state.error && this.state.error.toString())}</pre>
            {this.state.info && <details className="mb-4"><summary className="cursor-pointer text-blue-600">View stack</summary><pre className="text-xs text-gray-700 whitespace-pre-wrap">{this.state.info.componentStack}</pre></details>}
            <div className="flex gap-3">
              <button onClick={this.handleReset} className="px-4 py-2 bg-yellow-400 rounded">Reset app state</button>
              <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-500 text-white rounded">Reload</button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
