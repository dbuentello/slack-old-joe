import { appState } from './state';

/**
 * The top-level class controlling the whole app. This is *not* a React component,
 * but it does eventually render all components.
 *
 * @class App
 */
export class Root {
  constructor() {
    this.setup();
  }

  /**
   * Initial setup call, loading Monaco and kicking off the React
   * render process.
   */
  public async setup(): Promise<void | Element | React.Component> {
    const React = await import('react');
    const { render } = await import('react-dom');
    const { App } = await import('./app');

    const className = `${process.platform} container`;
    const app = (
      <div className={className}>
        <App appState={appState} />
      </div>
    );

    const rendered = render(app, document.getElementById('app'));

    return rendered;
  }
}

(window as any).OldJoe = new Root();