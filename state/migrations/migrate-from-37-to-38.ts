export function migrateFrom37To38(state37: Readonly<State>): Readonly<State> {
    return {
        ...state37,
        version: 38,
        episodes: Object.entries(state37.episodes).reduce((result, entry) => {
            const episodeKey: EpisodeGuid = entry[0];
            const episode: Readonly<Episode> = entry[1];

            const newEpisode: Readonly<Episode> = {
                ...episode,
                downloadProgressPercentage: episode.downloadState === 'DOWNLOADED' ? 100 : 0
            }

            return {
                ...result,
                [episodeKey]: newEpisode
            };
        }, {})
    };
}