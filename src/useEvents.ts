import useSWR from "swr";

import { type Event, eventFetchSchema } from "~/server/zod";

export function useEvents({ isLive }: { isLive: boolean }) {
    const { data, error, isLoading } = useSWR<Event[], Error>('/api/events', async () => {
        const resp = await fetch('http://localhost:3000/api/events');
        const data = eventFetchSchema.parse(await resp.json());
        if (!data.success) throw new Error(data.error);
        return data.events!;
    }, { refreshInterval: isLive ? 1000 : 0 });

    return {
        data,
        isLoading,
        isError: !!error,
    };
}
