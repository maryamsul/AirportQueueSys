import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
