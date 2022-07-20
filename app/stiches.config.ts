import { createStitches } from '@stitches/react';

type Color = {
    hue: number,
    saturation: number,
    lightness: number,
};
type Colors = 'brand'|'primary'|'secondary'|'red'|'orange'|'yellow'|'green'|'cyan'|'blue'|'purple'|'pink';
type ColorObject = { [C in Colors]: { bg: { normal: Color, active: Color }, fg: { normal: Color, active: Color } } };
type DerivedColorObject = {
    [C in Colors as `${C}Bg`]: string,
    [C in Colors as `${C}Bg-hsl`]: string,
    [C in Colors as `${C}BgA`]: string,
    [C in Colors as `${C}BgA-hsl`]: string,
    [C in Colors as `${C}Fg`]: string,
    [C in Colors as `${C}Fg-hsl`]: string,
    [C in Colors as `${C}Fga`]: string,
    [C in Colors as `${C}Fga-hsl`]: string,
};
type ThemeColors = {
    color: ColorObject,
    text: Color[],
    surface: Color[],
    shadow: string[],
};

type ColorSettings = {
    hue?: number,
    saturation?: number,
    lightness?: number,
    step?: number,
    bias?: number,
    factor?: 1|-1,
};
type ThemeSettings = {
    base: ColorSettings,
    shadow?: { strength?: number },
    text?: ColorSettings,
    surface?: ColorSettings,
}&{
    [C in Colors]?: ColorSettings;
};

const hslStr = ({ hue, saturation, lightness }: Color) => `${hue}deg ${Math.round(100 * saturation)}% ${Math.round(100 * lightness)}%`;
const hsl = (color: Color) => `hsl(${hslStr(color)})`;
const asObject = (colors: ColorObject) => Array.from(Object.entries(colors)).reduce((obj, [ name, color ]) => ({
    ...obj,
    [`${name}Bg`]: hsl(color.bg.normal),
    [`${name}Bg-hsl`]: hslStr(color.bg.normal),
    [`${name}BgA`]: hsl(color.bg.active),
    [`${name}BgA-hsl`]: hslStr(color.bg.active),
    [`${name}Fg`]: hsl(color.fg.normal),
    [`${name}Fg-hsl`]: hslStr(color.fg.normal),
    [`${name}FgA`]: hsl(color.fg.active),
    [`${name}FgA-hsl`]: hslStr(color.fg.active),
}), {}) as DerivedColorObject;
const createThemeColors = ({ base: { hue = 0, saturation = .5, lightness = .5, bias = .2, factor = 1 }, ...settings }: ThemeSettings): ThemeColors => {
    // Brand
    const brandSaturation = settings.brand?.saturation ?? 0;
    const brandLightness = settings.brand?.lightness ?? 0;
    const accentOffset = 30;

    // Color
    const grabColorValues = (hue: number, saturationBias: number, lightnessBias: number, foreground: boolean, active: boolean) => ({
        hue,
        saturation: saturation + saturationBias,
        lightness: lightness + lightnessBias + (factor * (foreground ? -1 : 1) * ((((active ? factor : -factor) / 2) + 1.5) * bias)),
    });
    const grabColor = (hue: number, saturationBias: number = 0, lightnessBias: number = 0) => ({
        bg: {
            normal: grabColorValues(hue, saturationBias, lightnessBias, false, false),
            active: grabColorValues(hue, saturationBias, lightnessBias, false, true),
        },
        fg: {
            normal: grabColorValues(hue, saturationBias, lightnessBias, true, false),
            active: grabColorValues(hue, saturationBias, lightnessBias, true, true),
        },
    });
    const color = {
        brand: grabColor(hue, brandSaturation, brandLightness),
        primary: grabColor(hue + (180 + accentOffset), brandSaturation, brandLightness),
        secondary: grabColor(hue - (180 + accentOffset), brandSaturation, brandLightness),
        red: grabColor(0),
        orange: grabColor(20),
        yellow: grabColor(50),
        green: grabColor(120),
        emerald: grabColor(150),
        cyan: grabColor(180),
        blue: grabColor(220),
        purple: grabColor(260),
        pink: grabColor(300),
    };

    // Text
    const textSaturation = settings.text?.saturation ?? .2;
    const textLightness = settings.text?.lightness ?? .1;
    const textBias = settings.text?.bias ?? 0;
    const textFactor = settings.text?.factor ?? 1;

    const text = new Array(2).fill('').map((_, i) => ({
        hue,
        saturation: 1 * (textSaturation / (i + 1)),
        lightness: 1 * textLightness + (i * textFactor * .2) - (textFactor * textBias),
    }))

    // Surfaces
    const surfaceSaturation = settings.surface?.saturation ?? .1;
    const surfaceLightness = settings.surface?.lightness ?? .975;
    const surfaceBias = settings.surface?.bias ?? 0;
    const surfaceFactor = settings.surface?.factor ?? 1;
    const surfaceStep = settings.surface?.step ?? .025;

    const surface = new Array(4).fill('').map((_, i) => ({
        hue,
        saturation: 1 * surfaceSaturation,
        lightness: 1 * surfaceLightness - (surfaceFactor * surfaceStep * i) + (surfaceFactor * surfaceBias),
    }));

    // Shadows
    const shadowHsl = `${hue} 3% 15%`;
    const shadowStrength = settings.shadow?.strength ?? 1;

    const shadow = [
        `0 .1em .15em -.1em hsl(${shadowHsl} / ${shadowStrength + 9}%)`,

        `
        0 .2em .3em -.15em hsl(${shadowHsl} / ${shadowStrength + 3}%),
        0 .4em .9em -.3em hsl(${shadowHsl} / ${shadowStrength + 5}%)
        `,

        `
        0 .2em .3em -.15em hsl(${shadowHsl} / ${shadowStrength + 3}%),
        0 .4em .9em -.3em hsl(${shadowHsl} / ${shadowStrength + 5}%),
        0 0 1em 0 hsl(${shadowHsl} / ${shadowStrength + 15}%)
        `,

        `
        0 -.1em 2em 0 hsl(${shadowHsl} / ${shadowStrength + 2}%),
        0 .1em .15em -.275em hsl(${shadowHsl} / ${shadowStrength + 2}%),
        0 .15em .3em -.3em hsl(${shadowHsl} / ${shadowStrength + 4}%),
        0 .25em .7em -.3em hsl(${shadowHsl} / ${shadowStrength + 5}%),
        0 .7em .95em -.3em hsl(${shadowHsl} / ${shadowStrength + 7}%)
        `,

        `
        0 -.15em .3em 0 hsl(${shadowHsl} / ${shadowStrength + 2}%),
        0 .1em .1em -.15em hsl(${shadowHsl} / ${shadowStrength + 3}%),
        0 .15em .15em -.15em hsl(${shadowHsl} / ${shadowStrength + 3}%),
        0 .3em .3em -.15em hsl(${shadowHsl} / ${shadowStrength + 4}%),
        0 .55em .55em -.15em hsl(${shadowHsl} / ${shadowStrength + 5}%),
        0 1em 1em -.15em hsl(${shadowHsl} / ${shadowStrength + 6}%)
        `,
    ]

    return {
        color,
        text,
        surface,
        shadow,
    }
};

const hue = 265;
const lightThemeColors = createThemeColors({
    base: { hue, saturation: .7, lightness: .5, bias: .075, factor: 1 },
    brand: { lightness: .15 },
    surface: { factor: 1 },
});
const darkThemeColors = createThemeColors({
    base: { hue, saturation: .8, lightness: .5, bias: .075, factor: -1 },
    brand: { saturation: 0, lightness: .15 },
    text: { lightness: .9, factor: -1 },
    surface: { saturation: .005, lightness: .2, factor: -1, step: .075 },
    shadow: { strength: 75 },
});

export const {
    styled,
    css,
    globalCss,
    keyframes,
    getCssText,
    theme,
    createTheme,
    config,
} = createStitches({
    theme: {
        colors: {
            ...asObject(lightThemeColors.color),

            text1: hsl(lightThemeColors.text[0]),
            'text1-hsl': hslStr(lightThemeColors.text[0]),
            text2: hsl(lightThemeColors.text[1]),
            'text2-hsl': hslStr(lightThemeColors.text[1]),
            surface1: hsl(lightThemeColors.surface[0]),
            'surface1-hsl': hslStr(lightThemeColors.surface[0]),
            surface2: hsl(lightThemeColors.surface[1]),
            'surface2-hsl': hslStr(lightThemeColors.surface[1]),
            surface3: hsl(lightThemeColors.surface[2]),
            'surface3-hsl': hslStr(lightThemeColors.surface[2]),
            surface4: hsl(lightThemeColors.surface[3]),
            'surface4-hsl': hslStr(lightThemeColors.surface[3]),
        },
        fonts: {
            sans: 'Segoe UI'
        },
        sizes: {
            thin: '1px',
            fill: '100%',
        },
        fontSizes: {
            tiny: '.6rem',
            small: '.85rem',
            normal: '1rem',
            large: '1.4rem',
            huge: '2rem',
        },
        space: {
            tiny: '1px',
            small: '.25em',
            normal: '.5em',
            large: '1em',
            bigger: '1.75em',
            huge: '5em',
        },
        radii: {
            small: '.15em',
            normal: '.25em',
            large: '1em',
            huge: '1.5em',
            round: '1000vmax',
        },
        shadows: {
            tiny: lightThemeColors.shadow[0],
            small: lightThemeColors.shadow[1],
            normal: lightThemeColors.shadow[2],
            medium: lightThemeColors.shadow[3],
            large: lightThemeColors.shadow[4],
        },
        borderWidths: {
            normal: '1px',
        },
    },
});

export const darkTheme = createTheme({
    colors: {
        ...asObject(darkThemeColors.color),

        text1: hsl(darkThemeColors.text[0]),
        'text1-hsl': hslStr(darkThemeColors.text[0]),
        text2: hsl(darkThemeColors.text[1]),
        'text2-hsl': hslStr(darkThemeColors.text[1]),
        surface1: hsl(darkThemeColors.surface[0]),
        'surface1-hsl': hslStr(darkThemeColors.surface[0]),
        surface2: hsl(darkThemeColors.surface[1]),
        'surface2-hsl': hslStr(darkThemeColors.surface[1]),
        surface3: hsl(darkThemeColors.surface[2]),
        'surface3-hsl': hslStr(darkThemeColors.surface[2]),
        surface4: hsl(darkThemeColors.surface[3]),
        'surface4-hsl': hslStr(darkThemeColors.surface[3]),
    },
    shadows: {
        tiny: darkThemeColors.shadow[0],
        small: darkThemeColors.shadow[1],
        normal: darkThemeColors.shadow[2],
        medium: darkThemeColors.shadow[3],
        large: darkThemeColors.shadow[4],
    },
});

export const globalStyles = globalCss({
    html: {
        inlineSize: '100%',
        blockSize: '100%',
        backgroundColor: 'transparent',
        color: '$text1',
        accentColor: '$brand',
        fontFamily: '$sans',
    },

    body: {
        display: 'grid',
        grid: '100% / 100%',
        inlineSize: '100%',
        blockSize: '100%',
        margin: '0',
        backgroundColor: 'transparent',
        overflow: 'clip',
    },

    ':where(*, ::before, ::after)': {
        boxSizing: 'border-box',
    },

    ':where(p, h1, h2, h3, h4, h5, h6)': {
        marginBlock: 0,
    },

    ':where(fieldset)': {
        margin: 0,
        borderStyle: 'solid',
        borderWidth: '1px',
    },

    ':where(a)': {
        color: '$blueFg',
        fontWeight: 'bold',
        textDecoration: 'none',
    },
});