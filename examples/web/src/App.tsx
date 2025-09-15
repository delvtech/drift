import { erc20 } from "@gud/drift";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useCopy } from "src/hooks/useCopy";
import { useDrift } from "src/hooks/useDrift";

const mainnetDai = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

function App() {
  const { copy, copied } = useCopy();
  const drift = useDrift();

  const {
    data,
    dataUpdatedAt,
    error,
    fetchStatus,
    isFetched,
    isFetching,
    status,
    refetch,
  } = useQuery({
    queryKey: ["home-data"],
    queryFn: drift
      ? async () => {
          return Promise.all([
            drift.getBlockNumber(),
            drift.read({
              abi: erc20.abi,
              address: mainnetDai,
              fn: "symbol",
            }),
            drift.read({
              abi: erc20.abi,
              address: mainnetDai,
              fn: "name",
            }),
            drift.read({
              abi: erc20.abi,
              address: mainnetDai,
              fn: "totalSupply",
            }),
          ]);
        }
      : undefined,
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Initialize Drift in the global window object so it can be accessed in the
  // dev tools console.
  useEffect(() => {
    (window as any).drift = drift;
  }, [drift]);

  const responseText =
    status === "error"
      ? String(error.stack)
      : JSON.stringify(
          data,
          (_, v) => (typeof v === "bigint" ? String(v) : v),
          2,
        );

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-h3 font-bold">Sandbox</h1>
        <div>
          <ConnectButton />
        </div>
      </div>

      <div>
        <p className="flex items-baseline gap-3">
          <span className="text-slate-400">Status: </span>
          <code
            className={
              status === "success"
                ? "text-green-500"
                : status === "error"
                  ? "text-red-500"
                  : "text-slate-300"
            }
          >
            {status} ({fetchStatus})
          </code>
        </p>

        <p className="flex items-baseline gap-3">
          <span className="text-slate-400">Last fetch: </span>
          <code>
            {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleString() : "-"}
          </code>
        </p>
      </div>

      <button
        className="h-10 cursor-pointer rounded-lg border border-teal-600 border-b-teal-700 bg-teal-950 bg-gradient-to-b from-teal-300/80 to-teal-500/80 px-4 font-bold text-slate-900 transition-all duration-100 not-disabled:hover:bg-teal-400 not-disabled:hover:shadow not-disabled:hover:shadow-slate-800 not-disabled:active:scale-[.99] not-disabled:active:shadow-none not-disabled:active:duration-75 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => refetch()}
        disabled={isFetching}
        type="button"
      >
        {isFetched ? "Refetch" : "Fetch"}
      </button>

      <div className="space-y-2">
        <h2 className="text-h4 font-bold">Response</h2>
        <div className="relative">
          {responseText && (
            <button
              type="button"
              className="group absolute top-3 right-3 flex cursor-pointer items-center rounded border border-current/60 p-1 opacity-40 transition-opacity duration-150 hover:opacity-100 active:scale-[.97] active:opacity-75 active:duration-75"
              title="Copy to clipboard"
              onClick={() => copy(responseText)}
            >
              <span className="text-caption m-0 w-0 overflow-hidden leading-none text-current opacity-0 transition-all duration-150 group-hover:w-auto group-hover:px-1 group-hover:opacity-100">
                {copied ? "copied!" : "copy"}
              </span>
              <svg
                role="graphics-symbol"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                className="size-5 fill-current"
              >
                <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12A1.5 1.5 0 0 1 17 6.622V12.5a1.5 1.5 0 0 1-1.5 1.5h-1v-3.379a3 3 0 0 0-.879-2.121L10.5 5.379A3 3 0 0 0 8.379 4.5H7v-1Z" />
                <path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L9.44 6.439A1.5 1.5 0 0 0 8.378 6H4.5Z" />
              </svg>
            </button>
          )}
          <SyntaxHighlighter
            className="text-caption rounded-lg border border-slate-800 leading-normal shadow-2xl shadow-slate-950"
            showLineNumbers={true}
            language={"json"}
            style={nightOwl}
            lineNumberStyle={{
              borderRight: "1px solid rgba(0,0,0,.5)",
              marginRight: "calc(var(--spacing) * 4)",
            }}
            customStyle={{
              padding: "calc(var(--spacing) * 4)",
            }}
          >
            {responseText}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}

export default App;
