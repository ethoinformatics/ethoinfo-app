import _ from 'lodash';
import moment from 'moment';
import { action, observable } from 'mobx';


/**
 * Simple class for measuring time.
 *
 *
 * @class Timer
 */
export default class Timer {
  @observable elapsed;
  @observable isRunning;

  constructor(callbackFn) {
    this.isRunning = false;
    this.elapsed = 0;
    this.timeoutId = null;
    this.callbackFn = callbackFn;
  }

  @action measure(interval) {
    if (!this.isRunning) { return; }
    this.elapsed = moment().diff(this.startTime);

    // If user passed a valid callback function, call it with elapsed time
    if (_.isFunction(this.callbackFn)) this.callbackFn(this.elapsed);

    // Recurse
    this.timeoutId = setTimeout(() => this.measure(interval), interval);
  }

  // Run timer at interval (ms)
  @action run(interval) {
    if (this.isRunning) return;
    this.elapsed = 0;
    this.isRunning = true;
    this.startTime = moment();
    this.measure(interval);
  }

  @action stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.elapsed = 0;
    this.isRunning = false;
  }
}
