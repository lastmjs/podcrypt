import BigNumber from "../_snowpack/pkg/bignumberjs.js";
export function calculateTotalTimeForPodcastDuringIntervalInMilliseconds(state, podcast, previousPayoutDateInMilliseconds) {
  return podcast.episodeGuids.reduce((result, episodeGuid) => {
    const episode = state.episodes[episodeGuid];
    const timestampsDuringInterval = getTimestampsDuringInterval(podcast, episode.timestamps, previousPayoutDateInMilliseconds);
    return result.plus(timestampsDuringInterval.reduce((result2, timestamp, index) => {
      const nextTimestamp = timestampsDuringInterval[index + 1];
      const previousTimestamp = timestampsDuringInterval[index - 1];
      if (timestamp.type === "START") {
        if (nextTimestamp && nextTimestamp.type === "STOP") {
          return result2.minus(timestamp.milliseconds);
        } else {
          return result2.plus(0);
        }
      }
      if (timestamp.type === "STOP") {
        if (previousTimestamp && previousTimestamp.type === "START") {
          return result2.plus(timestamp.milliseconds);
        } else {
          return result2.plus(0);
        }
      }
      return new BigNumber(0);
    }, new BigNumber(0)));
  }, new BigNumber(0)).toString();
}
function getTimestampsDuringInterval(podcast, timestamps = [], previousPayoutDateInMilliseconds) {
  if (previousPayoutDateInMilliseconds === "NEVER") {
    return timestamps;
  }
  return timestamps.filter((timestamp) => {
    return new BigNumber(timestamp.milliseconds).gt(previousPayoutDateInMilliseconds) && new BigNumber(timestamp.milliseconds).lte(new Date().getTime());
  });
}
