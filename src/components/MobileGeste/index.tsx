import {
  GesteListenerEvents,
  GesteEventListenerConfig,
  GesteListenerObj,
} from './interfaces';
import GesteEventListener from './GesteEventListener';
import TFOM from './TFOM';


const addGesteEventListener = (el: HTMLElement, listenerObj: GesteListenerEvents, config?: GesteEventListenerConfig): GesteListenerObj => {
  const gel = new GesteEventListener(el, listenerObj, config);
  return {
    destory: () => {
      gel.destory();
    },
  }
}

export default {
  addGesteEventListener,
  TFOM,
};