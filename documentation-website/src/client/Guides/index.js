import Installation from './Installation';
import GettingStarted from './GettingStarted';
import AllAboutRoutes from './AllAboutRoutes';
import RenderingWithResponses from './RenderingWithResponses';
import UsingAddons from './UsingAddons';
import UsingSideEffects from './UsingSideEffects';
import ResponseCaching from './ResponseCaching';

const guides = [
  Installation,
  GettingStarted,
  AllAboutRoutes,
  RenderingWithResponses,
  UsingAddons,
  UsingSideEffects,
  ResponseCaching
];

export const byName = guides.reduce((acc, curr) => {
  acc[curr.slug] = curr;
  return acc;
}, {});

export default guides;