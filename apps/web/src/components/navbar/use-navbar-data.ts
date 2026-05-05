import useSWR from "swr";

import type { NavigationData } from "@/types";

const fetcher = async (url: string): Promise<NavigationData> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch navigation data");
  }
  return response.json();
};

/** SWR hook for live-revalidating navbar + settings data. */
export function useNavbarData(initial: NavigationData) {
  const { data, error } = useSWR<NavigationData>("/api/navigation", fetcher, {
    fallbackData: initial,
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: true,
    refreshInterval: 30_000,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
  });

  return { data: data || initial, error };
}
