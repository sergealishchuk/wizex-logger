import { _ } from '~/utils';
import { requireAuthRoutes } from "~/constants";

const needsAuthRoute = (pathname) => !!_.find(
  requireAuthRoutes,
  item => pathname.startsWith(item)
);

export default needsAuthRoute;
