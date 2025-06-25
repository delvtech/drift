import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useQuery } from "@tanstack/react-query";
import SyntaxHighlighter from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useDrift } from "src/drift/viem/useDrift";
import { useCopy } from "src/hooks/useCopy";

// const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

function App() {
  const drift = useDrift();
  const {
    data,
    dataUpdatedAt,
    error,
    fetchStatus,
    isFetched,
    status,
    refetch,
  } = useQuery({
    queryKey: ["home-data", typeof drift?.getWalletCapabilities],
    queryFn: drift
      ? async () =>
          Promise.all([
            drift.getChainId(),
            drift.getBlockNumber(),
            drift.getWalletCapabilities?.(),
            // drift.sendCalls?.({
            //   calls: [
            //     { abi: erc20.abi, address: daiAddress, fn: "name" },
            //     { abi: erc20.abi, address: daiAddress, fn: "symbol" },
            //   ],
            // }),
          ])
      : undefined,
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const { copy, copied } = useCopy();

  if (data) console.log("Data:", data);
  if (error) console.error(error);

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
      <div className="flex justify-between items-center">
        <h1 className="text-h3 font-bold">Sandbox</h1>
        <div>
          <ConnectButton />
        </div>
      </div>

      <div>
        <p className="flex gap-3 items-baseline">
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

        <p className="flex gap-3 items-baseline">
          <span className="text-slate-400">Last fetch: </span>
          <code>
            {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleString() : "-"}
          </code>
        </p>
      </div>

      <button
        className="h-10 rounded-lg px-4 font-bold text-slate-900 cursor-pointer bg-gradient-to-b from-teal-300 to-teal-500 active:scale-[.99] transition-all hover:shadow hover:shadow-slate-800 active:shadow-none duration-75 border border-teal-600 border-b-teal-700"
        onClick={() => refetch()}
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
              className="absolute group right-3 top-3 opacity-40 border rounded border-current/60 hover:opacity-100 transition-opacity duration-150 p-1 cursor-pointer active:scale-[.97] active:opacity-75 active:duration-75 flex items-center"
              title="Copy to clipboard"
              onClick={() => copy(responseText)}
            >
              <span className="group-hover:px-1 group-hover:w-auto text-caption opacity-0 text-current group-hover:opacity-100 w-0 m-0 transition-all duration-150 leading-none overflow-hidden">
                {copied ? "copied!" : "copy"}
              </span>
              <svg
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
            className="shadow-2xl shadow-slate-950 text-caption leading-normal rounded-lg border-slate-800 border"
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
