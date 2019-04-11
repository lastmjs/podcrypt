export const color1Full = `rgba(251, 133, 69, 1)`;
export const color1Medium = `rgba(251, 133, 69, .75)`;
export const color1Light = `rgba(251, 133, 69, .5)`;

export const color2Full = `rgba(69, 181, 251, 1)`;
export const color3Full = `rgba(251, 224, 69, 1)`;
export const color4Full = `rgba(196, 69, 251, 1)`;

export const colorBlackFull = `rgba(0, 0, 0, 1)`;
export const colorBlackMedium = `rgba(0, 0, 0, .75)`;
export const colorBlackLight = `rgba(0, 0, 0, .5)`;
export const colorBlackVeryLight = `rgba(0, 0, 0, .05)`;
export const colorBlackFaint = `rgba(0, 0, 0, .01)`;

export const bottomShadow = `-5px 5px 5px -5px grey`;
export const normalShadow = `0px 0px 1px grey`;

export const one = `1`;

export const pxXXXSmall = `calc(1vmin)`;
export const pxXXSmall = `calc(4px + 1vmin)`;
export const pxXSmall = `calc(8px + 1vmin)`;
export const pxSmall = `calc(12px + 1vmin)`;
export const pxMedium = `calc(16px + 1vmin)`;
export const pxLarge = `calc(20px + 1vmin)`;
export const pxXLarge = `calc(24px + 1vmin)`;

export const pcContainerStyles = `
    height: 100%;
    padding-left: ${pxMedium};
    padding-right: ${pxMedium};
    padding-top: calc(75px + 1vmin);
    padding-bottom: calc(150px + 1vmin);
    overflow-y: auto;
`;

export const titleTextLarge = `
    font-family: Ubuntu;
    font-size: ${pxLarge};
`;

export const titleTextXLarge = `
    font-family: Ubuntu;
    font-size: ${pxXLarge};
`;

export const secondaryTextMedium = `
    font-family: Ubuntu;
    font-size: ${pxMedium};
    color: ${colorBlackMedium};
`;

export const standardTextContainer = `
    font-size: ${pxSmall};
    font-family; Ubuntu;
    background-color: white;
    padding: ${pxXSmall};
    border-radius: ${pxXXXSmall};
    box-shadow: ${normalShadow};
    color: ${colorBlackMedium};
    overflow-wrap: break-word;
`;