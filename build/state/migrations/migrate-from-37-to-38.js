export function migrateFrom37To38(state37) {
  return {
    ...state37,
    version: 38,
    episodes: Object.entries(state37.episodes).reduce((result, entry) => {
      const episodeKey = entry[0];
      const episode = entry[1];
      const newEpisode = {
        ...episode,
        downloadProgressPercentage: episode.downloadState === "DOWNLOADED" ? 100 : 0
      };
      return {
        ...result,
        [episodeKey]: newEpisode
      };
    }, {})
  };
}
