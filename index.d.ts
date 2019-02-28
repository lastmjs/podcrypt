declare var RSSParser: any;
declare var MediaMetadata: any;

type Episode = {
    guid: string;
    title: string;
    src: string;
    playing: boolean;
    finishedListening: boolean;
    progress: number;
}