import { erc20 } from "@delvtech/drift";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useQuery } from "@tanstack/react-query";
import { useDrift } from "src/hooks/useDrift";

const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

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
      ? async () => {
          const [chainId, blockNumber, walletCapabilities, callsResult] =
            await Promise.all([
              drift.getChainId(),
              drift.getBlockNumber(),
              drift.getWalletCapabilities?.(),
              drift.sendCalls?.({
                version: "2.0.0",
                calls: [
                  { abi: erc20.abi, address: daiAddress, fn: "name" },
                  { abi: erc20.abi, address: daiAddress, fn: "symbol" },
                ],
              }),
            ]);
          return { chainId, blockNumber, walletCapabilities, callsResult };
        }
      : undefined,
    enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (data) console.log("Data:", data);
  if (error) console.error(error);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1>Sandbox</h1>
        <div>
          <ConnectButton />
        </div>
      </div>

      <p className="flex gap-3 items-baseline">
        <strong>Status: </strong>
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

      <p>
        <strong>Last fetch: </strong>
        <code className="text-slate-300">
          {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleString() : "-"}
        </code>
      </p>

      <button
        className="h-10 rounded-lg border bg-teal-400 px-4 font-bold text-slate-800"
        onClick={() => refetch()}
        type="button"
      >
        {isFetched ? "Refetch" : "Fetch"}
      </button>

      <div>
        <h2>Data</h2>
        <textarea
          readOnly
          className="h-[500px] w-full rounded-lg bg-slate-800 p-6 font-mono text-white"
          value={JSON.stringify(
            data,
            (_, v) => (typeof v === "bigint" ? String(v) : v),
            2,
          )}
        />
      </div>

      <div>
        <h2>Error</h2>
        <textarea
          readOnly
          className="h-[500px] w-full rounded-lg bg-slate-800 p-6 font-mono text-white"
          value={JSON.stringify(
            String(error),
            (_, v) => (typeof v === "bigint" ? String(v) : v),
            2,
          )}
        />
      </div>
    </div>
  );
}

export default App;
