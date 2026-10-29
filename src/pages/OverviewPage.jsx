import { useState } from "react";
import { CalendarDays, CalendarX, Flag, Info, MapPin } from "lucide-react";
import PageHeader from "../components/layout/PageHeader.jsx";
import Card, { CardHeader } from "../components/ui/Card.jsx";
import DataSourceBadge from "../components/ui/DataSourceBadge.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import ErrorState from "../components/ui/ErrorState.jsx";
import Select from "../components/ui/Select.jsx";
import SummaryCardGrid from "../components/overview/SummaryCardGrid.jsx";
import Leaderboard, { LeaderboardSkeleton } from "../components/overview/Leaderboard.jsx";
import PositionsChart from "../components/overview/PositionsChart.jsx";
import { useRaceResults, useRaces, useSeasons } from "../hooks/useF1Data.js";
import { formatDate } from "../lib/format.js";

export default function OverviewPage() {
  const seasons = useSeasons();
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedRaceId, setSelectedRaceId] = useState(null);

  // Derive effective selections so no effect is needed when data arrives
  // or when a season change invalidates the chosen race.
  const season = selectedSeason ?? seasons.data?.[0] ?? null;
  const races = useRaces(season);
  // Default to the most recent completed race of the season.
  const race =
    races.data?.find((item) => item.id === selectedRaceId) ??
    races.data?.[races.data.length - 1] ??
    null;
  const results = useRaceResults(race?.id ?? null);

  // The first failing request is shown, and Retry reruns exactly that one.
  const failed = [seasons, races, results].find((request) => request.error);
  const error = failed?.error ?? null;

  const source = results.source ?? races.source ?? seasons.source;
  const provider = (results.meta ?? races.meta ?? seasons.meta)?.provider;
  const warnings = results.meta?.warnings ?? [];
  const lapCount =
    race?.laps ?? results.data?.find((row) => row.position === 1)?.laps ?? null;
  const noRaces = races.data !== null && races.data.length === 0;

  const handleSeasonChange = (value) => {
    setSelectedSeason(Number(value));
    setSelectedRaceId(null);
  };

  const selectors = (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[8rem_minmax(0,1fr)] lg:w-[34rem]">
      <Select
        label="Season"
        value={season ?? ""}
        onChange={handleSeasonChange}
        disabled={!seasons.data}
        options={(seasons.data ?? []).map((year) => ({
          value: year,
          label: String(year),
        }))}
      />
      <Select
        label="Grand Prix"
        value={race?.id ?? ""}
        onChange={setSelectedRaceId}
        disabled={!races.data || noRaces}
        options={(races.data ?? []).map((item) => ({
          value: item.id,
          label: `R${item.round} · ${item.name}`,
        }))}
      />
    </div>
  );

  let body;
  if (error) {
    body = (
      <Card>
        <ErrorState message={error.message} onRetry={failed.retry} />
      </Card>
    );
  } else if (noRaces) {
    body = (
      <Card>
        <EmptyState
          icon={CalendarX}
          title={`No completed races in ${season} yet`}
          description="Only races that have already taken place are listed. Pick another season."
        />
      </Card>
    );
  } else {
    body = (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-ink">
              {race ? `${race.season} ${race.name}` : "Loading race…"}
            </h2>
            {race && (
              <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin aria-hidden="true" className="size-3.5" />
                  {[race.circuit, race.country].filter(Boolean).join(", ") ||
                    "Venue unknown"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays aria-hidden="true" className="size-3.5" />
                  {formatDate(race.date)}
                </span>
                {lapCount != null && (
                  <span className="inline-flex items-center gap-1.5">
                    <Flag aria-hidden="true" className="size-3.5" />
                    {lapCount} laps
                  </span>
                )}
              </p>
            )}
          </div>
          {source && <DataSourceBadge source={source} provider={provider} />}
        </div>

        {source === "demo" && (
          <p
            role="note"
            className="rounded-lg border border-demo/30 bg-demo/5 px-4 py-3 text-sm text-ink-muted"
          >
            <strong className="font-semibold text-demo">Demo data.</strong> Driver, team
            and circuit names are real, but finishing orders, gaps, points and lap times
            are fabricated samples. They are not official results.
          </p>
        )}

        {warnings.length > 0 && (
          <div
            role="note"
            className="flex items-start gap-2 rounded-lg border border-line-strong bg-surface px-4 py-3 text-sm text-ink-muted"
          >
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ink-dim" />
            <ul>
              {warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        <SummaryCardGrid results={results.data} isLoading={results.isLoading || !race} />

        <Card>
          <CardHeader
            title="Driver leaderboard"
            description="Final classification. +/− shows positions gained or lost from the grid."
          />
          {results.data ? (
            <Leaderboard results={results.data} />
          ) : (
            <LeaderboardSkeleton />
          )}
        </Card>

        <Card>
          <CardHeader
            title="Grid vs. finish"
            description="Positions gained or lost by each classified driver."
          />
          <div className="p-4">
            {results.data ? (
              <PositionsChart results={results.data} />
            ) : (
              <div className="h-80" />
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Race results"
        description="Browse historical race classifications and key performance indicators by season and Grand Prix."
        actions={selectors}
      />
      {body}
    </>
  );
}
