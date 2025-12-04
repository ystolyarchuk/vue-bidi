import { type App } from 'vue';
import { vBidi } from './directives/vBidi';

/**
 * Vue plugin for vue-bidi
 * 
 * @example
 * ```ts
 * import { createApp } from 'vue';
 * import VueBidi from 'vue-bidi';
 * 
 * const app = createApp(App);
 * app.use(VueBidi);
 * ```
 */
export default {
  install(app: App) {
    app.directive('bidi', vBidi);
  },
};

