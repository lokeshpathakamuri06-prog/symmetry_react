// Loaded after first paint by <LazyMotion> in App: the animation engine stays out of the
// critical path. domMax (not domAnimation) because the carousels use layoutId.
export { domMax as default } from 'framer-motion';
