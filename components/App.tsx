import React, { useCallback, useEffect, useState } from "react";

import { SHADERS } from "../renderer/engine";
import { Dot } from "./Dot";
import { useScreen } from "./Screen";

import * as styles from "./App.module.scss";

export function App() {
	const [start] = useState(() => Date.now());
	const [frame, setFrame] = useState(0);
	const [shader, setShader] = useState(
		() => SHADERS.get(location.hash.substring(1)) ?? SHADERS.get("d")!,
	);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			let key = event.key.toLowerCase();
			const shader = SHADERS.get(key);

			if (shader) {
				location.hash = key;
				setShader(() => shader);
			}
		};

		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, []);

	const screen = useScreen();

	useEffect(() => {
		let enabled = true;

		const renderLoop = () => {
			if (!enabled) return;
			setFrame((Date.now() - start) / 1000);
			requestAnimationFrame(renderLoop);
		};

		requestAnimationFrame(renderLoop);
		return () => {
			enabled = false;
		};
	}, []);

	const onDoubleClick = useCallback(() => {
		if (!document.fullscreenElement) {
			document.body.requestFullscreen();
		} else {
			document.exitFullscreen();
		}
	}, []);

	return (
		<div className={styles.columns} onDoubleClick={onDoubleClick}>
			{Array.from({ length: screen.height }, (_, y) => (
				<div key={y} className={styles.row}>
					{Array.from({ length: screen.width }, (_, x) => {
						const { color, activation } = shader({ x, y, t: frame });
						return (
							<Dot
								key={`${x},${y}`}
								color={color}
								activation={activation}
							/>
						);
					})}
				</div>
			))}
		</div>
	);
}
