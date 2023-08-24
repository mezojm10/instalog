import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

import { useEvents } from "~/useEvents";

import type { Event as IEvent } from "~/server/zod";
import { exportToCSV } from "~/exportCsv";

function formatDate(date: Date) {
  return `${date.toLocaleDateString("en-Gb", { month: "short" })} ${date.getDate()}, ${date.toLocaleTimeString([], { timeStyle: "short" })}`;
}

function Event({ event }: { event: IEvent }) {
  return (
    <div className="collapse collapse-arrow">
      <input type="radio" name="my-accordion-2" />
      <div className="flex flex-row w-full h-16 bg-neutral-50 align-middle justify-between collapse-title">
        <div className="flex flex-row w-1/4">
          <div className="w-8 h-8 mt-1 bg-gradient-to-br from-purple-600 to-rose-600 rounded-full">
            <div className="mx-3 my-2 text-white text-xs font-bold uppercase">{event.actorName.at(0)}</div>
          </div>
          <div className="mx-3 my-2 text-zinc-900 text-sm font-normal">
            {event.actorEmail}
          </div>
        </div>
        <div className="my-2 w-1/4 text-zinc-900 text-sm font-normal">
          {event.action.name}
        </div>
        <div className="my-2 w-1/4 text-zinc-900 text-sm font-normal">
          {formatDate(event.createdAt)}
        </div>
      </div>
      <div className="collapse-content">
        <div className="w-full h-72 flex flex-col">
          <div className="w-full flex flex-row justify-between">
            <div className="flex flex-col w-1/3">
              <p className="text-neutral-400 text-sm font-medium uppercase">Actor</p>
              <div className="flex flex-row justify-between mt-4">
                <p className="text-neutral-400 text-sm font-medium uppercase">Name</p>
                <p className="text-black text-sm font-normal">{event.actorName}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="text-neutral-400 text-sm font-medium uppercase">Email</p>
                <p className="text-black text-sm font-normal">{event.actorEmail}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="text-neutral-400 text-sm font-medium uppercase">Name</p>
                <p className="text-black text-sm font-normal">{event.actorId}</p>
              </div>
            </div>
            <div className="flex flex-col w-1/3 ml-4">
              <p className="text-neutral-400 text-sm font-medium uppercase">Action</p>
              <div className="flex flex-row justify-between mt-4">
                <p className="text-neutral-400 text-sm font-medium uppercase">Name</p>
                <p className="text-black text-sm font-normal">{event.action.name}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="text-neutral-400 text-sm font-medium uppercase">Object</p>
                <p className="text-black text-sm font-normal">event_action</p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="text-neutral-400 text-sm font-medium uppercase">ID</p>
                <p className="text-black text-sm font-normal">{event.action.id}</p>
              </div>
            </div>
            <div className="flex flex-col w-1/3 ml-4">
              <p className="text-neutral-400 text-sm font-medium uppercase">Date</p>
              <div className="flex flex-row justify-between mt-4">
                <p className="text-neutral-400 text-sm font-medium uppercase">Readable</p>
                <p className="text-black text-sm font-normal">{formatDate(event.createdAt)}</p>
              </div>
            </div>
          </div>
          <div className="w-2/3 flex flex-row justify-between">
            <div className="flex flex-col w-1/3 mt-4">
              <p className="text-neutral-400 text-sm font-medium uppercase">Target</p>
              <div className="flex flex-row justify-between mt-4">
                <p className="text-neutral-400 text-sm font-medium uppercase">Name</p>
                <p className="text-black text-sm font-normal">{event.targetName}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p className="text-neutral-400 text-sm font-medium uppercase">ID</p>
                <p className="text-black text-sm font-normal">{event.targetId}</p>
              </div>
            </div>
            <div className="flex flex-col w-1/3 ml-4 mt-4">
              <p className="text-neutral-400 text-sm font-medium uppercase">Metadata</p>
              {Object.keys(event.metadata ?? {}).map((key, idx) => (
                <div key={idx} className="flex flex-row justify-between mt-4">
                  <p className="text-neutral-400 text-sm font-medium uppercase">{key}</p>
                  <p className="text-black text-sm font-normal">{event.metadata && JSON.stringify((event.metadata as Record<string, unknown>)[key])}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default function Home() {
  const [isLive, setIsLive] = useState(false);
  const [searchQuery, setQuery] = useState("");
  const { data = [], isError, isLoading, size, setSize, mutate } = useEvents({ isLive, searchQuery });
  if (isLoading) return <span className="loading loading-spinner loading-lg" />;
  if (isError) return <div>Something went wrong</div>
  return (
    <>
      <Head>
        <title>Instalog</title>
        <meta name="description" content="Instant logging for your activities" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-white">
        <div className="w-9/12 h-3/4 bg-white rounded-2xl shadow border border-zinc-100">
          <div className="flex flex-col w-full h-20 top-left bg-neutral-100">

            <div className="flex flex-row h-11 rounded-lg border border-neutral-200 divide-x divide-solid divide-neutral-200">
              <input className="input input-ghost w-3/4" type="text" placeholder="Search name, email or action..." onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                mutate().catch(() => console.log("Something went wrong"));
                setQuery(e.currentTarget.value);
              }} />
              <div className="flex flex-row mr-auto cursor-pointer">
                <Image src="/filter.svg" alt="" width={15} height={8.5} />
                <div className="ml-2 mt-3 text-zinc-600 text-xs font-normal uppercase">Filter</div>
              </div>
              <div className="flex flex-row mr-auto cursor-pointer" onClick={() => exportToCSV(data)}>
                <Image src="/export.svg" alt="" width={15} height={8.5} />
                <div className="ml-2 mt-3 text-zinc-600 text-xs font-normal uppercase">Export</div>
              </div>
              <div className={"flex flex-row mr-auto cursor-pointer" + (isLive ? " bg-green-500" : "")} onClick={() => setIsLive(!isLive)}>
                <Image src="/live.svg" alt="" width={15} height={8.5} />
                <div className="ml-2 mt-3 text-zinc-600 text-xs font-normal uppercase">Live</div>
              </div>
            </div>
            <div className="flex flex-row w-full justify-evenly mt-2">
              <div className="w-1/3 h-4 ml-24 text-zinc-600 text-sm font-semibold uppercase">Actor</div>
              <div className="w-1/3 h-4 text-zinc-600 text-sm font-semibold uppercase">Action</div>
              <div className="w-1/3 h-4 pl-32 text-zinc-600 text-sm font-semibold uppercase">Date</div>
            </div>
          </div>
          {data.map(event => (
            <Event key={event.id} event={event} />
          ))}
          <div className="w-full h-12 bg-neutral-100 rounded-bl-xl rounded-br-xl">
            <button className="btn btn-neutral w-full bg-neutral-100" onClick={() => {
              setSize(size + 1).catch(() => { console.log("Something went wrong") });
            }}>Load more</button>
          </div>
        </div>
      </main>
    </>
  );
}
