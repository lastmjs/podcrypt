export function migrateFrom36To37(state36) {
  return {
    ...state36,
    version: 37,
    episodes: Object.entries(state36.episodes).reduce((result, entry) => {
      const episodeKey = entry[0];
      const episode = entry[1];
      const newEpisode = {
        ...episode,
        downloadChunkData: []
      };
      return {
        ...result,
        [episodeKey]: newEpisode
      };
    }, {})
  };
}
