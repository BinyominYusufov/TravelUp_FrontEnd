import { useQuery } from '@tanstack/react-query';
import { destinationsApi, type Destination } from '@/lib/api';

export const useDestinationById = (id: string) => {
  return useQuery<Destination, Error>({
    queryKey: ['destination', id],
    queryFn: () => destinationsApi.get(id),
    enabled: !!id, // Only run query if id is provided
  });
};
