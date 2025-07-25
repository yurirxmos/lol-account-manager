import React from "react";
import { AccountData } from "../utils/accountsManager";
import { formatEloData, getTierBorderColor, formatRoleName } from "../utils/gameUtils";
import { useChampion } from "../contexts/ChampionContext";
import { TbLoader2 } from "react-icons/tb";

interface GridCardProps {
  account: AccountData;
  index: number;
  onClick: (account: AccountData) => void;
  isLoadingElo: boolean;
}

const GridCard: React.FC<GridCardProps> = ({ account, index, onClick, isLoadingElo }) => {
  const { getChampionNameById, getChampionIcon } = useChampion();

  const isDataFresh = () => {
    if (!account.lastUpdated) return false;
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    return now - account.lastUpdated < twentyFourHours;
  };

  const getHoursFromUpdate = () => {
    if (!account.lastUpdated) return 0;
    const now = Date.now();
    return Math.floor((now - account.lastUpdated) / (1000 * 60 * 60));
  };

  return (
    <div
      key={index}
      onClick={() => onClick(account)}
      className={`bg-secondary border-b-5 rounded-lg shadow-md p-6 justify-center items-center max-w-xs w-50 h-70 flex flex-col hover:cursor-pointer hover:border-b-0 transition-all duration-50 relative ${getTierBorderColor(
        formatEloData(account.eloData).tier
      )} ${account.isLoading ? "opacity-60" : ""}`}
    >
      {account.isLoading && (
        <div className="absolute inset-0 bg-secondary/90 rounded-lg flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <TbLoader2 className="animate-spin w-8 h-8 text-primary" />
            <span className="text-xs text-primary">Loading data...</span>
          </div>
        </div>
      )}

      {account.lastUpdated && (
        <div className="absolute top-2 right-2">
          <div
            className={`w-2 h-2 rounded-full ${isDataFresh() ? "bg-green-400" : "bg-yellow-400"}`}
            title={`Data ${isDataFresh() ? "updated" : "outdated"} - ${getHoursFromUpdate()}h ago`}
          />
        </div>
      )}

      <div className="flex flex-col items-center text-sm font-semibold text-primary">
        {account.summonerName}
        <p className="opacity-30 text-xs font-normal">#{account.tagline}</p>
        {isLoadingElo && !account.eloData && <p className="text-xs text-blue-400 animate-pulse">Loading rank...</p>}
      </div>

      <div className="flex flex-row items-center justify-center gap-2 mt-4">
        {(() => {
          const eloInfo = formatEloData(account.eloData);
          return (
            <div className="flex flex-col items-center text-xs">
              <p className="text-xs font-bold">
                {eloInfo.tier === "UNRANKED" ? "UNRANKED" : `${eloInfo.tier} ${eloInfo.rank}`}
              </p>
              <p className="text-xs">{eloInfo.lp > 0 && ` ${eloInfo.lp} LP`}</p>
            </div>
          );
        })()}
      </div>

      <div className="flex flex-col items-center justify-center gap-2 mt-4">
        <p className="text-[8px]">MAIN ROLE</p>
        <p className="text-xs font-bold bg-background/50 px-2 py-1 rounded-md">
          {account.summonerLaneData?.mainRole ? formatRoleName(account.summonerLaneData.mainRole) : "FILL"}
        </p>
      </div>

      <div className="flex flex-row items-center justify-center gap-2 mt-4">
        {account.championMasteriesData && account.championMasteriesData.length > 0 ? (
          account.championMasteriesData.slice(0, 3).map((mastery, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-xs gap-1"
            >
              <img
                src={getChampionIcon(mastery.championId)}
                alt={`Champion ${mastery.championId}`}
                className="w-8 h-8 rounded-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://ddragon.leagueoflegends.com/cdn/15.13.1/img/champion/Ashe.png";
                }}
              />

              <p className="text-[8px] text-muted-foreground uppercase">{getChampionNameById(mastery.championId)}</p>
            </div>
          ))
        ) : (
          // Fallback para quando não há dados de maestria
          <>
            <p className="text-xs text-muted-foreground">Sem dados de maestria</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GridCard;
