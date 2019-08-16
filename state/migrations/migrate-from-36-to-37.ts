export function migrateFrom36To37(state36: Readonly<State>): Readonly<State> {
    return {
        ...state36,
        version: 37,
        episodes: Object.entries(state36.episodes).reduce((result, entry) => {
            const episodeKey: EpisodeGuid = entry[0];
            const episode: Readonly<Episode> = entry[1];

            const newEpisode: Readonly<Episode> = {
                ...episode,
                downloadChunkData: []
            }

            return {
                [episodeKey]: newEpisode
            };
        }, {})
    };
}