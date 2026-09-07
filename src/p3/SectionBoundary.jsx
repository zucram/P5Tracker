import { Component } from 'react';

export default class SectionBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() { return { failed: true }; }

  render() {
    if (!this.state.failed) return this.props.children;
    return <section className="panel" role="alert">
      <h2>This section could not load</h2>
      <p>You can still use the other tabs. Check your connection, then reload the page to try again.</p>
      {this.props.saveWarning
        ? <p>Use Sync to download your current progress before reloading.</p>
        : <button onClick={() => window.location.reload()}>Reload page</button>}
    </section>;
  }
}
