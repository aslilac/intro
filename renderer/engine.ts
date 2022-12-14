import { Extent, Point, rect } from "./geometry";
import { hexToString, lerpHex } from "../color";
import { clamp } from "../math";

export interface RenderInput {
	x: number;
	y: number;
	t: number;
}

export interface RenderOutput {
	color: string;
	activation?: number;
}

export const SHADERS = new Map([
	["q", gradient],
	["w", gradientFast],
	["e", gradientMonochrome],
	["r", gradientMonochrome2],
	["t", pink],
	["y", square],
	["u", checkered],
	["i", checkeredFast],
	["o", checkeredRainbowFast],
	["p", sweep],
	["a", sin],
	["s", rain],
	["d", waves],
	["f", rgb],
]);

// Rainbow gradient
export function gradient(input: RenderInput): RenderOutput {
	const { x, y, t } = input;
	const color = `hsl(${(((x + y + t * 10) / 53) * 360).toPrecision(5)}, 100%, 50%)`;
	return { color };
}

// Rainbow gradient, but FAST
export function gradientFast(input: RenderInput): RenderOutput {
	const { x, y, t } = input;
	const color = `hsl(${(((x + y + t * 100) / 100) * 360).toPrecision(5)}, 100%, 50%)`;
	return { color };
}

// Monochrome gradient
export function gradientMonochrome(input: RenderInput): RenderOutput {
	const { x, y, t } = input;
	const luminance = (((x - y + t * 10) / 53) * 100) % 100;
	return { color: "#fff", activation: luminance / 100 };
}

// Monochrome gradient v2
export function gradientMonochrome2(input: RenderInput): RenderOutput {
	const { x, y, t } = input;
	const position = (((x - y + t * 10) / 53) * 100) % 200;
	const luminance = position > 100 ? 200 - position : position;
	return { color: "#fff", activation: luminance / 100 };
}

// Pink uwu
export function pink(input: RenderInput): RenderOutput {
	const { x, y, t } = input;
	const position = (((x + y + t * 10) / 53) * 100) % 100;
	const luminance = position > 50 ? 100 - position : position;
	const color = `hsl(309, 100%, ${(luminance + 20).toPrecision(5)}%)`;
	return { color };
}

// Square
export function square(input: RenderInput): RenderOutput {
	const isEdge = rect(input, Point(1, 1), Extent(12, 5));
	return { color: isEdge ? "#8d1bd2" : "#333" };
}

// Checkered, marching
export function checkered(input: RenderInput): RenderOutput {
	const { x, y, t } = input;
	const h = (x + t) % 10 >= 5;
	const v = (y + t) % 10 >= 5;
	return { color: h !== v ? "#fff" : "#333" };
}

// Checkered, marching but FAST
export function checkeredFast(input: RenderInput): RenderOutput {
	const { x, y, t } = input;
	const h = (x + t * 20) % 10 >= 5;
	const v = (y + t * 20) % 10 >= 5;
	return { color: h !== v ? "#fff" : "#333" };
}

// Checkered, marching but FAST *and* rainbow
export function checkeredRainbowFast(input: RenderInput): RenderOutput {
	const { x, y, t } = input;
	const h = (x + t * 10) % 10 >= 5;
	const v = (y + t * 10) % 10 >= 5;
	const color = `hsl(${(((x - y + t * 10) / 100) * 360).toPrecision(5)}, 90%, 70%)`;
	return { color, activation: h !== v ? 1 : 0.3 };
}

// Sweep
export function sweep(input: RenderInput): RenderOutput {
	const { x, y, t } = input;

	const h = (x + y) % 20;
	const tm = (t * 12) % 20;
	const tm2 = ((t * 12) % 20) - 20;

	// The second pass is to check from the "left". When `tm` is around 19 `tm2` will be
	// around -1, which allows us to accurately check the distance when `h` is 0. For
	// example: 19 an 0 are quite distant, but -1 and 0 are quite close.
	const tmActivation = clamp(1 - Math.abs(h - tm), 0, 1);
	const tm2Activation = clamp(1 - Math.abs(h - tm2), 0, 1);

	return {
		color: "#3fbff6",
		activation: 0.5 + Math.max(tmActivation, tm2Activation),
	};
}

// Sine wave
export function sin(input: RenderInput): RenderOutput {
	const { x, y, t } = input;

	const targetY = (Math.sin((x + t * 6) / 6) + 1) * 8 + 8;
	const activation = 0.5 + clamp(1 - Math.abs(y - targetY), 0, 1);
	const color = hexToString(lerpHex(x / 40, 0x8d1bd2, 0xf6199e));

	return { color, activation };
}

// Raindrops?
export function rain(input: RenderInput): RenderOutput {
	const { x, y, t } = input;

	const activation = 0.5 + Math.tan((x * 0.7529592 + y * 0.458018) * 2 - t);
	const color = hexToString(lerpHex(y / 20, 0x53c2f2, 0x3ff6f6));
	return { color, activation };
}

// Cool wavey line thing
export function waves(input: RenderInput): RenderOutput {
	const { x, y, t } = input;

	const activation = 0.5 + Math.tan((x * 0.7529592 + y * 0.458018) / 5 - t);
	// const color = hexToString(lerpHex(y / 25, 0x7df46a, 0xf4de6a)); // green and yellow
	const color = hexToString(lerpHex(x / 40, 0x8d1bd2, 0xf6199e)); // purple and pink
	return { color, activation };
}

export function rgb(input: RenderInput): RenderOutput {
	const { x } = input;

	const color = hexToString(0xff0000 >> ((x % 3) * 8));
	// console.log(color);
	return { color, activation: 0.9 + Math.random() * 0.5 };
}
