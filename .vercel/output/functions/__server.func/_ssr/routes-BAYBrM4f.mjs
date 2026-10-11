import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as TextureLoader, C as RepeatWrapping, D as SphereGeometry, E as ShaderMaterial, M as Vector2, N as Vector3, O as Sprite, P as WebGLRenderer, S as Raycaster, T as Scene, _ as MeshStandardMaterial, a as ConeGeometry, b as PlaneGeometry, c as Fog, d as IcosahedronGeometry, f as LinearFilter, g as MeshBasicMaterial, h as Mesh, i as Color, j as TorusGeometry, k as SpriteMaterial, l as Group, m as MathUtils, n as CanvasTexture, o as CylinderGeometry, p as LinearMipmapLinearFilter, r as CircleGeometry, s as DirectionalLight, t as BoxGeometry, u as HemisphereLight, v as OctahedronGeometry, w as SRGBColorSpace, x as PointLight, y as PerspectiveCamera } from "../_libs/three.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BAYBrM4f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HOME = {
	x: .02,
	z: .22
};
var BOWL = {
	x: .92,
	z: .62
};
var TUB = {
	x: .88,
	z: -.42
};
var BED = {
	x: -.92,
	z: -.48
};
function canvasTexture(size, draw) {
	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("canvas");
	draw(ctx, size);
	const texture = new CanvasTexture(canvas);
	texture.colorSpace = SRGBColorSpace;
	texture.anisotropy = 8;
	return texture;
}
function spriteTexture(draw) {
	const canvas = document.createElement("canvas");
	canvas.width = 64;
	canvas.height = 64;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("canvas");
	draw(ctx);
	const texture = new CanvasTexture(canvas);
	texture.colorSpace = SRGBColorSpace;
	return texture;
}
function GameScene({ skin, sleeping, action, vibe, onPetTap }) {
	const mountRef = (0, import_react.useRef)(null);
	const tapRef = (0, import_react.useRef)(onPetTap);
	const actionRef = (0, import_react.useRef)(action);
	const sleepRef = (0, import_react.useRef)(sleeping);
	const skinRef = (0, import_react.useRef)(skin);
	const vibeRef = (0, import_react.useRef)(vibe);
	tapRef.current = onPetTap;
	actionRef.current = action;
	sleepRef.current = sleeping;
	skinRef.current = skin;
	vibeRef.current = vibe;
	(0, import_react.useEffect)(() => {
		const mount = mountRef.current;
		if (!mount) return void 0;
		const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
		const scene = new Scene();
		const bgDay = new Color("#efe6ff");
		const bgNight = new Color("#161326");
		const background = bgDay.clone();
		scene.background = background;
		scene.fog = new Fog(background.clone(), 7.5, 16);
		const camera = new PerspectiveCamera(30, 1, .1, 40);
		const look = new Vector3(0, 1.18, 0);
		camera.position.set(.42, 1.92, 6.35);
		const renderer = new WebGLRenderer({
			antialias: true,
			alpha: false,
			powerPreference: "high-performance"
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = 2;
		renderer.outputColorSpace = SRGBColorSpace;
		renderer.toneMapping = 4;
		renderer.toneMappingExposure = 1.05;
		renderer.domElement.setAttribute("aria-label", "Habitación de TangoWorld. Toca a la mascota para acariciarla.");
		mount.appendChild(renderer.domElement);
		const geometries = [];
		const materials = [];
		const textures = [];
		const track = (geometry) => {
			geometries.push(geometry);
			return geometry;
		};
		const trackMat = (material) => {
			materials.push(material);
			return material;
		};
		const trackTex = (texture) => {
			textures.push(texture);
			return texture;
		};
		const standard = (color, extra = {}) => trackMat(new MeshStandardMaterial({
			color,
			roughness: .82,
			metalness: .02,
			...extra
		}));
		const addMesh = (geometry, material, position, rotation, shadow = true) => {
			const mesh = new Mesh(geometry, material);
			mesh.position.set(position[0], position[1], position[2]);
			if (rotation) mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
			mesh.castShadow = shadow;
			mesh.receiveShadow = shadow;
			scene.add(mesh);
			return mesh;
		};
		const floorTex = trackTex(canvasTexture(512, (ctx, s) => {
			ctx.fillStyle = "#f4e4d4";
			ctx.fillRect(0, 0, s, s);
			const plank = 64;
			for (let y = 0; y < s; y += plank) {
				const shade = 228 + y / plank % 2 * 10;
				ctx.fillStyle = `rgb(${shade}, ${shade - 28}, ${shade - 52})`;
				ctx.fillRect(0, y, s, 62);
				ctx.strokeStyle = "rgba(120, 78, 48, 0.18)";
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(0, y + plank - 1);
				ctx.lineTo(s, y + plank - 1);
				ctx.stroke();
				for (let i = 0; i < 8; i++) {
					ctx.strokeStyle = `rgba(140, 90, 55, ${.04 + i % 3 * .03})`;
					ctx.beginPath();
					const gy = y + 8 + i * 7;
					ctx.moveTo(0, gy);
					ctx.bezierCurveTo(80, gy + 2, 200, gy - 2, s, gy + 1);
					ctx.stroke();
				}
			}
			for (let x = 40; x < s; x += 170) {
				ctx.fillStyle = "rgba(90, 55, 32, 0.16)";
				ctx.fillRect(x, 0, 3, s);
			}
		}));
		floorTex.wrapS = RepeatWrapping;
		floorTex.wrapT = RepeatWrapping;
		floorTex.repeat.set(2.4, 2.4);
		const wallTex = trackTex(canvasTexture(256, (ctx, s) => {
			ctx.fillStyle = "#e3dafc";
			ctx.fillRect(0, 0, s, s);
			ctx.fillStyle = "rgba(255,255,255,0.45)";
			for (let y = 18; y < s; y += 36) for (let x = y / 36 % 2 ? 18 : 0; x < s; x += 36) {
				ctx.beginPath();
				ctx.arc(x, y, 2.2, 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.fillStyle = "rgba(255, 214, 120, 0.55)";
			for (let i = 0; i < 10; i++) {
				const x = i * 67 % s;
				const y = i * 41 % s;
				ctx.fillRect(x, y, 3, 3);
			}
		}));
		wallTex.wrapS = RepeatWrapping;
		wallTex.wrapT = RepeatWrapping;
		wallTex.repeat.set(3.2, 1.6);
		const rugTex = trackTex(canvasTexture(512, (ctx, s) => {
			ctx.clearRect(0, 0, s, s);
			const g = ctx.createRadialGradient(s / 2, s / 2, 40, s / 2, s / 2, s / 2);
			g.addColorStop(0, "#fff7fb");
			g.addColorStop(.45, "#f7c2d2");
			g.addColorStop(.72, "#e39aaf");
			g.addColorStop(1, "rgba(227,154,175,0)");
			ctx.fillStyle = g;
			ctx.beginPath();
			ctx.ellipse(s / 2, s / 2, s * .48, s * .36, 0, 0, Math.PI * 2);
			ctx.fill();
			ctx.strokeStyle = "rgba(255,255,255,0.7)";
			ctx.lineWidth = 10;
			ctx.beginPath();
			ctx.ellipse(s / 2, s / 2, s * .32, s * .22, 0, 0, Math.PI * 2);
			ctx.stroke();
			ctx.fillStyle = "rgba(255,255,255,0.85)";
			ctx.beginPath();
			ctx.arc(s / 2, s / 2, 18, 0, Math.PI * 2);
			ctx.fill();
		}));
		const floorMat = standard("#ffffff", {
			map: floorTex,
			roughness: .94
		});
		const floor = addMesh(track(new CircleGeometry(4.3, 48)), floorMat, [
			0,
			0,
			.1
		], [
			-Math.PI / 2,
			0,
			0
		]);
		floor.receiveShadow = true;
		floor.castShadow = false;
		const rug = addMesh(track(new CircleGeometry(1.25, 40)), trackMat(new MeshBasicMaterial({
			map: rugTex,
			transparent: true,
			depthWrite: false
		})), [
			.02,
			.025,
			.28
		], [
			-Math.PI / 2,
			0,
			0
		], false);
		rug.receiveShadow = false;
		addMesh(track(new PlaneGeometry(8.4, 4.15)), standard("#e4dcfb", {
			map: wallTex,
			roughness: 1
		}), [
			0,
			2.05,
			-2.35
		]);
		addMesh(track(new PlaneGeometry(4.6, 4.15)), standard("#d9d0f6", {
			map: wallTex,
			roughness: 1
		}), [
			-3.55,
			2.05,
			-.15
		], [
			0,
			Math.PI / 2,
			0
		]);
		addMesh(track(new BoxGeometry(8.4, .12, .08)), standard("#fffaf6", { roughness: .6 }), [
			0,
			.08,
			-2.3
		]);
		addMesh(track(new BoxGeometry(.08, .12, 4.5)), standard("#fffaf6", { roughness: .6 }), [
			-3.5,
			.08,
			-.15
		]);
		addMesh(track(new BoxGeometry(8.4, .1, .1)), standard("#c9b8f0", { roughness: .7 }), [
			0,
			3.95,
			-2.32
		]);
		const sky = new ShaderMaterial({
			uniforms: {
				night: { value: 0 },
				time: { value: 0 }
			},
			vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
			fragmentShader: `
        varying vec2 vUv;
        uniform float night;
        uniform float time;
        void main() {
          vec3 dayTop = vec3(0.49, 0.72, 0.98);
          vec3 dayBot = vec3(1.0, 0.78, 0.66);
          vec3 nightTop = vec3(0.05, 0.05, 0.14);
          vec3 nightBot = vec3(0.28, 0.18, 0.46);
          vec3 col = mix(mix(dayBot, dayTop, smoothstep(0.05, 1.0, vUv.y)), mix(nightBot, nightTop, smoothstep(0.0, 1.0, vUv.y)), night);
          vec2 sun = vec2(0.78, mix(0.58, 0.78, night));
          float sd = length((vUv - sun) * vec2(1.0, 1.15));
          vec3 sunCol = mix(vec3(1.0, 0.9, 0.55), vec3(0.86, 0.9, 1.0), night);
          col += sunCol * smoothstep(0.14, 0.0, sd);
          col += vec3(1.0, 0.85, 0.55) * smoothstep(0.28, 0.12, sd) * (1.0 - night) * 0.35;
          float cell = fract(sin(dot(floor(vUv * vec2(46.0, 30.0)), vec2(12.9898, 78.233))) * 43758.5453);
          float stars = step(0.986, cell);
          float tw = 0.55 + 0.45 * sin(time * 2.6 + vUv.x * 30.0);
          col += vec3(stars) * night * tw;
          gl_FragColor = vec4(col, 1.0);
        }
      `
		});
		trackMat(sky);
		const windowSky = addMesh(track(new PlaneGeometry(2.15, 1.45)), sky, [
			.15,
			2.35,
			-2.32
		], void 0, false);
		windowSky.castShadow = false;
		windowSky.receiveShadow = false;
		const trim = standard("#fffdf8", { roughness: .45 });
		addMesh(track(new BoxGeometry(2.35, .08, .08)), trim, [
			.15,
			3.12,
			-2.26
		]);
		addMesh(track(new BoxGeometry(2.35, .08, .08)), trim, [
			.15,
			1.58,
			-2.26
		]);
		addMesh(track(new BoxGeometry(.08, 1.62, .08)), trim, [
			-.96,
			2.35,
			-2.26
		]);
		addMesh(track(new BoxGeometry(.08, 1.62, .08)), trim, [
			1.26,
			2.35,
			-2.26
		]);
		const sill = addMesh(track(new BoxGeometry(2.4, .07, .22)), trim, [
			.15,
			1.52,
			-2.16
		]);
		sill.castShadow = true;
		const curtainMat = standard("#f6b7c6", {
			roughness: .85,
			side: 2
		});
		const curtainL = addMesh(track(new PlaneGeometry(.42, 1.5)), curtainMat, [
			-.78,
			2.28,
			-2.2
		]);
		const curtainR = addMesh(track(new PlaneGeometry(.42, 1.5)), curtainMat, [
			1.08,
			2.28,
			-2.2
		]);
		const cloudMat = trackMat(new MeshBasicMaterial({
			color: "#ffffff",
			transparent: true,
			opacity: .9,
			depthWrite: false
		}));
		const clouds = [
			-.35,
			.15,
			.55
		].map((x, i) => {
			const cloud = addMesh(track(new SphereGeometry(.12, 12, 10)), cloudMat, [
				x,
				2.55 - i * .08,
				-2.2
			], void 0, false);
			cloud.scale.set(1.8 + i * .3, .7, .4);
			cloud.castShadow = false;
			return cloud;
		});
		const pot = standard("#e7a090", { roughness: .7 });
		addMesh(track(new CylinderGeometry(.1, .08, .08, 16)), pot, [
			.72,
			1.58,
			-2.08
		]);
		addMesh(track(new SphereGeometry(.09, 12, 10)), standard("#7ecf9a", { roughness: .65 }), [
			.72,
			1.68,
			-2.08
		], void 0, false);
		const bedWood = standard("#f7f4ff", { roughness: .72 });
		const bedPaint = standard("#7d78d8", { roughness: .62 });
		addMesh(track(new BoxGeometry(1.55, .7, .08)), bedPaint, [
			-1.85,
			.55,
			-1.72
		]);
		addMesh(track(new BoxGeometry(1.5, .22, .95)), bedPaint, [
			-1.72,
			.16,
			-1.22
		]);
		addMesh(track(new BoxGeometry(1.4, .12, .86)), bedWood, [
			-1.72,
			.3,
			-1.22
		]);
		addMesh(track(new BoxGeometry(.42, .1, .28)), standard("#fff6df", { roughness: .9 }), [
			-2.1,
			.4,
			-1.42
		]);
		const blanketTex = trackTex(canvasTexture(128, (ctx, s) => {
			for (let i = 0; i < 8; i++) {
				ctx.fillStyle = i % 2 ? "#f7f1ff" : "#f3a8ba";
				ctx.fillRect(0, s / 8 * i, s, s / 8);
			}
		}));
		const blanket = addMesh(track(new BoxGeometry(1.28, .08, .62)), standard("#f3a8ba", {
			map: blanketTex,
			roughness: .9
		}), [
			-1.58,
			.38,
			-1.08
		]);
		addMesh(track(new CylinderGeometry(.16, .13, .22, 12)), standard("#e59aa4", { roughness: .8 }), [
			-2.55,
			.12,
			-.15
		]);
		const plant = addMesh(track(new IcosahedronGeometry(.22, 0)), standard("#79c7a0", { roughness: .7 }), [
			-2.55,
			.38,
			-.15
		]);
		const plantB = addMesh(track(new IcosahedronGeometry(.14, 0)), standard("#9ed9b6", { roughness: .7 }), [
			-2.38,
			.34,
			-.05
		]);
		const bowlOuter = standard("#ff9aa8", {
			roughness: .38,
			metalness: .08,
			side: 2
		});
		addMesh(track(new CylinderGeometry(.28, .2, .16, 28, 1, true)), bowlOuter, [
			1.55,
			.1,
			.95
		]);
		addMesh(track(new TorusGeometry(.27, .035, 8, 24)), standard("#ffd1d8", { roughness: .35 }), [
			1.55,
			.17,
			.95
		], [
			Math.PI / 2,
			0,
			0
		]);
		addMesh(track(new CylinderGeometry(.2, .2, .04, 20)), standard("#f0bf62", { roughness: .55 }), [
			1.55,
			.08,
			.95
		]);
		for (let i = 0; i < 5; i++) {
			const crumb = addMesh(track(new SphereGeometry(.035, 8, 6)), standard("#e7b15a", { roughness: .6 }), [
				1.48 + i % 3 * .06,
				.12,
				.9 + Math.floor(i / 3) * .06
			], void 0, false);
			crumb.castShadow = false;
		}
		const tubBody = standard("#7ec4dc", {
			roughness: .35,
			metalness: .05
		});
		addMesh(track(new BoxGeometry(.85, .28, .58)), tubBody, [
			1.62,
			.16,
			-1.15
		]);
		addMesh(track(new BoxGeometry(.78, .08, .5)), standard("#d9f6ff", { roughness: .2 }), [
			1.62,
			.32,
			-1.15
		]);
		const waterMat = new MeshStandardMaterial({
			color: "#8fd4ea",
			transparent: true,
			opacity: .78,
			roughness: .15,
			metalness: .05
		});
		trackMat(waterMat);
		const water = addMesh(track(new BoxGeometry(.7, .05, .42)), waterMat, [
			1.62,
			.34,
			-1.15
		], void 0, false);
		water.castShadow = false;
		const lampPole = standard("#f4efe4", { roughness: .45 });
		addMesh(track(new CylinderGeometry(.05, .08, .08, 12)), lampPole, [
			1.15,
			.05,
			-.55
		]);
		addMesh(track(new CylinderGeometry(.025, .025, .85, 10)), lampPole, [
			1.15,
			.48,
			-.55
		]);
		const bulbMat = standard("#ffe1a8", {
			emissive: "#ffb35a",
			emissiveIntensity: .4,
			roughness: .3
		});
		const bulb = addMesh(track(new SphereGeometry(.09, 16, 12)), bulbMat, [
			1.15,
			.96,
			-.55
		], void 0, false);
		bulb.castShadow = false;
		addMesh(track(new ConeGeometry(.16, .18, 16, 1, true)), standard("#fff7ea", {
			side: 2,
			roughness: .5
		}), [
			1.15,
			1.08,
			-.55
		]);
		const ball = addMesh(track(new SphereGeometry(.16, 20, 16)), standard("#ffd56a", {
			roughness: .35,
			metalness: .05
		}), [
			.78,
			.16,
			1.22
		]);
		const stripe = standard("#fffaf0", { roughness: .4 });
		const ballStripe = addMesh(track(new TorusGeometry(.16, .02, 6, 20)), stripe, [
			.78,
			.16,
			1.22
		], [
			Math.PI / 2.6,
			.2,
			.4
		], false);
		addMesh(track(new BoxGeometry(.16, .16, .16)), standard("#f08b7a", { roughness: .6 }), [
			-.85,
			.1,
			1.15
		], [
			0,
			.4,
			.1
		]);
		addMesh(track(new BoxGeometry(.13, .13, .13)), standard("#8eb7f5", { roughness: .55 }), [
			-.68,
			.08,
			1.22
		], [
			0,
			.2,
			0
		]);
		const shelf = standard("#fffaf4", { roughness: .55 });
		addMesh(track(new BoxGeometry(1.15, .06, .22)), shelf, [
			-2.15,
			2.15,
			-2.2
		]);
		[
			"#f3a0b4",
			"#8f88e4",
			"#f2d36a",
			"#7dceb0",
			"#f08b7a"
		].forEach((color, i) => {
			addMesh(track(new BoxGeometry(.1, .32 + i % 2 * .06, .16)), standard(color, { roughness: .7 }), [
				-2.52 + i * .16,
				2.34,
				-2.18
			]);
		});
		const frameMat = standard("#fff8ee", { roughness: .5 });
		const pawTex = trackTex(canvasTexture(128, (ctx, s) => {
			ctx.fillStyle = "#fff6ea";
			ctx.fillRect(0, 0, s, s);
			ctx.fillStyle = "#e7a0b4";
			ctx.beginPath();
			ctx.ellipse(s / 2, s * .62, 18, 16, 0, 0, Math.PI * 2);
			ctx.fill();
			[
				[38, 34],
				[64, 26],
				[90, 34],
				[78, 48]
			].forEach(([x, y]) => {
				ctx.beginPath();
				ctx.arc(x, y, 8, 0, Math.PI * 2);
				ctx.fill();
			});
		}));
		addMesh(track(new BoxGeometry(.52, .46, .04)), frameMat, [
			1.85,
			2.55,
			-2.28
		]);
		addMesh(track(new PlaneGeometry(.4, .34)), trackMat(new MeshBasicMaterial({ map: pawTex })), [
			1.85,
			2.55,
			-2.25
		], void 0, false);
		const clockTex = trackTex(canvasTexture(128, (ctx, s) => {
			ctx.fillStyle = "#fffdf8";
			ctx.beginPath();
			ctx.arc(s / 2, s / 2, s * .46, 0, Math.PI * 2);
			ctx.fill();
			ctx.strokeStyle = "#7d78d8";
			ctx.lineWidth = 6;
			ctx.stroke();
			ctx.fillStyle = "#5c567f";
			ctx.font = "700 16px sans-serif";
			ctx.textAlign = "center";
			ctx.fillText("12", s / 2, 28);
			ctx.fillText("6", s / 2, s - 16);
		}));
		addMesh(track(new CircleGeometry(.22, 24)), trackMat(new MeshBasicMaterial({ map: clockTex })), [
			-2.55,
			2.7,
			-2.28
		], void 0, false);
		const handMat = trackMat(new MeshBasicMaterial({ color: "#5c567f" }));
		const hourPivot = new Group();
		hourPivot.position.set(-2.55, 2.7, -2.24);
		const minutePivot = new Group();
		minutePivot.position.set(-2.55, 2.7, -2.23);
		const hourHand = new Mesh(track(new BoxGeometry(.018, .1, .01)), handMat);
		hourHand.position.y = .04;
		const minuteHand = new Mesh(track(new BoxGeometry(.012, .14, .01)), handMat);
		minuteHand.position.y = .06;
		hourPivot.add(hourHand);
		minutePivot.add(minuteHand);
		scene.add(hourPivot, minutePivot);
		const lights = [];
		const lightGeo = track(new SphereGeometry(.045, 10, 8));
		for (let i = 0; i < 14; i++) {
			const mat = standard("#fff4c8", {
				emissive: "#ffd27a",
				emissiveIntensity: .8,
				roughness: .4
			});
			const x = -2.4 + i * .42;
			const y = 3.55 + Math.sin(i * .8) * .08;
			const bulbLight = addMesh(lightGeo, mat, [
				x,
				y,
				-2.15
			], void 0, false);
			bulbLight.castShadow = false;
			lights.push(bulbLight);
			if (i < 13) {
				const wire = addMesh(track(new BoxGeometry(.42, .012, .012)), standard("#6d6794", { roughness: .5 }), [
					x + .21,
					(y + 3.55 + Math.sin((i + 1) * .8) * .08) / 2,
					-2.15
				], [
					0,
					0,
					Math.sin(i) * .15
				], false);
				wire.castShadow = false;
			}
		}
		const mobile = new Group();
		mobile.position.set(.05, 2.85, .15);
		scene.add(mobile);
		const mobileBar = new Mesh(track(new BoxGeometry(.7, .03, .03)), standard("#fff6df", { roughness: .4 }));
		mobile.add(mobileBar);
		const starMat = standard("#ffe08a", {
			emissive: "#ffd56a",
			emissiveIntensity: .35,
			roughness: .45
		});
		const mobileStars = [];
		[
			-.24,
			0,
			.24
		].forEach((x, i) => {
			const drop = new Mesh(track(new BoxGeometry(.012, .22, .012)), standard("#d9d3f5"));
			drop.position.set(x, -.12, 0);
			mobile.add(drop);
			const star = new Mesh(track(new OctahedronGeometry(.07, 0)), starMat);
			star.position.set(x, -.28 - i * .02, 0);
			mobile.add(star);
			mobileStars.push(star);
		});
		const hemi = new HemisphereLight("#fff8f2", "#9d92c9", 1.35);
		scene.add(hemi);
		const key = new DirectionalLight("#fff3dd", 2.35);
		key.position.set(-2.4, 5.4, 3.6);
		key.castShadow = true;
		key.shadow.mapSize.set(1024, 1024);
		key.shadow.camera.left = -4;
		key.shadow.camera.right = 4;
		key.shadow.camera.top = 4;
		key.shadow.camera.bottom = -3;
		key.shadow.bias = -6e-4;
		scene.add(key);
		const windowLight = new DirectionalLight("#d5e6ff", .85);
		windowLight.position.set(.2, 3.1, -1.2);
		scene.add(windowLight);
		const lampLight = new PointLight("#ffc27a", .35, 5.5, 2);
		lampLight.position.set(1.15, 1.05, -.45);
		scene.add(lampLight);
		const fill = new PointLight("#e4d4ff", .45, 8, 2);
		fill.position.set(-1.2, 1.8, 1.6);
		scene.add(fill);
		const shadow = new Mesh(track(new CircleGeometry(.62, 32)), trackMat(new MeshBasicMaterial({
			color: "#5c547f",
			transparent: true,
			opacity: .22,
			depthWrite: false
		})));
		shadow.rotation.x = -Math.PI / 2;
		shadow.position.set(HOME.x, .03, HOME.z);
		shadow.renderOrder = 2;
		scene.add(shadow);
		const petMat = trackMat(new MeshBasicMaterial({
			transparent: true,
			opacity: 0,
			alphaTest: .04,
			depthWrite: false,
			side: 2,
			toneMapped: false
		}));
		const pet = new Mesh(track(new PlaneGeometry(1, 1)), petMat);
		pet.position.set(HOME.x, 1.25, HOME.z);
		pet.renderOrder = 6;
		scene.add(pet);
		const mirrorMat = new ShaderMaterial({
			transparent: true,
			depthWrite: false,
			uniforms: {
				map: { value: null },
				opacity: { value: .18 }
			},
			vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
			fragmentShader: `
        uniform sampler2D map;
        uniform float opacity;
        varying vec2 vUv;
        void main() {
          vec4 c = texture2D(map, vec2(vUv.x, vUv.y));
          float fade = smoothstep(0.0, 0.72, vUv.y) * (1.0 - smoothstep(0.82, 1.0, vUv.y));
          gl_FragColor = vec4(c.rgb, c.a * opacity * fade);
        }
      `
		});
		trackMat(mirrorMat);
		const mirror = new Mesh(track(new PlaneGeometry(1, 1)), mirrorMat);
		mirror.rotation.x = -Math.PI / 2;
		mirror.position.y = .035;
		mirror.renderOrder = 3;
		mirror.visible = false;
		scene.add(mirror);
		const aura = new Mesh(track(new TorusGeometry(.72, .035, 8, 40)), trackMat(new MeshBasicMaterial({
			color: "#ffe08a",
			transparent: true,
			opacity: 0,
			depthWrite: false,
			toneMapped: false
		})));
		aura.position.set(HOME.x, 1.15, HOME.z);
		aura.renderOrder = 5;
		scene.add(aura);
		const heartTex = trackTex(spriteTexture((ctx) => {
			ctx.clearRect(0, 0, 64, 64);
			ctx.fillStyle = "#ff7f9f";
			ctx.beginPath();
			ctx.moveTo(32, 54);
			ctx.bezierCurveTo(4, 36, 8, 12, 32, 22);
			ctx.bezierCurveTo(56, 12, 60, 36, 32, 54);
			ctx.fill();
		}));
		const starTex = trackTex(spriteTexture((ctx) => {
			ctx.clearRect(0, 0, 64, 64);
			ctx.fillStyle = "#ffe08a";
			ctx.beginPath();
			for (let i = 0; i < 10; i++) {
				const r = i % 2 ? 10 : 26;
				const a = -Math.PI / 2 + i * Math.PI / 5;
				const x = 32 + Math.cos(a) * r;
				const y = 32 + Math.sin(a) * r;
				if (i === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			}
			ctx.closePath();
			ctx.fill();
		}));
		const bubbleTex = trackTex(spriteTexture((ctx) => {
			ctx.clearRect(0, 0, 64, 64);
			ctx.strokeStyle = "rgba(255,255,255,0.95)";
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.arc(32, 32, 18, 0, Math.PI * 2);
			ctx.stroke();
			ctx.fillStyle = "rgba(186, 230, 255, 0.35)";
			ctx.fill();
		}));
		const crumbTex = trackTex(spriteTexture((ctx) => {
			ctx.clearRect(0, 0, 64, 64);
			ctx.fillStyle = "#e0a84a";
			ctx.beginPath();
			ctx.arc(32, 34, 12, 0, Math.PI * 2);
			ctx.fill();
		}));
		const plusTex = trackTex(spriteTexture((ctx) => {
			ctx.clearRect(0, 0, 64, 64);
			ctx.fillStyle = "#7ddeb0";
			ctx.fillRect(26, 10, 12, 44);
			ctx.fillRect(10, 26, 44, 12);
		}));
		const zTex = trackTex(spriteTexture((ctx) => {
			ctx.clearRect(0, 0, 64, 64);
			ctx.fillStyle = "#f4f1ff";
			ctx.font = "700 40px sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText("z", 32, 34);
		}));
		const dustTex = trackTex(spriteTexture((ctx) => {
			const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 18);
			g.addColorStop(0, "rgba(255,255,255,0.9)");
			g.addColorStop(1, "rgba(255,255,255,0)");
			ctx.fillStyle = g;
			ctx.beginPath();
			ctx.arc(32, 32, 18, 0, Math.PI * 2);
			ctx.fill();
		}));
		const texByKind = {
			heart: heartTex,
			star: starTex,
			bubble: bubbleTex,
			crumb: crumbTex,
			plus: plusTex,
			zzz: zTex,
			dust: dustTex
		};
		const pool = [];
		for (let i = 0; i < 56; i++) {
			const sprite = new Sprite(trackMat(new SpriteMaterial({
				map: dustTex,
				transparent: true,
				depthWrite: false,
				opacity: 0,
				toneMapped: false
			})));
			sprite.visible = false;
			sprite.renderOrder = 8;
			scene.add(sprite);
			pool.push({
				sprite,
				active: false,
				life: 0,
				max: 1,
				vx: 0,
				vy: 0,
				vz: 0,
				gravity: 0,
				spin: 0,
				base: .2
			});
		}
		const burst = (kind, x, y, z, count, spread = .35) => {
			if (reduce) return;
			let left = count;
			for (const particle of pool) {
				if (left <= 0) break;
				if (particle.active) continue;
				const mat = particle.sprite.material;
				mat.map = texByKind[kind] ?? starTex;
				mat.opacity = 1;
				particle.active = true;
				particle.life = 0;
				particle.max = .8 + Math.random() * .7;
				particle.vx = (Math.random() - .5) * spread;
				particle.vy = .25 + Math.random() * .7;
				particle.vz = (Math.random() - .5) * spread * .5;
				particle.gravity = kind === "bubble" || kind === "zzz" || kind === "dust" ? -.05 : .85;
				particle.spin = (Math.random() - .5) * 2;
				particle.base = kind === "dust" ? .08 : .16 + Math.random() * .12;
				particle.sprite.position.set(x + (Math.random() - .5) * .2, y, z);
				particle.sprite.scale.setScalar(particle.base);
				particle.sprite.visible = true;
				left -= 1;
			}
		};
		for (let i = 0; i < 16; i++) burst("dust", (Math.random() - .5) * 3, .4 + Math.random() * 2.2, (Math.random() - .5) * 1.5, 1, .01);
		let petBaseWidth = 1.35;
		let petBaseHeight = 2.42;
		let loadedSkin = "";
		let loadToken = 0;
		let currentTex = null;
		const loader = new TextureLoader();
		const applySkin = (id) => {
			if (!id || id === loadedSkin) return;
			loadedSkin = id;
			const token = ++loadToken;
			loader.load(`/assets/pets/${id}.png`, (loaded) => {
				if (token !== loadToken) {
					loaded.dispose();
					return;
				}
				loaded.colorSpace = SRGBColorSpace;
				loaded.anisotropy = renderer.capabilities.getMaxAnisotropy();
				loaded.minFilter = LinearMipmapLinearFilter;
				loaded.magFilter = LinearFilter;
				loaded.generateMipmaps = true;
				if (currentTex) currentTex.dispose();
				currentTex = loaded;
				petMat.map = loaded;
				petMat.opacity = 1;
				petMat.needsUpdate = true;
				mirrorMat.uniforms.map.value = loaded;
				mirror.visible = true;
				const aspect = loaded.image.width / Math.max(1, loaded.image.height);
				petBaseHeight = 2.42;
				petBaseWidth = petBaseHeight * aspect;
			}, void 0, () => {
				petMat.color.set("#f0c2cf");
			});
		};
		applySkin(skinRef.current);
		const raycaster = new Raycaster();
		const pointer = new Vector2();
		let lastTapAt = 0;
		const onPointerDown = (event) => {
			const rect = renderer.domElement.getBoundingClientRect();
			pointer.x = (event.clientX - rect.left) / rect.width * 2 - 1;
			pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
			raycaster.setFromCamera(pointer, camera);
			if (raycaster.intersectObject(pet, false).length && performance.now() - lastTapAt > 380) {
				lastTapAt = performance.now();
				tapRef.current?.();
			}
		};
		const onPointerMove = (event) => {
			const rect = renderer.domElement.getBoundingClientRect();
			pointer.x = (event.clientX - rect.left) / rect.width * 2 - 1;
			pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
			raycaster.setFromCamera(pointer, camera);
			renderer.domElement.style.cursor = raycaster.intersectObject(pet, false).length ? "pointer" : "default";
		};
		renderer.domElement.addEventListener("pointerdown", onPointerDown);
		renderer.domElement.addEventListener("pointermove", onPointerMove);
		const anchor = {
			x: HOME.x,
			z: HOME.z
		};
		let activeAction = "";
		let actionTime = 0;
		let elapsed = 0;
		let night = sleeping ? 1 : 0;
		let fidget = 2.2;
		let zzzClock = 0;
		let dustClock = 0;
		let sparkleClock = 0;
		let last = performance.now();
		let animationId = 0;
		const dayFog = new Color("#efe6ff");
		const nightFog = new Color("#161326");
		const resize = () => {
			const width = Math.max(1, mount.clientWidth);
			const height = Math.max(1, mount.clientHeight);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height, false);
		};
		const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
		observer?.observe(mount);
		window.addEventListener("resize", resize);
		resize();
		const animate = (now) => {
			animationId = requestAnimationFrame(animate);
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			elapsed += dt;
			if (skinRef.current !== loadedSkin) applySkin(skinRef.current);
			const nextAction = actionRef.current || "";
			if (nextAction !== activeAction) {
				activeAction = nextAction;
				actionTime = 0;
				const headY = pet.position.y + .35;
				if (nextAction === "pet-hop") burst("heart", anchor.x, headY, anchor.z, 8, .7);
				if (nextAction === "pet-eat") burst("crumb", BOWL.x, .45, BOWL.z, 7, .35);
				if (nextAction === "pet-bath") burst("bubble", TUB.x, .7, TUB.z, 10, .55);
				if (nextAction === "pet-heal") burst("plus", anchor.x, headY, anchor.z, 7, .4);
				if (nextAction === "pet-play") burst("star", anchor.x, headY, anchor.z, 8, .8);
				if (nextAction === "pet-sparkle") burst("star", anchor.x, headY + .2, anchor.z, 12, .9);
				if (nextAction === "pet-sleep") burst("zzz", BED.x, 1.7, BED.z, 4, .2);
				if (nextAction === "pet-wake") burst("star", anchor.x, 1.6, anchor.z, 5, .4);
			} else actionTime += dt;
			const asleep = sleepRef.current;
			night = MathUtils.damp(night, asleep ? 1 : 0, 1.8, dt);
			background.copy(bgDay).lerp(bgNight, night);
			if (scene.fog) scene.fog.color.copy(dayFog).lerp(nightFog, night);
			sky.uniforms.night.value = night;
			sky.uniforms.time.value = elapsed;
			key.intensity = MathUtils.lerp(2.45, .18, night);
			windowLight.intensity = MathUtils.lerp(.9, .28, night);
			windowLight.color.set(asleep ? "#b7c4ff" : "#d5e6ff");
			hemi.intensity = MathUtils.lerp(1.35, .16, night);
			hemi.color.set(asleep ? "#9aa4d6" : "#fff8f2");
			lampLight.intensity = MathUtils.lerp(.35, 3.4, night);
			bulbMat.emissiveIntensity = MathUtils.lerp(.25, 1.8, night);
			renderer.toneMappingExposure = MathUtils.lerp(1.08, .7, night);
			floorMat.color.setRGB(MathUtils.lerp(1, .42, night), MathUtils.lerp(1, .4, night), MathUtils.lerp(1, .62, night));
			cloudMat.opacity = MathUtils.lerp(.92, .05, night);
			lights.forEach((mesh, i) => {
				const mat = mesh.material;
				mat.emissiveIntensity = .45 + Math.sin(elapsed * 3 + i) * .35 + night * .4;
			});
			let target = HOME;
			if (asleep) target = BED;
			else if (activeAction === "pet-eat") target = BOWL;
			else if (activeAction === "pet-bath") target = TUB;
			const follow = reduce ? 8 : 3.1;
			anchor.x = MathUtils.damp(anchor.x, target.x, follow, dt);
			anchor.z = MathUtils.damp(anchor.z, target.z, follow, dt);
			const moving = Math.hypot(anchor.x - target.x, anchor.z - target.z) > .03;
			let lift = 0;
			let rotZ = 0;
			let rotY = 0;
			let sx = 1;
			let sy = 1;
			if (!reduce && !asleep && !activeAction) {
				lift += Math.sin(elapsed * 2.15) * .04;
				rotZ += Math.sin(elapsed * 1.25) * .02;
				sx += Math.sin(elapsed * 2.15) * .012;
				sy -= Math.sin(elapsed * 2.15) * .012;
				fidget -= dt;
				if (fidget <= 0) fidget = 3.4 + Math.random() * 2.4;
				if (fidget < .45) lift += Math.sin((1 - fidget / .45) * Math.PI) * .12;
			}
			if (moving && !reduce) {
				lift += Math.abs(Math.sin(elapsed * 11)) * .07;
				rotZ += Math.sin(elapsed * 11) * .06;
			}
			if (activeAction === "pet-hop" && actionTime < .72) {
				const p = actionTime / .72;
				lift += Math.sin(p * Math.PI) * .48;
				const squash = Math.sin(p * Math.PI);
				sy += squash * .08;
				sx -= squash * .05;
				rotZ += Math.sin(p * Math.PI * 2) * .08;
			}
			if (activeAction === "pet-eat") {
				const chew = Math.sin(actionTime * 14);
				sy += chew * .045;
				sx -= chew * .03;
				rotZ += .06 + chew * .03;
				if (!reduce && Math.floor(actionTime * 6) !== Math.floor((actionTime - dt) * 6)) burst("crumb", anchor.x + .15, .55, anchor.z, 1, .15);
			}
			if (activeAction === "pet-bath") {
				rotZ += Math.sin(actionTime * 28) * (reduce ? .03 : .16);
				if (!reduce && actionTime < 1.4 && Math.floor(actionTime * 8) !== Math.floor((actionTime - dt) * 8)) burst("bubble", anchor.x, pet.position.y * .55, anchor.z, 1, .4);
				waterMat.opacity = .55 + Math.sin(elapsed * 10) * .2;
			} else waterMat.opacity = MathUtils.damp(waterMat.opacity, .72, 2, dt);
			if (activeAction === "pet-heal") {
				lift += .08 + Math.sin(actionTime * 5) * .04;
				const auraMat = aura.material;
				auraMat.opacity = Math.max(0, .85 - actionTime);
				aura.scale.setScalar(1 + actionTime * .85);
				auraMat.color.set("#9cf0c8");
			} else if (activeAction === "pet-sparkle") {
				rotY = Math.min(1, actionTime / .85) * Math.PI * 2;
				const auraMat = aura.material;
				auraMat.opacity = Math.max(0, .9 - actionTime * .8);
				aura.scale.setScalar(.6 + actionTime);
				auraMat.color.set("#ffe08a");
			} else {
				const auraMat = aura.material;
				auraMat.opacity = MathUtils.damp(auraMat.opacity, 0, 3, dt);
			}
			if (activeAction === "pet-play") {
				lift += Math.abs(Math.sin(actionTime * 9)) * (reduce ? .05 : .2);
				rotZ += Math.sin(actionTime * 9) * .08;
				rotY = Math.sin(actionTime * 4) * .35;
			}
			if (activeAction === "pet-wake" && actionTime < .7) {
				const p = Math.sin(actionTime / .7 * Math.PI);
				sy += p * .1;
				sx -= p * .06;
				lift += p * .05;
			}
			if (asleep) {
				lift = Math.sin(elapsed * 1.45) * .018;
				rotZ = -.14 + Math.sin(elapsed * .7) * .012;
				sy = .96 + Math.sin(elapsed * 1.45) * .015;
				sx = 1.03;
				zzzClock += dt;
				if (zzzClock > .85) {
					zzzClock = 0;
					burst("zzz", anchor.x + .15, 1.85, anchor.z, 1, .05);
				}
			}
			const vibe = vibeRef.current;
			if (vibe === "sick") petMat.color.set("#e4d7dc");
			else if (vibe === "dirty") petMat.color.set("#efe2cc");
			else if (vibe === "hungry") petMat.color.set("#fff1e4");
			else petMat.color.set("#ffffff");
			pet.scale.set(petBaseWidth * sx, petBaseHeight * sy, 1);
			const half = petBaseHeight * sy / 2;
			pet.position.set(anchor.x, half + lift + .02, anchor.z);
			pet.rotation.z = rotZ;
			pet.rotation.y = rotY;
			shadow.position.set(anchor.x, .03, anchor.z + .02);
			const shadowScale = MathUtils.clamp(1.05 - lift * .55, .55, 1.15);
			shadow.scale.set(shadowScale, shadowScale, 1);
			shadow.material.opacity = .16 + (1 - night) * .06;
			mirror.position.set(anchor.x, .04, anchor.z);
			mirror.scale.set(pet.scale.x * .92, pet.scale.y * .42, 1);
			mirror.rotation.z = -rotZ * .25;
			mirrorMat.uniforms.opacity.value = asleep ? .08 : .2;
			aura.position.set(anchor.x, .85 + lift, anchor.z);
			aura.rotation.x = Math.PI / 2.4;
			aura.rotation.z = elapsed;
			const camX = anchor.x * .22 + .28;
			const camY = 1.9 + (reduce ? 0 : Math.sin(elapsed * .4) * .04) + night * .06;
			const camZ = 6.35 - (activeAction && !asleep ? .28 : 0) - (asleep ? .05 : 0);
			camera.position.x = MathUtils.damp(camera.position.x, camX, 2.2, dt);
			camera.position.y = MathUtils.damp(camera.position.y, camY, 2.2, dt);
			camera.position.z = MathUtils.damp(camera.position.z, camZ, 2.2, dt);
			look.set(anchor.x * .35, 1.16, .05);
			camera.lookAt(look);
			if (!reduce) {
				curtainL.rotation.z = Math.sin(elapsed * .8) * .04;
				curtainR.rotation.z = -Math.sin(elapsed * .7 + 1) * .045;
				plant.rotation.z = Math.sin(elapsed * .9) * .08;
				plantB.rotation.z = Math.sin(elapsed * 1.1 + .6) * .1;
				mobile.rotation.y = elapsed * .35;
				mobileStars.forEach((star, i) => {
					star.rotation.y = elapsed * (1.2 + i * .3);
					star.rotation.x = elapsed * .8;
				});
				const bounce = Math.abs(Math.sin(elapsed * 1.6));
				ball.position.y = .16 + bounce * bounce * .18;
				ball.rotation.z = elapsed * .8;
				ballStripe.position.copy(ball.position);
				ballStripe.rotation.z = ball.rotation.z;
				blanket.position.y = .38 + (asleep ? Math.sin(elapsed * 1.4) * .01 : 0);
				clouds.forEach((cloud, i) => {
					cloud.position.x = -.35 + i * .4 + Math.sin(elapsed * .15 + i) * .12;
				});
			}
			const time = /* @__PURE__ */ new Date();
			const minutes = time.getMinutes();
			const hours = time.getHours() % 12;
			minutePivot.rotation.z = -(minutes / 60 * Math.PI * 2);
			hourPivot.rotation.z = -((hours + minutes / 60) / 12 * Math.PI * 2);
			dustClock += dt;
			if (dustClock > (vibe === "dirty" ? .18 : vibe === "great" ? .55 : .34)) {
				dustClock = 0;
				burst(vibe === "great" && Math.random() < .45 ? "star" : "dust", (Math.random() - .5) * 3.2, .2 + Math.random() * 2.2, -.4 + Math.random() * 1.6, 1, .02);
			}
			if (vibe === "play" && !activeAction) {
				sparkleClock += dt;
				if (sparkleClock > .7) {
					sparkleClock = 0;
					burst("star", anchor.x, pet.position.y + .2, anchor.z, 1, .3);
				}
			}
			for (const particle of pool) {
				if (!particle.active) continue;
				particle.life += dt;
				const t = particle.life / particle.max;
				if (t >= 1) {
					particle.active = false;
					particle.sprite.visible = false;
					continue;
				}
				particle.vy -= particle.gravity * dt;
				particle.sprite.position.x += particle.vx * dt;
				particle.sprite.position.y += particle.vy * dt;
				particle.sprite.position.z += particle.vz * dt;
				particle.sprite.material.rotation += particle.spin * dt;
				const mat = particle.sprite.material;
				mat.opacity = 1 - t;
				particle.sprite.scale.setScalar(particle.base * (1 + t * .4));
			}
			renderer.render(scene, camera);
		};
		animationId = requestAnimationFrame(animate);
		return () => {
			loadToken += 1;
			cancelAnimationFrame(animationId);
			window.removeEventListener("resize", resize);
			observer?.disconnect();
			renderer.domElement.removeEventListener("pointerdown", onPointerDown);
			renderer.domElement.removeEventListener("pointermove", onPointerMove);
			if (currentTex) currentTex.dispose();
			geometries.forEach((geometry) => geometry.dispose());
			materials.forEach((material) => material.dispose());
			textures.forEach((texture) => texture.dispose());
			renderer.dispose();
			renderer.domElement.remove();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "game-scene",
		ref: mountRef
	});
}
var SAVE_KEY = "tangoworld-save-v1";
var MAX_OFFLINE_SECONDS = 43200;
var SKINS = [
	{
		id: "dog_star",
		name: "Estrellita",
		price: 0,
		rarity: "Inicial",
		desc: "Tu compañero de aventuras, siempre listo para jugar."
	},
	{
		id: "dog_bubble",
		name: "Burbujeante",
		price: 38,
		rarity: "Común",
		desc: "Una apariencia alegre, ligera y llena de burbujas."
	},
	{
		id: "dog_bard",
		name: "Bardo",
		price: 52,
		rarity: "Especial",
		desc: "El músico oficial de las tardes de juego."
	},
	{
		id: "dog_cyborg",
		name: "Cibermascota",
		price: 95,
		rarity: "Épica",
		desc: "Tecnología, luces y mucha actitud futurista."
	},
	{
		id: "dog_worker",
		name: "Manos a la obra",
		price: 48,
		rarity: "Común",
		desc: "Siempre encuentra algo divertido que construir."
	},
	{
		id: "dog_mummy",
		name: "Momimiau",
		price: 72,
		rarity: "Especial",
		desc: "Un misterio adorable salido de una antigua pirámide."
	},
	{
		id: "dog_boxer",
		name: "Campeón",
		price: 66,
		rarity: "Especial",
		desc: "Entrenado para competir y celebrar cada victoria."
	},
	{
		id: "dog_flower",
		name: "Florecita",
		price: 56,
		rarity: "Común",
		desc: "Una apariencia fresca que ilumina la habitación."
	},
	{
		id: "dog_mage",
		name: "Pequeño mago",
		price: 88,
		rarity: "Épica",
		desc: "Un toque de magia para cada día."
	},
	{
		id: "dog_runner",
		name: "Velocista",
		price: 62,
		rarity: "Especial",
		desc: "Rápido, juguetón y preparado para la carrera."
	}
];
var ITEMS = [
	{
		id: "kibble",
		name: "Croquetas",
		icon: "🥣",
		category: "Comida",
		price: 8,
		desc: "Una comida equilibrada.",
		effects: { hunger: 26 },
		use: "Comer"
	},
	{
		id: "apple",
		name: "Manzana dulce",
		icon: "🍎",
		category: "Comida",
		price: 7,
		desc: "Un bocadito fresco y crujiente.",
		effects: {
			hunger: 17,
			fun: 4
		},
		use: "Comer"
	},
	{
		id: "treat",
		name: "Galletita",
		icon: "🦴",
		category: "Comida",
		price: 12,
		desc: "Un premio rico y divertido.",
		effects: {
			hunger: 12,
			fun: 13
		},
		use: "Comer"
	},
	{
		id: "medkit",
		name: "Botiquín",
		icon: "🩹",
		category: "Cuidados",
		price: 18,
		desc: "Ayuda a recuperar el bienestar.",
		effects: { health: 34 },
		use: "Usar"
	},
	{
		id: "soap",
		name: "Jabón suave",
		icon: "🫧",
		category: "Cuidados",
		price: 7,
		desc: "Para un baño reluciente.",
		effects: {},
		use: "Usar"
	},
	{
		id: "tennis",
		name: "Pelota saltarina",
		icon: "🎾",
		category: "Juguetes",
		price: 13,
		desc: "¡Perfecta para entretenerse!",
		effects: { fun: 22 },
		use: "Jugar"
	}
];
var STAT_META = {
	hunger: {
		label: "Hambre",
		icon: "🍎",
		color: "coral",
		low: "¡Tengo hambre!"
	},
	sleep: {
		label: "Sueño",
		icon: "🌙",
		color: "lavender",
		low: "Me vendría bien una siesta."
	},
	health: {
		label: "Salud",
		icon: "💗",
		color: "mint",
		low: "Necesito algunos cuidados."
	},
	dirt: {
		label: "Limpieza",
		icon: "🫧",
		color: "blue",
		low: "¡Hora de un baño!"
	},
	fun: {
		label: "Diversión",
		icon: "⭐",
		color: "yellow",
		low: "¿Jugamos un ratito?"
	}
};
var INITIAL_GAME = {
	stats: {
		hunger: 78,
		sleep: 82,
		health: 94,
		dirt: 16,
		fun: 74
	},
	coins: 45,
	inventory: {
		kibble: 3,
		apple: 1,
		treat: 0,
		medkit: 1,
		soap: 2,
		tennis: 1
	},
	unlockedSkins: ["dog_star"],
	equippedSkin: "dog_star",
	sleeping: false,
	lastUpdate: Date.now(),
	lastDailyBonus: "",
	lastCareReward: 0
};
var clamp = (n, min = 0, max = 100) => Math.min(max, Math.max(min, n));
function careRewardFields(prev) {
	const now = Date.now();
	return now - (prev.lastCareReward || 0) >= 9e4 ? {
		coins: prev.coins + 2,
		lastCareReward: now
	} : {};
}
var todayKey = () => {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};
function advanceTime(source, now = Date.now()) {
	const prev = source || INITIAL_GAME;
	const elapsed = Math.min(MAX_OFFLINE_SECONDS, Math.max(0, (now - (prev.lastUpdate || now)) / 1e3));
	if (elapsed < 1) return {
		...prev,
		lastUpdate: now
	};
	const minutes = elapsed / 60;
	const stats = { ...prev.stats };
	if (prev.sleeping) {
		stats.sleep += 1.5 * minutes;
		stats.hunger -= .28 * minutes;
		stats.fun -= .09 * minutes;
		stats.dirt += .09 * minutes;
	} else {
		stats.hunger -= .62 * minutes;
		stats.sleep -= .48 * minutes;
		stats.fun -= .42 * minutes;
		stats.dirt += .25 * minutes;
	}
	const criticalNeeds = [
		stats.hunger < 18,
		stats.sleep < 15,
		stats.fun < 14,
		stats.dirt > 86
	].filter(Boolean).length;
	if (criticalNeeds > 0) stats.health -= (.24 + criticalNeeds * .18) * minutes;
	else if (stats.hunger > 52 && stats.sleep > 45 && stats.dirt < 56) stats.health += .055 * minutes;
	Object.keys(stats).forEach((key) => {
		stats[key] = clamp(stats[key]);
	});
	return {
		...prev,
		stats,
		lastUpdate: now
	};
}
function loadSave() {
	try {
		const raw = localStorage.getItem(SAVE_KEY);
		if (!raw) return {
			...INITIAL_GAME,
			lastUpdate: Date.now()
		};
		const saved = JSON.parse(raw);
		return advanceTime({
			...INITIAL_GAME,
			...saved,
			stats: {
				...INITIAL_GAME.stats,
				...saved.stats || {}
			},
			inventory: {
				...INITIAL_GAME.inventory,
				...saved.inventory || {}
			},
			unlockedSkins: Array.isArray(saved.unlockedSkins) && saved.unlockedSkins.length ? saved.unlockedSkins : ["dog_star"]
		});
	} catch {
		return {
			...INITIAL_GAME,
			lastUpdate: Date.now()
		};
	}
}
var sharedAudio = null;
function getAudioContext() {
	if (typeof window === "undefined") return null;
	const AudioCtx = window.AudioContext || window.webkitAudioContext;
	if (!AudioCtx) return null;
	if (!sharedAudio || sharedAudio.state === "closed") sharedAudio = new AudioCtx();
	if (sharedAudio.state === "suspended") sharedAudio.resume().catch(() => {});
	return sharedAudio;
}
function useSound({ enabled, type = "tap" }) {
	return { play: (0, import_react.useCallback)(() => {
		if (!enabled) return;
		try {
			const ctx = getAudioContext();
			if (!ctx) return;
			const now = ctx.currentTime;
			(type === "success" ? [
				523,
				659,
				784
			] : type === "eat" ? [392, 494] : type === "sleep" ? [
				349,
				294,
				247
			] : type === "splash" ? [
				520,
				680,
				860
			] : type === "heal" ? [
				440,
				554,
				659
			] : [520, 640]).forEach((freq, index) => {
				const oscillator = ctx.createOscillator();
				const gain = ctx.createGain();
				oscillator.type = type === "sleep" ? "triangle" : "sine";
				oscillator.frequency.setValueAtTime(freq, now + index * .07);
				gain.gain.setValueAtTime(1e-4, now + index * .07);
				gain.gain.exponentialRampToValueAtTime(.045, now + index * .07 + .02);
				gain.gain.exponentialRampToValueAtTime(1e-4, now + index * .07 + .18);
				oscillator.connect(gain);
				gain.connect(ctx.destination);
				oscillator.start(now + index * .07);
				oscillator.stop(now + index * .07 + .2);
			});
		} catch {}
	}, [enabled, type]) };
}
function getMood(stats, sleeping) {
	if (sleeping) return {
		emoji: "💤",
		title: "Dulces sueños",
		text: "Descansar también es una aventura."
	};
	if (stats.health < 35) return {
		emoji: "🩹",
		title: "Necesito cuidados",
		text: "Un poquito de atención me hará bien."
	};
	if (stats.hunger < 27) return {
		emoji: "🍎",
		title: "¡Tengo hambre!",
		text: "¿Compartimos algo rico?"
	};
	if (stats.sleep < 23) return {
		emoji: "🥱",
		title: "Tengo sueñito",
		text: "Una siesta me dejaría como nuevo."
	};
	if (stats.dirt > 75) return {
		emoji: "🫧",
		title: "¡Qué baño!",
		text: "Un poco de agua y jabón, por favor."
	};
	if (stats.fun < 25) return {
		emoji: "🎾",
		title: "¿Jugamos?",
		text: "¡Tengo ganas de hacer algo divertido!"
	};
	if (Math.min(stats.hunger, stats.sleep, stats.health, 100 - stats.dirt, stats.fun) > 72) return {
		emoji: "✨",
		title: "¡Estoy genial!",
		text: "Gracias por cuidarme tan bien."
	};
	return {
		emoji: "🐾",
		title: "¡Hola, compi!",
		text: "¿Qué aventura tenemos hoy?"
	};
}
function getVibe(stats, sleeping) {
	if (sleeping) return "sleepy";
	if (stats.health < 35) return "sick";
	if (stats.dirt > 75) return "dirty";
	if (stats.hunger < 27) return "hungry";
	if (stats.fun < 25) return "play";
	if (Math.min(stats.hunger, stats.sleep, stats.health, 100 - stats.dirt, stats.fun) > 72) return "great";
	return "ok";
}
function App() {
	const [game, setGame] = (0, import_react.useState)(INITIAL_GAME);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [view, setView] = (0, import_react.useState)("room");
	const [modal, setModal] = (0, import_react.useState)("");
	const [notice, setNotice] = (0, import_react.useState)("");
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [shopFilter, setShopFilter] = (0, import_react.useState)("Todo");
	const [bathStep, setBathStep] = (0, import_react.useState)(0);
	const [bathStarted, setBathStarted] = (0, import_react.useState)(false);
	const [resetConfirm, setResetConfirm] = (0, import_react.useState)(false);
	const [petAnimation, setPetAnimation] = (0, import_react.useState)("");
	const [activeMiniGame, setActiveMiniGame] = (0, import_react.useState)("");
	const noticeTimer = (0, import_react.useRef)(null);
	const actionTimer = (0, import_react.useRef)(null);
	const rewardLock = (0, import_react.useRef)(false);
	const tapSound = useSound({
		enabled: !muted,
		type: "tap"
	});
	const successSound = useSound({
		enabled: !muted,
		type: "success"
	});
	const eatSound = useSound({
		enabled: !muted,
		type: "eat"
	});
	const sleepSound = useSound({
		enabled: !muted,
		type: "sleep"
	});
	const splashSound = useSound({
		enabled: !muted,
		type: "splash"
	});
	const healSound = useSound({
		enabled: !muted,
		type: "heal"
	});
	const playAction = (0, import_react.useCallback)((name, ms) => {
		setPetAnimation(name);
		if (actionTimer.current) clearTimeout(actionTimer.current);
		actionTimer.current = window.setTimeout(() => {
			setPetAnimation((current) => current === name ? "" : current);
		}, ms);
	}, []);
	const notify = (0, import_react.useCallback)((message) => {
		setNotice(message);
		if (noticeTimer.current) clearTimeout(noticeTimer.current);
		noticeTimer.current = setTimeout(() => setNotice(""), 2600);
	}, []);
	(0, import_react.useLayoutEffect)(() => {
		setGame(loadSave());
		setReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return void 0;
		const interval = setInterval(() => setGame((prev) => advanceTime(prev)), 5e3);
		return () => clearInterval(interval);
	}, [ready]);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		try {
			localStorage.setItem(SAVE_KEY, JSON.stringify(game));
		} catch {}
	}, [game, ready]);
	(0, import_react.useEffect)(() => () => {
		if (noticeTimer.current) clearTimeout(noticeTimer.current);
		if (actionTimer.current) clearTimeout(actionTimer.current);
	}, []);
	const mood = (0, import_react.useMemo)(() => getMood(game.stats, game.sleeping), [game.stats, game.sleeping]);
	const vibe = (0, import_react.useMemo)(() => getVibe(game.stats, game.sleeping), [game.stats, game.sleeping]);
	const totalItems = Object.values(game.inventory).reduce((sum, qty) => sum + qty, 0);
	const petTap = () => {
		tapSound.play();
		playAction(game.sleeping ? "pet-sleep" : "pet-hop", game.sleeping ? 900 : 900);
		setGame((prev) => ({
			...prev,
			...careRewardFields(prev),
			stats: {
				...prev.stats,
				fun: clamp(prev.stats.fun + (prev.sleeping ? 1 : 2))
			}
		}));
		notify(game.sleeping ? "Shhh… un cariño suavecito. 💤" : "¡Qué cosquillas! 🐾");
	};
	const applyItem = (item) => {
		if ((game.inventory[item.id] || 0) < 1) {
			notify(`No te quedan: ${item.name.toLowerCase()}. Puedes conseguir más en la tienda.`);
			return;
		}
		if (item.id === "soap") {
			openBath();
			return;
		}
		if (item.id === "medkit" && game.stats.health >= 98) {
			notify("Ya está estupenda. Guarda el botiquín para cuando haga falta.");
			return;
		}
		setGame((prev) => {
			if ((prev.inventory[item.id] || 0) < 1) return prev;
			if (item.id === "medkit" && prev.stats.health >= 98) return prev;
			const inventory = {
				...prev.inventory,
				[item.id]: Math.max(0, (prev.inventory[item.id] || 0) - 1)
			};
			const stats = { ...prev.stats };
			Object.entries(item.effects).forEach(([key, amount]) => {
				stats[key] = clamp(stats[key] + amount);
			});
			return {
				...prev,
				...careRewardFields(prev),
				inventory,
				stats
			};
		});
		const anim = item.category === "Comida" ? "pet-eat" : item.id === "tennis" ? "pet-play" : item.id === "medkit" ? "pet-heal" : "pet-hop";
		playAction(anim, item.category === "Comida" ? 1700 : 1200);
		(item.category === "Comida" ? eatSound : item.id === "medkit" ? healSound : successSound).play();
		notify(`${item.name}: ¡qué bien sienta!`);
		if (modal && item.id !== "soap") setModal("");
	};
	const toggleSleep = () => {
		if (game.sleeping) {
			setGame((prev) => ({
				...prev,
				...careRewardFields(prev),
				sleeping: false,
				lastUpdate: Date.now()
			}));
			playAction("pet-wake", 1200);
			notify("¡Buenos días! ¿Qué hacemos hoy?");
			tapSound.play();
		} else {
			setGame((prev) => ({
				...prev,
				...careRewardFields(prev),
				sleeping: true,
				lastUpdate: Date.now()
			}));
			playAction("pet-sleep", 1e3);
			notify("Buenas noches… la energía se recuperará poco a poco.");
			sleepSound.play();
		}
	};
	const buyItem = (item) => {
		let bought = false;
		setGame((prev) => {
			if (prev.coins < item.price) return prev;
			bought = true;
			return {
				...prev,
				coins: prev.coins - item.price,
				inventory: {
					...prev.inventory,
					[item.id]: (prev.inventory[item.id] || 0) + 1
				}
			};
		});
		if (!bought) {
			notify("Te faltan monedas. ¡Prueba un minijuego para ganar más!");
			return;
		}
		successSound.play();
		notify(`${item.name} añadido al inventario.`);
	};
	const buyOrEquipSkin = (skin) => {
		if (game.unlockedSkins.includes(skin.id)) {
			if (game.equippedSkin !== skin.id) playAction("pet-sparkle", 1100);
			setGame((prev) => ({
				...prev,
				equippedSkin: skin.id
			}));
			successSound.play();
			notify(`${skin.name} está lista para la aventura.`);
			return;
		}
		let unlocked = false;
		setGame((prev) => {
			if (prev.unlockedSkins.includes(skin.id)) return {
				...prev,
				equippedSkin: skin.id
			};
			if (prev.coins < skin.price) return prev;
			unlocked = true;
			return {
				...prev,
				coins: prev.coins - skin.price,
				unlockedSkins: [...prev.unlockedSkins, skin.id],
				equippedSkin: skin.id
			};
		});
		if (!unlocked && game.coins < skin.price) {
			notify("Todavía faltan algunas monedas para desbloquear esta apariencia.");
			return;
		}
		playAction("pet-sparkle", 1100);
		successSound.play();
		notify(`¡Desbloqueaste ${skin.name}!`);
	};
	const openBath = () => {
		if (!(bathStarted && bathStep < 3)) {
			setBathStep(0);
			setBathStarted(false);
		}
		setModal("bath");
	};
	const beginBathStroke = () => {
		if (!bathStarted) {
			if ((game.inventory.soap || 0) < 1) {
				notify("Necesitas jabón suave. Puedes comprarlo en la tienda.");
				setModal("shop");
				setShopFilter("Cuidados");
				return;
			}
			setGame((prev) => ({
				...prev,
				inventory: {
					...prev.inventory,
					soap: prev.inventory.soap - 1
				}
			}));
			setBathStarted(true);
		}
		const nextStep = bathStep + 1;
		setBathStep(nextStep);
		playAction("pet-bath", 1600);
		splashSound.play();
		if (nextStep >= 3) {
			setGame((prev) => ({
				...prev,
				...careRewardFields(prev),
				stats: {
					...prev.stats,
					dirt: clamp(prev.stats.dirt - 42),
					fun: clamp(prev.stats.fun + 6)
				}
			}));
			successSound.play();
			notify("¡Quedó impecable! +6 de diversión.");
			setBathStep(3);
		} else setGame((prev) => ({
			...prev,
			stats: {
				...prev.stats,
				dirt: clamp(prev.stats.dirt - 10)
			}
		}));
	};
	const finishMiniGame = (reward, funGain, label) => {
		if (rewardLock.current) return;
		rewardLock.current = true;
		setGame((prev) => ({
			...prev,
			coins: prev.coins + reward,
			stats: {
				...prev.stats,
				fun: clamp(prev.stats.fun + funGain)
			}
		}));
		setModal("");
		setActiveMiniGame("");
		setView("room");
		playAction("pet-play", 1200);
		successSound.play();
		notify(`${label}: +${reward} monedas y +${funGain} diversión.`);
	};
	const takeDailyBonus = () => {
		const key = todayKey();
		if (game.lastDailyBonus === key) {
			notify("El regalo de hoy ya está recogido. ¡Vuelve mañana!");
			return;
		}
		setGame((prev) => ({
			...prev,
			coins: prev.coins + 12,
			lastDailyBonus: key
		}));
		successSound.play();
		notify("¡Regalo diario! +12 monedas.");
	};
	const resetGame = () => {
		const fresh = {
			...INITIAL_GAME,
			lastUpdate: Date.now()
		};
		setGame(fresh);
		setResetConfirm(false);
		setModal("");
		try {
			localStorage.setItem(SAVE_KEY, JSON.stringify(fresh));
		} catch {}
		notify("Partida reiniciada. ¡Una nueva aventura comienza!");
	};
	const navTo = (next) => {
		setView(next);
		setModal("");
		setActiveMiniGame("");
		tapSound.play();
	};
	const openGames = (gameId = "") => {
		rewardLock.current = false;
		setActiveMiniGame(gameId);
		setModal("games");
	};
	const roomNote = game.sleeping ? "La habitación está tranquila: tu mascota está descansando." : "Una habitación pequeñita para aventuras enormes.";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `app-shell ${game.sleeping ? "is-sleeping" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "topbar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "brand-lockup",
					onClick: () => navTo("room"),
					role: "button",
					tabIndex: 0,
					onKeyDown: (e) => e.key === "Enter" && navTo("room"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "brand-mark",
						children: "🐾"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "brand-name",
						children: ["Tango", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "World" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "brand-tagline",
						children: "tu pequeña gran aventura"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "top-actions",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "daily-button",
							onClick: takeDailyBonus,
							title: "Recoge tus monedas diarias",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🎁" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hide-small",
								children: "Regalo diario"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "coin-pill",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "coin-icon",
									children: "✦"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: game.coins }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "coin-label",
									children: "monedas"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "icon-button sound-button",
							"aria-label": muted ? "Activar sonido" : "Silenciar sonido",
							title: muted ? "Activar sonido" : "Silenciar sonido",
							onClick: () => setMuted((value) => !value),
							children: muted ? "🔇" : "🔊"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "icon-button settings-button",
							"aria-label": "Configuración",
							title: "Configuración",
							onClick: () => setModal("settings"),
							children: "⚙️"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "main-layout",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "room-column",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "section-kicker",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "status-dot" }),
								" TU REFUGIO ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tiny-sparkle",
									children: "✦"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "room-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "room-heading",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "¡Hola, compi!" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: roomNote })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `mood-pill mood-${vibe}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: mood.emoji }), mood.title]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `scene-wrap ${game.sleeping ? "is-night" : "is-day"} ${petAnimation}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameScene, {
											skin: game.equippedSkin,
											sleeping: game.sleeping,
											action: petAnimation,
											vibe,
											onPetTap: petTap
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "scene-vignette" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FxBurst, { kind: petAnimation }),
										game.sleeping && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sleep-overlay",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "z" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "z" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "z" })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "scene-badge",
											children: game.sleeping ? "Noche en casa" : "Tarde suave"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "scene-caption",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "caption-paw",
													children: "🐾"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Toca para acariciar" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "caption-divider",
													children: "·"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: SKINS.find((s) => s.id === game.equippedSkin)?.name || "Tu mascota" })
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pet-dialogue",
									"aria-live": "polite",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "dialogue-face",
											children: mood.emoji
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: mood.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: mood.text })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "dialogue-sparkle",
											children: "✧"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "room-footer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "footer-star",
										children: "✦"
									}), " Toca a tu mascota para acariciarla"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "online-status",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), " progreso guardado"]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "care-section",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "section-title-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Cuidados rápidos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Pequeños gestos, grandes sonrisas." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "section-ornament",
									children: "✳"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "care-actions",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "care-action food-action",
										onClick: () => setModal("food"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "care-emoji",
												children: "🍎"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "care-label",
												children: "Comida"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "care-sublabel",
												children: "Dale energía"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: `care-action sleep-action ${game.sleeping ? "active-action" : ""}`,
										onClick: toggleSleep,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "care-emoji",
												children: game.sleeping ? "☀️" : "🌙"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "care-label",
												children: game.sleeping ? "Despertar" : "Dormir"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "care-sublabel",
												children: game.sleeping ? "Ya descansó" : "Recarga energía"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "care-action health-action",
										onClick: () => {
											if ((game.inventory.medkit || 0) > 0) applyItem(ITEMS.find((i) => i.id === "medkit"));
											else {
												setModal("shop");
												setShopFilter("Cuidados");
											}
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "care-emoji",
												children: "🩹"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "care-label",
												children: "Salud"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "care-sublabel",
												children: "Mímalo un poco"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "care-action bath-action",
										onClick: openBath,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "care-emoji",
												children: "🫧"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "care-label",
												children: "Baño"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "care-sublabel",
												children: "Brilla otra vez"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "care-action play-action",
										onClick: () => openGames(),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "care-emoji",
												children: "🎾"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "care-label",
												children: "Jugar"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "care-sublabel",
												children: "¡A divertirse!"
											})
										]
									})
								]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "side-column",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "status-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "side-card-heading",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "section-kicker",
										children: "BIENESTAR"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Así me siento" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "heart-badge",
										children: "♡"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "overall-wellbeing",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "wellbeing-ring",
										style: { "--ring-value": `${Math.round((game.stats.hunger + game.stats.sleep + game.stats.health + (100 - game.stats.dirt) + game.stats.fun) / 5)}%` },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: Math.round((game.stats.hunger + game.stats.sleep + game.stats.health + (100 - game.stats.dirt) + game.stats.fun) / 5) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "/100" })] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: Math.round((game.stats.hunger + game.stats.sleep + game.stats.health + (100 - game.stats.dirt) + game.stats.fun) / 5) > 74 ? "¡Todo genial!" : "Vamos paso a paso" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Mi bienestar general" })] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "stat-list",
									children: Object.entries(STAT_META).map(([key, meta]) => {
										const raw = game.stats[key];
										const value = key === "dirt" ? 100 - raw : raw;
										const display = key === "dirt" ? raw < 25 ? "Impecable" : raw < 60 ? "Necesita baño" : "¡Muy sucio!" : value < 22 ? "Bajito" : value < 55 ? "Regular" : value > 82 ? "Genial" : "Bien";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "stat-row",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "stat-topline",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "stat-name",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: `stat-icon stat-${meta.color}`,
															children: meta.icon
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: meta.label })]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "stat-value",
														children: [Math.round(key === "dirt" ? 100 - raw : raw), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "/100" })]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "stat-track",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `stat-fill fill-${meta.color}`,
														style: { width: `${clamp(value)}%` }
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "stat-foot",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: display }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: key === "dirt" ? "limpieza" : "nivel" })]
												})
											]
										}, key);
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "status-tip",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💡" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: game.sleeping ? "Mientras duerme, recupera energía lentamente." : "Las necesidades cambian con el tiempo. ¡Un ratito de cuidado hace la diferencia!" })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "inventory-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "side-card-heading",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "section-kicker",
										children: "MOCHILA"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Mis cositas" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inventory-count",
										children: [
											totalItems,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "objetos" })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inventory-items",
									children: [ITEMS.filter((item) => (game.inventory[item.id] || 0) > 0).slice(0, 4).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "inventory-item",
										title: `${item.name}: ${game.inventory[item.id]}`,
										onClick: () => item.category === "Comida" ? setModal("food") : item.id === "soap" ? openBath() : applyItem(item),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.icon }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: game.inventory[item.id] })]
									}, item.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "inventory-add",
										onClick: () => setModal("shop"),
										"aria-label": "Abrir tienda",
										children: "＋"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "text-link",
									onClick: () => setModal("shop"),
									children: ["Ver tienda completa ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "↗" })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "quest-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "quest-spark",
									children: "✧"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "quest-copy",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "section-kicker",
											children: "RETO DEL DÍA"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Un ratito de diversión" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Juega un minijuego y gana monedas para tu próxima sorpresa." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "quest-button",
											onClick: () => openGames(),
											children: ["Aceptar reto ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "→" })]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "quest-art",
									children: "🎮"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "bottom-nav",
				"aria-label": "Navegación principal",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: view === "room" ? "selected" : "",
						onClick: () => navTo("room"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🏡" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Habitación" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: view === "shop" ? "selected" : "",
						onClick: () => {
							setView("shop");
							setModal("shop");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🛍️" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Tienda" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: view === "wardrobe" ? "selected" : "",
						onClick: () => {
							setView("wardrobe");
							setModal("wardrobe");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "👒" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Vestidor" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: view === "games" ? "selected" : "",
						onClick: () => {
							setView("games");
							openGames();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🎮" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Minijuegos" })]
					})
				]
			}),
			notice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "toast-message",
				role: "status",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✦" }), notice]
			}),
			modal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal-backdrop",
				onPointerDown: (event) => {
					if (event.target === event.currentTarget) {
						setModal("");
						setActiveMiniGame("");
						setView("room");
					}
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `modal-card ${modal === "games" && activeMiniGame ? "game-modal-card" : ""}`,
					role: "dialog",
					"aria-modal": "true",
					"aria-label": modal === "food" ? "Comida" : modal === "shop" ? "Tienda" : modal === "wardrobe" ? "Vestidor" : modal === "bath" ? "Baño" : modal === "games" ? "Minijuegos" : "Configuración",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "modal-close",
							"aria-label": "Cerrar",
							onClick: () => {
								setModal("");
								setActiveMiniGame("");
								setView("room");
							},
							children: "×"
						}),
						modal === "food" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FoodModal, {
							inventory: game.inventory,
							onUse: applyItem,
							onShop: () => setModal("shop")
						}),
						modal === "bath" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BathModal, {
							step: bathStep,
							started: bathStarted,
							soap: game.inventory.soap || 0,
							onScrub: beginBathStroke,
							onShop: () => {
								setModal("shop");
								setShopFilter("Cuidados");
							},
							onClose: () => setModal("")
						}),
						modal === "shop" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopModal, {
							items: ITEMS,
							inventory: game.inventory,
							coins: game.coins,
							filter: shopFilter,
							onFilter: setShopFilter,
							onBuy: buyItem
						}),
						modal === "wardrobe" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WardrobeModal, {
							skins: SKINS,
							unlocked: game.unlockedSkins,
							equipped: game.equippedSkin,
							coins: game.coins,
							onChoose: buyOrEquipSkin
						}),
						modal === "games" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GamesModal, {
							active: activeMiniGame,
							onSelect: setActiveMiniGame,
							onBack: () => setActiveMiniGame(""),
							onFinish: finishMiniGame
						}),
						modal === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsModal, {
							muted,
							onMute: () => setMuted((v) => !v),
							onReset: () => setResetConfirm(true),
							onClose: () => setModal("")
						}),
						resetConfirm && modal === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "confirm-layer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "confirm-box",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "confirm-icon",
										children: "⚠️"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "¿Empezar de nuevo?" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Se borrarán las monedas, los objetos y las apariencias desbloqueadas de esta partida." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "confirm-actions",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "secondary-button",
											onClick: () => setResetConfirm(false),
											children: "Cancelar"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "danger-button",
											onClick: resetGame,
											children: "Reiniciar"
										})]
									})
								]
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "site-footer",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✦ Tangoworld" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Una mascota, mil momentos." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Guardado local · sin cuentas" })
				]
			})
		]
	});
}
function FxBurst({ kind }) {
	if (!kind) return null;
	const bits = {
		"pet-hop": [
			"💗",
			"✨",
			"🤍",
			"💗",
			"✧"
		],
		"pet-eat": [
			"🍎",
			"✨",
			"🦴",
			"💛"
		],
		"pet-bath": [
			"🫧",
			"💧",
			"✨",
			"🫧",
			"✧"
		],
		"pet-heal": [
			"💗",
			"✨",
			"💚",
			"✦"
		],
		"pet-play": [
			"⭐",
			"🎾",
			"✨",
			"💛"
		],
		"pet-wake": [
			"☀️",
			"✨",
			"💛"
		],
		"pet-sparkle": [
			"✨",
			"✦",
			"⭐",
			"✧",
			"✨"
		],
		"pet-sleep": [
			"💤",
			"🌙",
			"✨",
			"z"
		]
	}[kind] || ["✨"];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `fx-layer fx-${kind}`,
		"aria-hidden": "true",
		children: bits.map((glyph, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "fx-bit",
			style: {
				"--dx": `${(index - (bits.length - 1) / 2) * 46}px`,
				animationDelay: `${index * .08}s`
			},
			children: glyph
		}, `${kind}-${index}`))
	});
}
function FoodModal({ inventory, onUse, onShop }) {
	const foodItems = ITEMS.filter((item) => item.category === "Comida");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "modal-eyebrow",
			children: "HORA DE COMER"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "¿Qué se te antoja?" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "modal-intro",
			children: "Una pancita feliz empieza con un buen bocadito."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "food-grid",
			children: foodItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "food-tile",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "food-art",
						children: item.icon
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "food-info",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.name }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.desc }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
								"+",
								item.effects.hunger,
								" hambre",
								item.effects.fun ? ` · +${item.effects.fun} diversión` : ""
							] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "food-action-area",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "quantity-chip",
							children: ["×", inventory[item.id] || 0]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "primary-small",
							disabled: (inventory[item.id] || 0) < 1,
							onClick: () => onUse(item),
							children: "Dar"
						})]
					})
				]
			}, item.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "modal-bottom-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "secondary-button",
				onClick: onShop,
				children: "Conseguir más comida ↗"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "helper-note",
				children: "Los objetos se guardan en tu mochila."
			})]
		})
	] });
}
function BathModal({ step, started, soap, onScrub, onShop, onClose }) {
	const done = step >= 3;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "modal-eyebrow",
			children: "SPA PARA MASCOTAS"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "¡Hora del baño!" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "modal-intro",
			children: "Un baño rápido para dejar el pelaje reluciente."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `bath-visual ${done ? "bath-done" : ""}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bath-bubble bubble-a",
					children: "○"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bath-bubble bubble-b",
					children: "✧"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bath-tub",
					children: "🛁"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bath-pet",
					children: done ? "✨" : step > 0 ? "🫧" : "🐶"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bath-bubble bubble-c",
					children: "○"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bath-progress-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: done ? "¡Baño terminado!" : `Paso ${step + 1} de 3` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: done ? "Mascota impecable" : `${Math.round(step / 3 * 100)}%` })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bath-track",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { width: `${step / 3 * 100}%` } })
		}),
		!done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "bath-instruction",
				children: step === 0 ? "Empieza con un poco de jabón suave." : step === 1 ? "¡Muy bien! Frota con cuidado." : "Un último enjuague y listo."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "primary-button full-button",
				onClick: onScrub,
				disabled: soap < 1 && !started,
				children: [
					soap < 1 && !started ? "Necesitas jabón" : step === 0 ? "Aplicar jabón y lavar" : step === 1 ? "Seguir lavando" : "Enjuagar y terminar",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✦" })
				]
			}),
			soap < 1 && !started && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "text-link centered-link",
				onClick: onShop,
				children: "Comprar jabón suave ↗"
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "primary-button full-button",
			onClick: onClose,
			children: ["¡Listo, qué limpito! ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "♡" })]
		})
	] });
}
function ShopModal({ items, inventory, coins, filter, onFilter, onBuy }) {
	const categories = [
		"Todo",
		"Comida",
		"Cuidados",
		"Juguetes"
	];
	const visibleItems = items.filter((item) => filter === "Todo" || item.category === filter);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "modal-eyebrow",
			children: "UN MERCADITO MUY ESPECIAL"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "modal-title-line",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "La tiendita" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "modal-intro",
				children: "Pequeñas cosas para cuidar y sorprender."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "coin-pill modal-coins",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "coin-icon",
					children: "✦"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: coins })]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "filter-pills",
			children: categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: filter === cat ? "filter-active" : "",
				onClick: () => onFilter(cat),
				children: cat
			}, cat))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shop-grid",
			children: visibleItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "shop-item-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "shop-item-top",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shop-item-art",
							children: item.icon
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shop-category",
							children: item.category
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: item.name }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.desc }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "shop-item-bottom",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
							className: "item-price",
							children: ["✦ ", item.price]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: ["En mochila: ", inventory[item.id] || 0] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "buy-button",
							onClick: () => onBuy(item),
							disabled: coins < item.price,
							children: "Comprar"
						})]
					})
				]
			}, item.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "shop-note",
			children: "Todo se compra con monedas del juego. No hay compras reales."
		})
	] });
}
function WardrobeModal({ skins, unlocked, equipped, coins, onChoose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "modal-eyebrow",
			children: "ARMARIO DE AVENTURAS"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "modal-title-line",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "El vestidor" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "modal-intro",
				children: "Cada apariencia es un PNG original completo."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "coin-pill modal-coins",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "coin-icon",
					children: "✦"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: coins })]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "wardrobe-grid",
			children: skins.map((skin) => {
				const owned = unlocked.includes(skin.id);
				const active = equipped === skin.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: `skin-card ${active ? "skin-equipped" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "skin-preview",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: `/assets/pets/${skin.id}.png`,
								alt: `Vista previa: ${skin.name}`,
								loading: "lazy"
							}),
							active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "equipped-badge",
								children: "✓ Equipada"
							}),
							!owned && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "skin-price-badge",
								children: ["✦ ", skin.price]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "skin-copy",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "skin-name-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: skin.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rarity rarity-${skin.rarity.toLowerCase()}`,
									children: skin.rarity
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: skin.desc }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: active ? "equipped-button" : owned ? "secondary-button skin-button" : "buy-button skin-button",
								onClick: () => onChoose(skin),
								children: active ? "En uso ✓" : owned ? "Equipar" : `Desbloquear · ✦ ${skin.price}`
							})
						]
					})]
				}, skin.id);
			})
		})
	] });
}
function SettingsModal({ muted, onMute, onReset, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "modal-eyebrow",
			children: "AJUSTES"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Tu espacio, tus reglas" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "modal-intro",
			children: "Configura la experiencia a tu gusto."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "settings-options",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "settings-row",
					onClick: onMute,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "settings-icon",
							children: muted ? "🔇" : "🔊"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Sonidos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: muted ? "Desactivados" : "Activados" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `toggle-switch ${!muted ? "toggle-on" : ""}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "settings-row static-row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "settings-icon",
							children: "💾"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Guardado automático" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Este dispositivo · localStorage" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "saved-check",
							children: "✓"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "settings-row static-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "settings-icon",
						children: "🌙"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Progreso al volver" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Hasta 12 horas fuera de línea" })] })]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "settings-bottom",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "danger-outline",
				onClick: onReset,
				children: "Reiniciar partida"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "primary-button",
				onClick: onClose,
				children: "Guardar y volver"
			})]
		})
	] });
}
function GamesModal({ active, onSelect, onBack, onFinish }) {
	if (!active) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "modal-eyebrow",
			children: "PEQUEÑAS AVENTURAS"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "¡Hora de jugar!" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "modal-intro",
			children: "Diviértete un ratito y gana monedas para tu próxima compra."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "minigame-grid",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "minigame-card stars-card",
					onClick: () => onSelect("stars"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "minigame-art",
							children: "🌟"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "minigame-tag",
							children: "Reflejos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Atrapa las estrellas" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Mueve la cesta y recoge estrellas sin tocar las piedras." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "minigame-reward",
							children: "✦ Hasta 35 monedas"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "minigame-arrow",
							children: "↗"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "minigame-card memory-card",
					onClick: () => onSelect("memory"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "minigame-art",
							children: "🃏"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "minigame-tag",
							children: "Memoria"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Parejas mágicas" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Encuentra los pares de cartas con menos intentos." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "minigame-reward",
							children: "✦ Hasta 25 monedas"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "minigame-arrow",
							children: "↗"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "minigame-card run-card",
					onClick: () => onSelect("run"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "minigame-art",
							children: "🏃"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "minigame-tag",
							children: "Acción"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Carrera de obstáculos" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Salta, esquiva y consigue puntos en el recorrido." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "minigame-reward",
							children: "✦ Hasta 30 monedas"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "minigame-arrow",
							children: "↗"
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "games-footer-note",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🎮" }), " Se puede jugar con teclado, ratón o pantalla táctil."]
		})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniGame, {
		mode: active,
		onBack,
		onFinish
	}, active);
}
function MiniGame({ mode, onBack, onFinish }) {
	if (mode === "memory") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemoryGame, {
		onBack,
		onFinish
	});
	if (mode === "run") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RunnerGame, {
		onBack,
		onFinish
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarsGame, {
		onBack,
		onFinish
	});
}
function GameFrame({ eyebrow, title, instructions, children, onBack }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "game-frame-top",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "game-back",
				onClick: onBack,
				children: "← Minijuegos"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal-eyebrow",
				children: eyebrow
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: title }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "modal-intro",
			children: instructions
		}),
		children
	] });
}
function StarsGame({ onBack, onFinish }) {
	const [basket, setBasket] = (0, import_react.useState)(50);
	const [objects, setObjects] = (0, import_react.useState)([]);
	const [score, setScore] = (0, import_react.useState)(0);
	const [hits, setHits] = (0, import_react.useState)(0);
	const [seconds, setSeconds] = (0, import_react.useState)(22);
	const [finished, setFinished] = (0, import_react.useState)(false);
	const objectRef = (0, import_react.useRef)([]);
	const basketRef = (0, import_react.useRef)(50);
	const scoreRef = (0, import_react.useRef)(0);
	const hitsRef = (0, import_react.useRef)(0);
	const startRef = (0, import_react.useRef)(0);
	const spawnRef = (0, import_react.useRef)(0);
	const finishedRef = (0, import_react.useRef)(false);
	const heldRef = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const moveBasket = (value) => {
		const next = Math.min(92, Math.max(8, value));
		basketRef.current = next;
		setBasket(next);
	};
	(0, import_react.useEffect)(() => {
		const origin = performance.now();
		startRef.current = origin;
		spawnRef.current = origin;
		const keyDown = (e) => {
			if (e.key === "ArrowLeft" || e.key === "KeyA" || e.key.toLowerCase() === "a") {
				e.preventDefault();
				heldRef.current.add("left");
			}
			if (e.key === "ArrowRight" || e.key === "KeyD" || e.key.toLowerCase() === "d") {
				e.preventDefault();
				heldRef.current.add("right");
			}
		};
		const keyUp = (e) => {
			if (e.key === "ArrowLeft" || e.key === "KeyA" || e.key.toLowerCase() === "a") heldRef.current.delete("left");
			if (e.key === "ArrowRight" || e.key === "KeyD" || e.key.toLowerCase() === "d") heldRef.current.delete("right");
		};
		const blur = () => heldRef.current.clear();
		window.addEventListener("keydown", keyDown);
		window.addEventListener("keyup", keyUp);
		window.addEventListener("blur", blur);
		let frame = 0;
		let last = performance.now();
		const tick = (now) => {
			frame = requestAnimationFrame(tick);
			if (finishedRef.current) return;
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			let steer = 0;
			if (heldRef.current.has("left")) steer -= 1;
			if (heldRef.current.has("right")) steer += 1;
			if (steer) moveBasket(basketRef.current + steer * 48 * dt);
			const elapsed = (now - startRef.current) / 1e3;
			setSeconds(Math.max(0, Math.ceil(22 - elapsed)));
			if (elapsed >= 22 || hitsRef.current >= 3) {
				finishedRef.current = true;
				setFinished(true);
				return;
			}
			let next = objectRef.current.map((obj) => ({
				...obj,
				y: obj.y + 26 * dt
			}));
			if (now - spawnRef.current > 720) {
				next.push({
					id: `${now}-${Math.random()}`,
					x: 7 + Math.random() * 86,
					y: -6,
					kind: Math.random() < .22 ? "rock" : "star"
				});
				spawnRef.current = now;
			}
			const keep = [];
			next.forEach((obj) => {
				if (obj.y >= 78 && obj.y <= 96 && Math.abs(obj.x - basketRef.current) < 12) {
					if (obj.kind === "star") {
						scoreRef.current += 1;
						setScore(scoreRef.current);
					} else {
						hitsRef.current += 1;
						setHits(hitsRef.current);
					}
					return;
				}
				if (obj.y < 108) keep.push(obj);
			});
			objectRef.current = keep;
			setObjects(keep);
		};
		frame = requestAnimationFrame(tick);
		window.__controlsTest = {
			getX: () => basketRef.current,
			getYaw: () => 0,
			getSpeed: () => 0,
			setKeys: (codes) => {
				heldRef.current = /* @__PURE__ */ new Set();
				if (codes.includes("KeyA") || codes.includes("ArrowLeft")) heldRef.current.add("left");
				if (codes.includes("KeyD") || codes.includes("ArrowRight")) heldRef.current.add("right");
			}
		};
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("keydown", keyDown);
			window.removeEventListener("keyup", keyUp);
			window.removeEventListener("blur", blur);
			if (window.__controlsTest?.getX) delete window.__controlsTest;
		};
	}, []);
	const moveByPointer = (e) => {
		if (e.buttons || e.pointerType === "touch") {
			const rect = e.currentTarget.getBoundingClientRect();
			moveBasket((e.clientX - rect.left) / rect.width * 100);
		}
	};
	const reward = Math.min(35, 5 + score * 2);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GameFrame, {
		eyebrow: "REFLEJOS · 22 SEGUNDOS",
		title: "Atrapa las estrellas",
		instructions: "Mueve la cesta con ← → o A/D. En móvil, arrastra el dedo por el área. ¡Evita las piedras!",
		onBack,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "game-hud",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["🌟 Puntos ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: score })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"⏱ ",
						seconds,
						"s"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"🪨 Golpes ",
						hits,
						"/3"
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "stars-playfield",
				onPointerDown: moveByPointer,
				onPointerMove: moveByPointer,
				children: [
					objects.map((obj) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `falling-object ${obj.kind === "rock" ? "falling-rock" : ""}`,
						style: {
							left: `${obj.x}%`,
							top: `${obj.y}%`
						},
						children: obj.kind === "rock" ? "🪨" : "⭐"
					}, obj.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "catch-basket",
						style: { left: `${basket}%` },
						children: "🧺"
					}),
					finished && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "game-over-overlay",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✨" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "¡Buen trabajo!" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"Recogiste ",
								score,
								" estrellas."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "primary-button",
								onClick: () => onFinish(reward, Math.min(18, score + 4), "Atrapa las estrellas"),
								children: ["Cobrar ✦ ", reward]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mobile-game-controls",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onPointerDown: (e) => {
							e.preventDefault();
							moveBasket(basketRef.current - 10);
						},
						children: "←"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mueve la cesta" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onPointerDown: (e) => {
							e.preventDefault();
							moveBasket(basketRef.current + 10);
						},
						children: "→"
					})
				]
			})
		]
	});
}
var MEMORY_SYMBOLS = [
	"🍎",
	"⭐",
	"🧸",
	"🎾",
	"🫧",
	"🌙"
];
function MemoryGame({ onBack, onFinish }) {
	const [cards, setCards] = (0, import_react.useState)(() => [...MEMORY_SYMBOLS, ...MEMORY_SYMBOLS].map((symbol, idx) => ({
		id: idx,
		symbol
	})).sort(() => Math.random() - .5));
	const [flipped, setFlipped] = (0, import_react.useState)([]);
	const [matched, setMatched] = (0, import_react.useState)([]);
	const [moves, setMoves] = (0, import_react.useState)(0);
	const [locked, setLocked] = (0, import_react.useState)(false);
	const [finished, setFinished] = (0, import_react.useState)(false);
	const cardsRef = (0, import_react.useRef)(cards);
	(0, import_react.useEffect)(() => {
		cardsRef.current = cards;
	}, [cards]);
	(0, import_react.useEffect)(() => {
		if (flipped.length !== 2) return void 0;
		setLocked(true);
		const [a, b] = flipped;
		const same = cardsRef.current.find((c) => c.id === a)?.symbol === cardsRef.current.find((c) => c.id === b)?.symbol;
		const timeout = setTimeout(() => {
			if (same) setMatched((prev) => [
				...prev,
				a,
				b
			]);
			setFlipped([]);
			setLocked(false);
		}, same ? 420 : 850);
		return () => clearTimeout(timeout);
	}, [flipped]);
	(0, import_react.useEffect)(() => {
		if (matched.length === cards.length && cards.length) setFinished(true);
	}, [matched, cards.length]);
	const chooseCard = (id) => {
		if (locked || matched.includes(id) || flipped.includes(id) || finished || flipped.length >= 2) return;
		if (flipped.length === 1) setMoves((n) => n + 1);
		setFlipped((prev) => prev.length >= 2 ? prev : [...prev, id]);
	};
	const reward = Math.min(25, Math.max(10, 28 - moves));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GameFrame, {
		eyebrow: "MEMORIA · SIN LÍMITE DE TIEMPO",
		title: "Parejas mágicas",
		instructions: "Voltea dos cartas por turno y encuentra los seis pares. ¡Intenta recordar dónde está cada símbolo!",
		onBack,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "game-hud",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["🃏 Parejas ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [matched.length / 2, "/6"] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["🎯 Intentos ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: moves })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["✦ Premio ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "hasta 25" })] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "memory-grid",
			children: [cards.map((card) => {
				const faceUp = flipped.includes(card.id) || matched.includes(card.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: `memory-card ${faceUp ? "memory-face-up" : ""} ${matched.includes(card.id) ? "memory-matched" : ""}`,
					onClick: () => chooseCard(card.id),
					"aria-label": faceUp ? card.symbol : "Carta oculta",
					children: faceUp ? card.symbol : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✦" })
				}, card.id);
			}), finished && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "game-over-overlay memory-over",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🏆" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "¡Todas las parejas!" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Lo lograste en ",
						moves,
						" intentos."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "primary-button",
						onClick: () => onFinish(reward, 16, "Parejas mágicas"),
						children: ["Cobrar ✦ ", reward]
					})
				]
			})]
		})]
	});
}
function RunnerGame({ onBack, onFinish }) {
	const [obstacles, setObstacles] = (0, import_react.useState)([]);
	const [jumping, setJumping] = (0, import_react.useState)(false);
	const [score, setScore] = (0, import_react.useState)(0);
	const [hits, setHits] = (0, import_react.useState)(0);
	const [seconds, setSeconds] = (0, import_react.useState)(20);
	const [finished, setFinished] = (0, import_react.useState)(false);
	const obstaclesRef = (0, import_react.useRef)([]);
	const jumpingRef = (0, import_react.useRef)(false);
	const jumpUntilRef = (0, import_react.useRef)(0);
	const scoreRef = (0, import_react.useRef)(0);
	const hitsRef = (0, import_react.useRef)(0);
	const startedRef = (0, import_react.useRef)(Date.now());
	const spawnRef = (0, import_react.useRef)(Date.now() + 900);
	const finishedRef = (0, import_react.useRef)(false);
	const jump = () => {
		if (finishedRef.current || jumpingRef.current) return;
		jumpingRef.current = true;
		jumpUntilRef.current = Date.now() + 650;
		setJumping(true);
	};
	(0, import_react.useEffect)(() => {
		const keyDown = (e) => {
			if (e.code === "Space" || e.key === "ArrowUp" || e.key === " ") {
				e.preventDefault();
				jump();
			}
		};
		window.addEventListener("keydown", keyDown);
		const timer = setInterval(() => {
			if (finishedRef.current) return;
			const now = Date.now();
			const elapsed = (now - startedRef.current) / 1e3;
			setSeconds(Math.max(0, Math.ceil(20 - elapsed)));
			if (jumpingRef.current && now > jumpUntilRef.current) {
				jumpingRef.current = false;
				setJumping(false);
			}
			if (elapsed >= 20 || hitsRef.current >= 3) {
				finishedRef.current = true;
				setFinished(true);
				return;
			}
			let next = obstaclesRef.current.map((o) => ({
				...o,
				x: o.x - 3.2
			}));
			if (now > spawnRef.current) {
				next.push({
					id: now,
					x: 103,
					kind: Math.random() < .28 ? "double" : "single",
					counted: false
				});
				spawnRef.current = now + 1e3 + Math.random() * 360;
			}
			const keep = [];
			next.forEach((o) => {
				if (o.x <= 22 && o.x >= 13 && !o.counted) {
					o.counted = true;
					if (!jumpingRef.current) {
						hitsRef.current += 1;
						setHits(hitsRef.current);
					} else {
						scoreRef.current += 1;
						setScore(scoreRef.current);
					}
				}
				if (o.x < 4) {
					if (!o.counted) {
						scoreRef.current += 1;
						setScore(scoreRef.current);
					}
				} else keep.push(o);
			});
			obstaclesRef.current = keep;
			setObstacles(keep);
		}, 100);
		return () => {
			clearInterval(timer);
			window.removeEventListener("keydown", keyDown);
		};
	}, []);
	const reward = Math.min(30, 6 + score * 2);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GameFrame, {
		eyebrow: "ACCIÓN · 20 SEGUNDOS",
		title: "Carrera de obstáculos",
		instructions: "Toca SALTAR o presiona espacio / ↑ para esquivar los obstáculos y recoger puntos.",
		onBack,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "game-hud",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["🏁 Puntos ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: score })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"⏱ ",
						seconds,
						"s"
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"💥 Golpes ",
						hits,
						"/3"
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "runner-field",
				onPointerDown: jump,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "runner-sky-sun",
						children: "☀️"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "runner-cloud cloud-one",
						children: "☁️"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "runner-cloud cloud-two",
						children: "☁️"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "runner-hills" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "runner-ground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `runner-character ${jumping ? "runner-jump" : ""}`,
						children: "🐶"
					}),
					obstacles.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "runner-obstacle",
						style: { left: `${o.x}%` },
						children: o.kind === "double" ? "🌵" : "🪵"
					}, o.id)),
					finished && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "game-over-overlay",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🏁" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "¡Carrera terminada!" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"Sumaste ",
								score,
								" puntos."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "primary-button",
								onClick: () => onFinish(reward, Math.min(20, score + 6), "Carrera de obstáculos"),
								children: ["Cobrar ✦ ", reward]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "primary-button jump-button",
				onPointerDown: (e) => e.stopPropagation(),
				onClick: jump,
				disabled: finished,
				children: ["SALTAR ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "↑" })]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {});
}
//#endregion
export { Home as component };
