import { appState } from './state';
import { JoeBrowserObject } from '../interfaces';
import { registerHelpers } from './helpers';

/**
 * The top-level class controlling the whole app. This is *not* a React component,
 * but it does eventually render all components.
 *
 * @class App
 */
export class Root {
  constructor() {
    this.setup();
    registerHelpers();
  }

  /**
   * Initial setup call, loading Monaco and kicking off the React
   * render process.
   */
  public async setup(): Promise<void | Element | React.Component> {
    localStorage.debug = '*';

    const React = await import('react');
    const { render } = await import('react-dom');
    const { App } = await import('./components/app');

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

declare global {
  interface Window {
    OldJoe: Root;
    client: JoeBrowserObject;
  }
}

window.OldJoe = new Root();
