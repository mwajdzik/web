import {Config} from '@stencil/core';

export const config: Config = {
  namespace: 'mycomponent',
  outputTargets: [
    {
      type: 'dist'
    },
    // useful when with create a static page with StencilJS only:
    {
      type: 'www',
      serviceWorker: null
    }
  ]
};
