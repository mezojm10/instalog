import useSWRInfinite, { type SWRInfiniteKeyLoader } from "swr/infinite";

import { type Event, eventFetchSchema } from "~/server/zod";

const getKey: SWRInfiniteKeyLoader = (pageIndex, previousPageData: Event[]) => {
    console.log(previousPageData);
    if (previousPageData && !previousPageData.length) return null;

    if (pageIndex === 0) return '/api/events?';

    return `/api/events?startAfter=${previousPageData.at(-1)?.id}&`;
}

export function useEvents({ isLive, searchQuery }: { isLive: boolean, searchQuery: string }) {
    const { data, error, isLoading, size, setSize, mutate } = useSWRInfinite<Event[], Error>(getKey, async (key) => {
        const isSearch = searchQuery.trim().length > 0;
        const resp = await fetch(`https://instalog-mezojm10.vercel.app${key}` + (isSearch ? `search=${searchQuery}` : ""));
        const data = eventFetchSchema.parse(await resp.json());
        if (!data.success) throw new Error(data.error);
        return data.events!;
    }, { refreshInterval: isLive ? 1000 : 0 });

    console.log(data);

    return {
        data: data?.flat(),
        isLoading,
        isError: !!error,
        size,
        setSize,
        mutate,
    };
}
