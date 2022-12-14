<h1 align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://cdn.mckayla.cloud/-/d6a78d43d7ab4abea61e453bd57bf75b/Intro.webp" />
  <img src="https://cdn.mckayla.cloud/-/d6a78d43d7ab4abea61e453bd57bf75b/Intro-Black.webp" height=200 />
</picture>
</h1>

A playground to learn about graphics programming that only requires basic programming
knowledge, and which provides a unique set of constraints to work within.

## Getting Started

You'll need Yarn v1.x and a recent version of Node

```sh
yarn
yarn dev
```

Go poke around in ./renderer/engine.ts and have fun! There are lots of samples to get you
started.

## How it works

Intro is based around a dot-matrix display (a screen made out of a grid of small dots)
which is controlled by your shader program.

A "shader program" in the world of graphics is a bit of code that will be run many times
to compute an image. As an input this code receives information about the work it should
do, which in Intro is just the X and Y coordinates of a dot. As an output this code should
produce some information that can be used to compose the image, which in Intro is a color.

That is, you write a bit of code called a "shader", which Intro will run for each dot in
the display. Your shader does some work, and tells Intro what color the dot should be.

### An example

```typescript
export function shader(input: RenderInput): RenderOutput {
	const { x } = input;
	return { color: x === 0 ? "#8d1bd2" : "#333" };
}
```

This example will draw a purple vertical line through the dot-matrix. Try changing the `0`
in `x === 0` to some other numbers and watch the line move around!

### Timing

It's cool that we can draw a line, and move it around, but what if it was able to move by
itself?

<!--
This gets complicated quickly. `t` is floating point so `===` breaks down immediately.
Plus if you don't do something to make it loop the line will just fly off the screen and
never be seen again. Making a line move is already *much* more complicated than the
previous example. You also probably wanna use activation to make it look good, but I kind
of want to introduce activation *after* timing.
-->

```typescript
export function shader(input: RenderInput): RenderOutput {
	const { x } = input;
	return { color: x === 0 ? "#8d1bd2" : "#333" };
}
```

### Activation
