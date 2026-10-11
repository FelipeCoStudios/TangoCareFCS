import { useEffect, useRef } from "react";
import * as THREE from "three";

export type PetAction =
  | ""
  | "pet-hop"
  | "pet-eat"
  | "pet-bath"
  | "pet-heal"
  | "pet-play"
  | "pet-wake"
  | "pet-sparkle"
  | "pet-sleep";

export type PetVibe = "great" | "ok" | "hungry" | "sleepy" | "dirty" | "sick" | "play";

type Props = {
  skin: string;
  sleeping: boolean;
  action: PetAction;
  vibe: PetVibe;
  onPetTap?: () => void;
};

type Spot = { x: number; z: number };

const HOME: Spot = { x: 0.02, z: 0.22 };
const BOWL: Spot = { x: 0.92, z: 0.62 };
const TUB: Spot = { x: 0.88, z: -0.42 };
const BED: Spot = { x: -0.92, z: -0.48 };

type Particle = {
  sprite: THREE.Sprite;
  active: boolean;
  life: number;
  max: number;
  vx: number;
  vy: number;
  vz: number;
  gravity: number;
  spin: number;
  base: number;
};

function canvasTexture(size: number, draw: (ctx: CanvasRenderingContext2D, size: number) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  draw(ctx, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function spriteTexture(draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  draw(ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function GameScene({ skin, sleeping, action, vibe, onPetTap }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const tapRef = useRef(onPetTap);
  const actionRef = useRef(action);
  const sleepRef = useRef(sleeping);
  const skinRef = useRef(skin);
  const vibeRef = useRef(vibe);
  tapRef.current = onPetTap;
  actionRef.current = action;
  sleepRef.current = sleeping;
  skinRef.current = skin;
  vibeRef.current = vibe;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const scene = new THREE.Scene();
    const bgDay = new THREE.Color("#efe6ff");
    const bgNight = new THREE.Color("#161326");
    const background = bgDay.clone();
    scene.background = background;
    scene.fog = new THREE.Fog(background.clone(), 7.5, 16);

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);
    const look = new THREE.Vector3(0, 1.18, 0);
    camera.position.set(0.42, 1.92, 6.35);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.setAttribute(
      "aria-label",
      "Habitación de TangoWorld. Toca a la mascota para acariciarla.",
    );
    mount.appendChild(renderer.domElement);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];

    const track = <T extends THREE.BufferGeometry>(geometry: T) => {
      geometries.push(geometry);
      return geometry;
    };
    const trackMat = <T extends THREE.Material>(material: T) => {
      materials.push(material);
      return material;
    };
    const trackTex = (texture: THREE.Texture) => {
      textures.push(texture);
      return texture;
    };

    const standard = (color: string, extra: THREE.MeshStandardMaterialParameters = {}) =>
      trackMat(
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.82,
          metalness: 0.02,
          ...extra,
        }),
      );

    const addMesh = (
      geometry: THREE.BufferGeometry,
      material: THREE.Material,
      position: [number, number, number],
      rotation?: [number, number, number],
      shadow = true,
    ) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(position[0], position[1], position[2]);
      if (rotation) mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
      mesh.castShadow = shadow;
      mesh.receiveShadow = shadow;
      scene.add(mesh);
      return mesh;
    };

    const floorTex = trackTex(
      canvasTexture(512, (ctx, s) => {
        ctx.fillStyle = "#f4e4d4";
        ctx.fillRect(0, 0, s, s);
        const plank = 64;
        for (let y = 0; y < s; y += plank) {
          const shade = 228 + ((y / plank) % 2) * 10;
          ctx.fillStyle = `rgb(${shade}, ${shade - 28}, ${shade - 52})`;
          ctx.fillRect(0, y, s, plank - 2);
          ctx.strokeStyle = "rgba(120, 78, 48, 0.18)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, y + plank - 1);
          ctx.lineTo(s, y + plank - 1);
          ctx.stroke();
          for (let i = 0; i < 8; i++) {
            ctx.strokeStyle = `rgba(140, 90, 55, ${0.04 + (i % 3) * 0.03})`;
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
      }),
    );
    floorTex.wrapS = THREE.RepeatWrapping;
    floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(2.4, 2.4);

    const wallTex = trackTex(
      canvasTexture(256, (ctx, s) => {
        ctx.fillStyle = "#e3dafc";
        ctx.fillRect(0, 0, s, s);
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        for (let y = 18; y < s; y += 36) {
          for (let x = (y / 36) % 2 ? 18 : 0; x < s; x += 36) {
            ctx.beginPath();
            ctx.arc(x, y, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.fillStyle = "rgba(255, 214, 120, 0.55)";
        for (let i = 0; i < 10; i++) {
          const x = (i * 67) % s;
          const y = (i * 41) % s;
          ctx.fillRect(x, y, 3, 3);
        }
      }),
    );
    wallTex.wrapS = THREE.RepeatWrapping;
    wallTex.wrapT = THREE.RepeatWrapping;
    wallTex.repeat.set(3.2, 1.6);

    const rugTex = trackTex(
      canvasTexture(512, (ctx, s) => {
        ctx.clearRect(0, 0, s, s);
        const g = ctx.createRadialGradient(s / 2, s / 2, 40, s / 2, s / 2, s / 2);
        g.addColorStop(0, "#fff7fb");
        g.addColorStop(0.45, "#f7c2d2");
        g.addColorStop(0.72, "#e39aaf");
        g.addColorStop(1, "rgba(227,154,175,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(s / 2, s / 2, s * 0.48, s * 0.36, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.ellipse(s / 2, s / 2, s * 0.32, s * 0.22, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.beginPath();
        ctx.arc(s / 2, s / 2, 18, 0, Math.PI * 2);
        ctx.fill();
      }),
    );

    const floorMat = standard("#ffffff", { map: floorTex, roughness: 0.94 });
    const floor = addMesh(
      track(new THREE.CircleGeometry(4.3, 48)),
      floorMat,
      [0, 0, 0.1],
      [-Math.PI / 2, 0, 0],
    );
    floor.receiveShadow = true;
    floor.castShadow = false;

    const rug = addMesh(
      track(new THREE.CircleGeometry(1.25, 40)),
      trackMat(new THREE.MeshBasicMaterial({ map: rugTex, transparent: true, depthWrite: false })),
      [0.02, 0.025, 0.28],
      [-Math.PI / 2, 0, 0],
      false,
    );
    rug.receiveShadow = false;

    addMesh(
      track(new THREE.PlaneGeometry(8.4, 4.15)),
      standard("#e4dcfb", { map: wallTex, roughness: 1 }),
      [0, 2.05, -2.35],
    );
    addMesh(
      track(new THREE.PlaneGeometry(4.6, 4.15)),
      standard("#d9d0f6", { map: wallTex, roughness: 1 }),
      [-3.55, 2.05, -0.15],
      [0, Math.PI / 2, 0],
    );
    addMesh(track(new THREE.BoxGeometry(8.4, 0.12, 0.08)), standard("#fffaf6", { roughness: 0.6 }), [
      0,
      0.08,
      -2.3,
    ]);
    addMesh(
      track(new THREE.BoxGeometry(0.08, 0.12, 4.5)),
      standard("#fffaf6", { roughness: 0.6 }),
      [-3.5, 0.08, -0.15],
    );
    addMesh(track(new THREE.BoxGeometry(8.4, 0.1, 0.1)), standard("#c9b8f0", { roughness: 0.7 }), [
      0,
      3.95,
      -2.32,
    ]);

    const sky = new THREE.ShaderMaterial({
      uniforms: { night: { value: 0 }, time: { value: 0 } },
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
      `,
    });
    trackMat(sky);
    const windowSky = addMesh(track(new THREE.PlaneGeometry(2.15, 1.45)), sky, [0.15, 2.35, -2.32], undefined, false);
    windowSky.castShadow = false;
    windowSky.receiveShadow = false;

    const trim = standard("#fffdf8", { roughness: 0.45 });
    addMesh(track(new THREE.BoxGeometry(2.35, 0.08, 0.08)), trim, [0.15, 3.12, -2.26]);
    addMesh(track(new THREE.BoxGeometry(2.35, 0.08, 0.08)), trim, [0.15, 1.58, -2.26]);
    addMesh(track(new THREE.BoxGeometry(0.08, 1.62, 0.08)), trim, [-0.96, 2.35, -2.26]);
    addMesh(track(new THREE.BoxGeometry(0.08, 1.62, 0.08)), trim, [1.26, 2.35, -2.26]);
    const sill = addMesh(track(new THREE.BoxGeometry(2.4, 0.07, 0.22)), trim, [0.15, 1.52, -2.16]);
    sill.castShadow = true;

    const curtainMat = standard("#f6b7c6", { roughness: 0.85, side: THREE.DoubleSide });
    const curtainL = addMesh(track(new THREE.PlaneGeometry(0.42, 1.5)), curtainMat, [-0.78, 2.28, -2.2]);
    const curtainR = addMesh(track(new THREE.PlaneGeometry(0.42, 1.5)), curtainMat, [1.08, 2.28, -2.2]);

    const cloudMat = trackMat(
      new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.9, depthWrite: false }),
    );
    const clouds = [-0.35, 0.15, 0.55].map((x, i) => {
      const cloud = addMesh(
        track(new THREE.SphereGeometry(0.12, 12, 10)),
        cloudMat,
        [x, 2.55 - i * 0.08, -2.2],
        undefined,
        false,
      );
      cloud.scale.set(1.8 + i * 0.3, 0.7, 0.4);
      cloud.castShadow = false;
      return cloud;
    });

    const pot = standard("#e7a090", { roughness: 0.7 });
    addMesh(track(new THREE.CylinderGeometry(0.1, 0.08, 0.08, 16)), pot, [0.72, 1.58, -2.08]);
    addMesh(
      track(new THREE.SphereGeometry(0.09, 12, 10)),
      standard("#7ecf9a", { roughness: 0.65 }),
      [0.72, 1.68, -2.08],
      undefined,
      false,
    );

    const bedWood = standard("#f7f4ff", { roughness: 0.72 });
    const bedPaint = standard("#7d78d8", { roughness: 0.62 });
    addMesh(track(new THREE.BoxGeometry(1.55, 0.7, 0.08)), bedPaint, [-1.85, 0.55, -1.72]);
    addMesh(track(new THREE.BoxGeometry(1.5, 0.22, 0.95)), bedPaint, [-1.72, 0.16, -1.22]);
    addMesh(track(new THREE.BoxGeometry(1.4, 0.12, 0.86)), bedWood, [-1.72, 0.3, -1.22]);
    addMesh(track(new THREE.BoxGeometry(0.42, 0.1, 0.28)), standard("#fff6df", { roughness: 0.9 }), [
      -2.1,
      0.4,
      -1.42,
    ]);
    const blanketTex = trackTex(
      canvasTexture(128, (ctx, s) => {
        for (let i = 0; i < 8; i++) {
          ctx.fillStyle = i % 2 ? "#f7f1ff" : "#f3a8ba";
          ctx.fillRect(0, (s / 8) * i, s, s / 8);
        }
      }),
    );
    const blanket = addMesh(
      track(new THREE.BoxGeometry(1.28, 0.08, 0.62)),
      standard("#f3a8ba", { map: blanketTex, roughness: 0.9 }),
      [-1.58, 0.38, -1.08],
    );

    addMesh(track(new THREE.CylinderGeometry(0.16, 0.13, 0.22, 12)), standard("#e59aa4", { roughness: 0.8 }), [
      -2.55,
      0.12,
      -0.15,
    ]);
    const plant = addMesh(
      track(new THREE.IcosahedronGeometry(0.22, 0)),
      standard("#79c7a0", { roughness: 0.7 }),
      [-2.55, 0.38, -0.15],
    );
    const plantB = addMesh(
      track(new THREE.IcosahedronGeometry(0.14, 0)),
      standard("#9ed9b6", { roughness: 0.7 }),
      [-2.38, 0.34, -0.05],
    );

    const bowlOuter = standard("#ff9aa8", { roughness: 0.38, metalness: 0.08, side: THREE.DoubleSide });
    addMesh(track(new THREE.CylinderGeometry(0.28, 0.2, 0.16, 28, 1, true)), bowlOuter, [1.55, 0.1, 0.95]);
    addMesh(track(new THREE.TorusGeometry(0.27, 0.035, 8, 24)), standard("#ffd1d8", { roughness: 0.35 }), [
      1.55,
      0.17,
      0.95,
    ], [Math.PI / 2, 0, 0]);
    addMesh(
      track(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 20)),
      standard("#f0bf62", { roughness: 0.55 }),
      [1.55, 0.08, 0.95],
    );
    for (let i = 0; i < 5; i++) {
      const crumb = addMesh(
        track(new THREE.SphereGeometry(0.035, 8, 6)),
        standard("#e7b15a", { roughness: 0.6 }),
        [1.48 + (i % 3) * 0.06, 0.12, 0.9 + Math.floor(i / 3) * 0.06],
        undefined,
        false,
      );
      crumb.castShadow = false;
    }

    const tubBody = standard("#7ec4dc", { roughness: 0.35, metalness: 0.05 });
    addMesh(track(new THREE.BoxGeometry(0.85, 0.28, 0.58)), tubBody, [1.62, 0.16, -1.15]);
    addMesh(track(new THREE.BoxGeometry(0.78, 0.08, 0.5)), standard("#d9f6ff", { roughness: 0.2 }), [
      1.62,
      0.32,
      -1.15,
    ]);
    const waterMat = new THREE.MeshStandardMaterial({
      color: "#8fd4ea",
      transparent: true,
      opacity: 0.78,
      roughness: 0.15,
      metalness: 0.05,
    });
    trackMat(waterMat);
    const water = addMesh(track(new THREE.BoxGeometry(0.7, 0.05, 0.42)), waterMat, [1.62, 0.34, -1.15], undefined, false);
    water.castShadow = false;

    const lampPole = standard("#f4efe4", { roughness: 0.45 });
    addMesh(track(new THREE.CylinderGeometry(0.05, 0.08, 0.08, 12)), lampPole, [1.15, 0.05, -0.55]);
    addMesh(track(new THREE.CylinderGeometry(0.025, 0.025, 0.85, 10)), lampPole, [1.15, 0.48, -0.55]);
    const bulbMat = standard("#ffe1a8", { emissive: "#ffb35a", emissiveIntensity: 0.4, roughness: 0.3 });
    const bulb = addMesh(track(new THREE.SphereGeometry(0.09, 16, 12)), bulbMat, [1.15, 0.96, -0.55], undefined, false);
    bulb.castShadow = false;
    addMesh(track(new THREE.ConeGeometry(0.16, 0.18, 16, 1, true)), standard("#fff7ea", { side: THREE.DoubleSide, roughness: 0.5 }), [
      1.15,
      1.08,
      -0.55,
    ]);

    const ball = addMesh(
      track(new THREE.SphereGeometry(0.16, 20, 16)),
      standard("#ffd56a", { roughness: 0.35, metalness: 0.05 }),
      [0.78, 0.16, 1.22],
    );
    const stripe = standard("#fffaf0", { roughness: 0.4 });
    const ballStripe = addMesh(track(new THREE.TorusGeometry(0.16, 0.02, 6, 20)), stripe, [0.78, 0.16, 1.22], [
      Math.PI / 2.6,
      0.2,
      0.4,
    ], false);

    addMesh(track(new THREE.BoxGeometry(0.16, 0.16, 0.16)), standard("#f08b7a", { roughness: 0.6 }), [
      -0.85,
      0.1,
      1.15,
    ], [0, 0.4, 0.1]);
    addMesh(track(new THREE.BoxGeometry(0.13, 0.13, 0.13)), standard("#8eb7f5", { roughness: 0.55 }), [
      -0.68,
      0.08,
      1.22,
    ], [0, 0.2, 0]);

    const shelf = standard("#fffaf4", { roughness: 0.55 });
    addMesh(track(new THREE.BoxGeometry(1.15, 0.06, 0.22)), shelf, [-2.15, 2.15, -2.2]);
    const bookColors = ["#f3a0b4", "#8f88e4", "#f2d36a", "#7dceb0", "#f08b7a"];
    bookColors.forEach((color, i) => {
      addMesh(
        track(new THREE.BoxGeometry(0.1, 0.32 + (i % 2) * 0.06, 0.16)),
        standard(color, { roughness: 0.7 }),
        [-2.52 + i * 0.16, 2.34, -2.18],
      );
    });

    const frameMat = standard("#fff8ee", { roughness: 0.5 });
    const pawTex = trackTex(
      canvasTexture(128, (ctx, s) => {
        ctx.fillStyle = "#fff6ea";
        ctx.fillRect(0, 0, s, s);
        ctx.fillStyle = "#e7a0b4";
        ctx.beginPath();
        ctx.ellipse(s / 2, s * 0.62, 18, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        [[38, 34], [64, 26], [90, 34], [78, 48]].forEach(([x, y]) => {
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fill();
        });
      }),
    );
    addMesh(track(new THREE.BoxGeometry(0.52, 0.46, 0.04)), frameMat, [1.85, 2.55, -2.28]);
    addMesh(
      track(new THREE.PlaneGeometry(0.4, 0.34)),
      trackMat(new THREE.MeshBasicMaterial({ map: pawTex })),
      [1.85, 2.55, -2.25],
      undefined,
      false,
    );

    const clockTex = trackTex(
      canvasTexture(128, (ctx, s) => {
        ctx.fillStyle = "#fffdf8";
        ctx.beginPath();
        ctx.arc(s / 2, s / 2, s * 0.46, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#7d78d8";
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.fillStyle = "#5c567f";
        ctx.font = "700 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("12", s / 2, 28);
        ctx.fillText("6", s / 2, s - 16);
      }),
    );
    addMesh(
      track(new THREE.CircleGeometry(0.22, 24)),
      trackMat(new THREE.MeshBasicMaterial({ map: clockTex })),
      [-2.55, 2.7, -2.28],
      undefined,
      false,
    );
    const handMat = trackMat(new THREE.MeshBasicMaterial({ color: "#5c567f" }));
    const hourPivot = new THREE.Group();
    hourPivot.position.set(-2.55, 2.7, -2.24);
    const minutePivot = new THREE.Group();
    minutePivot.position.set(-2.55, 2.7, -2.23);
    const hourHand = new THREE.Mesh(track(new THREE.BoxGeometry(0.018, 0.1, 0.01)), handMat);
    hourHand.position.y = 0.04;
    const minuteHand = new THREE.Mesh(track(new THREE.BoxGeometry(0.012, 0.14, 0.01)), handMat);
    minuteHand.position.y = 0.06;
    hourPivot.add(hourHand);
    minutePivot.add(minuteHand);
    scene.add(hourPivot, minutePivot);

    const lights: THREE.Mesh[] = [];
    const lightGeo = track(new THREE.SphereGeometry(0.045, 10, 8));
    for (let i = 0; i < 14; i++) {
      const mat = standard("#fff4c8", { emissive: "#ffd27a", emissiveIntensity: 0.8, roughness: 0.4 });
      const x = -2.4 + i * 0.42;
      const y = 3.55 + Math.sin(i * 0.8) * 0.08;
      const bulbLight = addMesh(lightGeo, mat, [x, y, -2.15], undefined, false);
      bulbLight.castShadow = false;
      lights.push(bulbLight);
      if (i < 13) {
        const wire = addMesh(
          track(new THREE.BoxGeometry(0.42, 0.012, 0.012)),
          standard("#6d6794", { roughness: 0.5 }),
          [x + 0.21, (y + 3.55 + Math.sin((i + 1) * 0.8) * 0.08) / 2, -2.15],
          [0, 0, Math.sin(i) * 0.15],
          false,
        );
        wire.castShadow = false;
      }
    }

    const mobile = new THREE.Group();
    mobile.position.set(0.05, 2.85, 0.15);
    scene.add(mobile);
    const mobileBar = new THREE.Mesh(track(new THREE.BoxGeometry(0.7, 0.03, 0.03)), standard("#fff6df", { roughness: 0.4 }));
    mobile.add(mobileBar);
    const starMat = standard("#ffe08a", { emissive: "#ffd56a", emissiveIntensity: 0.35, roughness: 0.45 });
    const mobileStars: THREE.Mesh[] = [];
    [-0.24, 0, 0.24].forEach((x, i) => {
      const drop = new THREE.Mesh(track(new THREE.BoxGeometry(0.012, 0.22, 0.012)), standard("#d9d3f5"));
      drop.position.set(x, -0.12, 0);
      mobile.add(drop);
      const star = new THREE.Mesh(track(new THREE.OctahedronGeometry(0.07, 0)), starMat);
      star.position.set(x, -0.28 - i * 0.02, 0);
      mobile.add(star);
      mobileStars.push(star);
    });

    const hemi = new THREE.HemisphereLight("#fff8f2", "#9d92c9", 1.35);
    scene.add(hemi);
    const key = new THREE.DirectionalLight("#fff3dd", 2.35);
    key.position.set(-2.4, 5.4, 3.6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -4;
    key.shadow.camera.right = 4;
    key.shadow.camera.top = 4;
    key.shadow.camera.bottom = -3;
    key.shadow.bias = -0.0006;
    scene.add(key);
    const windowLight = new THREE.DirectionalLight("#d5e6ff", 0.85);
    windowLight.position.set(0.2, 3.1, -1.2);
    scene.add(windowLight);
    const lampLight = new THREE.PointLight("#ffc27a", 0.35, 5.5, 2);
    lampLight.position.set(1.15, 1.05, -0.45);
    scene.add(lampLight);
    const fill = new THREE.PointLight("#e4d4ff", 0.45, 8, 2);
    fill.position.set(-1.2, 1.8, 1.6);
    scene.add(fill);

    const shadow = new THREE.Mesh(
      track(new THREE.CircleGeometry(0.62, 32)),
      trackMat(new THREE.MeshBasicMaterial({ color: "#5c547f", transparent: true, opacity: 0.22, depthWrite: false })),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(HOME.x, 0.03, HOME.z);
    shadow.renderOrder = 2;
    scene.add(shadow);

    const petMat = trackMat(
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        alphaTest: 0.04,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    );
    const pet = new THREE.Mesh(track(new THREE.PlaneGeometry(1, 1)), petMat);
    pet.position.set(HOME.x, 1.25, HOME.z);
    pet.renderOrder = 6;
    scene.add(pet);

    const mirrorMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { map: { value: null }, opacity: { value: 0.18 } },
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
      `,
    });
    trackMat(mirrorMat);
    const mirror = new THREE.Mesh(track(new THREE.PlaneGeometry(1, 1)), mirrorMat);
    mirror.rotation.x = -Math.PI / 2;
    mirror.position.y = 0.035;
    mirror.renderOrder = 3;
    mirror.visible = false;
    scene.add(mirror);

    const aura = new THREE.Mesh(
      track(new THREE.TorusGeometry(0.72, 0.035, 8, 40)),
      trackMat(
        new THREE.MeshBasicMaterial({
          color: "#ffe08a",
          transparent: true,
          opacity: 0,
          depthWrite: false,
          toneMapped: false,
        }),
      ),
    );
    aura.position.set(HOME.x, 1.15, HOME.z);
    aura.renderOrder = 5;
    scene.add(aura);

    const heartTex = trackTex(
      spriteTexture((ctx) => {
        ctx.clearRect(0, 0, 64, 64);
        ctx.fillStyle = "#ff7f9f";
        ctx.beginPath();
        ctx.moveTo(32, 54);
        ctx.bezierCurveTo(4, 36, 8, 12, 32, 22);
        ctx.bezierCurveTo(56, 12, 60, 36, 32, 54);
        ctx.fill();
      }),
    );
    const starTex = trackTex(
      spriteTexture((ctx) => {
        ctx.clearRect(0, 0, 64, 64);
        ctx.fillStyle = "#ffe08a";
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const r = i % 2 ? 10 : 26;
          const a = -Math.PI / 2 + (i * Math.PI) / 5;
          const x = 32 + Math.cos(a) * r;
          const y = 32 + Math.sin(a) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      }),
    );
    const bubbleTex = trackTex(
      spriteTexture((ctx) => {
        ctx.clearRect(0, 0, 64, 64);
        ctx.strokeStyle = "rgba(255,255,255,0.95)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(32, 32, 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(186, 230, 255, 0.35)";
        ctx.fill();
      }),
    );
    const crumbTex = trackTex(
      spriteTexture((ctx) => {
        ctx.clearRect(0, 0, 64, 64);
        ctx.fillStyle = "#e0a84a";
        ctx.beginPath();
        ctx.arc(32, 34, 12, 0, Math.PI * 2);
        ctx.fill();
      }),
    );
    const plusTex = trackTex(
      spriteTexture((ctx) => {
        ctx.clearRect(0, 0, 64, 64);
        ctx.fillStyle = "#7ddeb0";
        ctx.fillRect(26, 10, 12, 44);
        ctx.fillRect(10, 26, 44, 12);
      }),
    );
    const zTex = trackTex(
      spriteTexture((ctx) => {
        ctx.clearRect(0, 0, 64, 64);
        ctx.fillStyle = "#f4f1ff";
        ctx.font = "700 40px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("z", 32, 34);
      }),
    );
    const dustTex = trackTex(
      spriteTexture((ctx) => {
        const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 18);
        g.addColorStop(0, "rgba(255,255,255,0.9)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(32, 32, 18, 0, Math.PI * 2);
        ctx.fill();
      }),
    );

    const texByKind: Record<string, THREE.Texture> = {
      heart: heartTex,
      star: starTex,
      bubble: bubbleTex,
      crumb: crumbTex,
      plus: plusTex,
      zzz: zTex,
      dust: dustTex,
    };

    const pool: Particle[] = [];
    for (let i = 0; i < 56; i++) {
      const sprite = new THREE.Sprite(
        trackMat(
          new THREE.SpriteMaterial({
            map: dustTex,
            transparent: true,
            depthWrite: false,
            opacity: 0,
            toneMapped: false,
          }),
        ),
      );
      sprite.visible = false;
      sprite.renderOrder = 8;
      scene.add(sprite);
      pool.push({ sprite, active: false, life: 0, max: 1, vx: 0, vy: 0, vz: 0, gravity: 0, spin: 0, base: 0.2 });
    }

    const burst = (kind: string, x: number, y: number, z: number, count: number, spread = 0.35) => {
      if (reduce) return;
      let left = count;
      for (const particle of pool) {
        if (left <= 0) break;
        if (particle.active) continue;
        const mat = particle.sprite.material as THREE.SpriteMaterial;
        mat.map = texByKind[kind] ?? starTex;
        mat.opacity = 1;
        particle.active = true;
        particle.life = 0;
        particle.max = 0.8 + Math.random() * 0.7;
        particle.vx = (Math.random() - 0.5) * spread;
        particle.vy = 0.25 + Math.random() * 0.7;
        particle.vz = (Math.random() - 0.5) * spread * 0.5;
        particle.gravity = kind === "bubble" || kind === "zzz" || kind === "dust" ? -0.05 : 0.85;
        particle.spin = (Math.random() - 0.5) * 2;
        particle.base = kind === "dust" ? 0.08 : 0.16 + Math.random() * 0.12;
        particle.sprite.position.set(x + (Math.random() - 0.5) * 0.2, y, z);
        particle.sprite.scale.setScalar(particle.base);
        particle.sprite.visible = true;
        left -= 1;
      }
    };

    for (let i = 0; i < 16; i++) {
      burst("dust", (Math.random() - 0.5) * 3, 0.4 + Math.random() * 2.2, (Math.random() - 0.5) * 1.5, 1, 0.01);
    }

    let petBaseWidth = 1.35;
    let petBaseHeight = 2.42;
    let loadedSkin = "";
    let loadToken = 0;
    let currentTex: THREE.Texture | null = null;
    const loader = new THREE.TextureLoader();

    const applySkin = (id: string) => {
      if (!id || id === loadedSkin) return;
      loadedSkin = id;
      const token = ++loadToken;
      loader.load(
        `/assets/pets/${id}.png`,
        (loaded) => {
          if (token !== loadToken) {
            loaded.dispose();
            return;
          }
          loaded.colorSpace = THREE.SRGBColorSpace;
          loaded.anisotropy = renderer.capabilities.getMaxAnisotropy();
          loaded.minFilter = THREE.LinearMipmapLinearFilter;
          loaded.magFilter = THREE.LinearFilter;
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
        },
        undefined,
        () => {
          petMat.color.set("#f0c2cf");
        },
      );
    };
    applySkin(skinRef.current);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let lastTapAt = 0;
    const onPointerDown = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      if (raycaster.intersectObject(pet, false).length && performance.now() - lastTapAt > 380) {
        lastTapAt = performance.now();
        tapRef.current?.();
      }
    };
    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      renderer.domElement.style.cursor = raycaster.intersectObject(pet, false).length ? "pointer" : "default";
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);

    const anchor = { x: HOME.x, z: HOME.z };
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
    const dayFog = new THREE.Color("#efe6ff");
    const nightFog = new THREE.Color("#161326");

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

    const animate = (now: number) => {
      animationId = requestAnimationFrame(animate);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsed += dt;

      if (skinRef.current !== loadedSkin) applySkin(skinRef.current);

      const nextAction = actionRef.current || "";
      if (nextAction !== activeAction) {
        activeAction = nextAction;
        actionTime = 0;
        const headY = pet.position.y + 0.35;
        if (nextAction === "pet-hop") burst("heart", anchor.x, headY, anchor.z, 8, 0.7);
        if (nextAction === "pet-eat") burst("crumb", BOWL.x, 0.45, BOWL.z, 7, 0.35);
        if (nextAction === "pet-bath") burst("bubble", TUB.x, 0.7, TUB.z, 10, 0.55);
        if (nextAction === "pet-heal") burst("plus", anchor.x, headY, anchor.z, 7, 0.4);
        if (nextAction === "pet-play") burst("star", anchor.x, headY, anchor.z, 8, 0.8);
        if (nextAction === "pet-sparkle") burst("star", anchor.x, headY + 0.2, anchor.z, 12, 0.9);
        if (nextAction === "pet-sleep") burst("zzz", BED.x, 1.7, BED.z, 4, 0.2);
        if (nextAction === "pet-wake") burst("star", anchor.x, 1.6, anchor.z, 5, 0.4);
      } else {
        actionTime += dt;
      }

      const asleep = sleepRef.current;
      night = THREE.MathUtils.damp(night, asleep ? 1 : 0, 1.8, dt);
      background.copy(bgDay).lerp(bgNight, night);
      if (scene.fog) scene.fog.color.copy(dayFog).lerp(nightFog, night);
      sky.uniforms.night.value = night;
      sky.uniforms.time.value = elapsed;
      key.intensity = THREE.MathUtils.lerp(2.45, 0.18, night);
      windowLight.intensity = THREE.MathUtils.lerp(0.9, 0.28, night);
      windowLight.color.set(asleep ? "#b7c4ff" : "#d5e6ff");
      hemi.intensity = THREE.MathUtils.lerp(1.35, 0.16, night);
      hemi.color.set(asleep ? "#9aa4d6" : "#fff8f2");
      lampLight.intensity = THREE.MathUtils.lerp(0.35, 3.4, night);
      bulbMat.emissiveIntensity = THREE.MathUtils.lerp(0.25, 1.8, night);
      renderer.toneMappingExposure = THREE.MathUtils.lerp(1.08, 0.7, night);
      floorMat.color.setRGB(
        THREE.MathUtils.lerp(1, 0.42, night),
        THREE.MathUtils.lerp(1, 0.4, night),
        THREE.MathUtils.lerp(1, 0.62, night),
      );
      cloudMat.opacity = THREE.MathUtils.lerp(0.92, 0.05, night);
      lights.forEach((mesh, i) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.45 + Math.sin(elapsed * 3 + i) * 0.35 + night * 0.4;
      });

      let target = HOME;
      if (asleep) target = BED;
      else if (activeAction === "pet-eat") target = BOWL;
      else if (activeAction === "pet-bath") target = TUB;

      const follow = reduce ? 8 : 3.1;
      anchor.x = THREE.MathUtils.damp(anchor.x, target.x, follow, dt);
      anchor.z = THREE.MathUtils.damp(anchor.z, target.z, follow, dt);
      const moving = Math.hypot(anchor.x - target.x, anchor.z - target.z) > 0.03;

      let lift = 0;
      let rotZ = 0;
      let rotY = 0;
      let sx = 1;
      let sy = 1;

      if (!reduce && !asleep && !activeAction) {
        lift += Math.sin(elapsed * 2.15) * 0.04;
        rotZ += Math.sin(elapsed * 1.25) * 0.02;
        sx += Math.sin(elapsed * 2.15) * 0.012;
        sy -= Math.sin(elapsed * 2.15) * 0.012;
        fidget -= dt;
        if (fidget <= 0) fidget = 3.4 + Math.random() * 2.4;
        if (fidget < 0.45) lift += Math.sin((1 - fidget / 0.45) * Math.PI) * 0.12;
      }

      if (moving && !reduce) {
        lift += Math.abs(Math.sin(elapsed * 11)) * 0.07;
        rotZ += Math.sin(elapsed * 11) * 0.06;
      }

      if (activeAction === "pet-hop" && actionTime < 0.72) {
        const p = actionTime / 0.72;
        lift += Math.sin(p * Math.PI) * 0.48;
        const squash = Math.sin(p * Math.PI);
        sy += squash * 0.08;
        sx -= squash * 0.05;
        rotZ += Math.sin(p * Math.PI * 2) * 0.08;
      }
      if (activeAction === "pet-eat") {
        const chew = Math.sin(actionTime * 14);
        sy += chew * 0.045;
        sx -= chew * 0.03;
        rotZ += 0.06 + chew * 0.03;
        if (!reduce && Math.floor(actionTime * 6) !== Math.floor((actionTime - dt) * 6)) {
          burst("crumb", anchor.x + 0.15, 0.55, anchor.z, 1, 0.15);
        }
      }
      if (activeAction === "pet-bath") {
        rotZ += Math.sin(actionTime * 28) * (reduce ? 0.03 : 0.16);
        if (!reduce && actionTime < 1.4 && Math.floor(actionTime * 8) !== Math.floor((actionTime - dt) * 8)) {
          burst("bubble", anchor.x, pet.position.y * 0.55, anchor.z, 1, 0.4);
        }
        waterMat.opacity = 0.55 + Math.sin(elapsed * 10) * 0.2;
      } else {
        waterMat.opacity = THREE.MathUtils.damp(waterMat.opacity, 0.72, 2, dt);
      }
      if (activeAction === "pet-heal") {
        lift += 0.08 + Math.sin(actionTime * 5) * 0.04;
        const auraMat = aura.material as THREE.MeshBasicMaterial;
        auraMat.opacity = Math.max(0, 0.85 - actionTime);
        aura.scale.setScalar(1 + actionTime * 0.85);
        auraMat.color.set("#9cf0c8");
      } else if (activeAction === "pet-sparkle") {
        rotY = Math.min(1, actionTime / 0.85) * Math.PI * 2;
        const auraMat = aura.material as THREE.MeshBasicMaterial;
        auraMat.opacity = Math.max(0, 0.9 - actionTime * 0.8);
        aura.scale.setScalar(0.6 + actionTime);
        auraMat.color.set("#ffe08a");
      } else {
        const auraMat = aura.material as THREE.MeshBasicMaterial;
        auraMat.opacity = THREE.MathUtils.damp(auraMat.opacity, 0, 3, dt);
      }
      if (activeAction === "pet-play") {
        lift += Math.abs(Math.sin(actionTime * 9)) * (reduce ? 0.05 : 0.2);
        rotZ += Math.sin(actionTime * 9) * 0.08;
        rotY = Math.sin(actionTime * 4) * 0.35;
      }
      if (activeAction === "pet-wake" && actionTime < 0.7) {
        const p = Math.sin((actionTime / 0.7) * Math.PI);
        sy += p * 0.1;
        sx -= p * 0.06;
        lift += p * 0.05;
      }
      if (asleep) {
        lift = Math.sin(elapsed * 1.45) * 0.018;
        rotZ = -0.14 + Math.sin(elapsed * 0.7) * 0.012;
        sy = 0.96 + Math.sin(elapsed * 1.45) * 0.015;
        sx = 1.03;
        zzzClock += dt;
        if (zzzClock > 0.85) {
          zzzClock = 0;
          burst("zzz", anchor.x + 0.15, 1.85, anchor.z, 1, 0.05);
        }
      }

      const vibe = vibeRef.current;
      if (vibe === "sick") petMat.color.set("#e4d7dc");
      else if (vibe === "dirty") petMat.color.set("#efe2cc");
      else if (vibe === "hungry") petMat.color.set("#fff1e4");
      else petMat.color.set("#ffffff");

      pet.scale.set(petBaseWidth * sx, petBaseHeight * sy, 1);
      const half = (petBaseHeight * sy) / 2;
      pet.position.set(anchor.x, half + lift + 0.02, anchor.z);
      pet.rotation.z = rotZ;
      pet.rotation.y = rotY;

      shadow.position.set(anchor.x, 0.03, anchor.z + 0.02);
      const shadowScale = THREE.MathUtils.clamp(1.05 - lift * 0.55, 0.55, 1.15);
      shadow.scale.set(shadowScale, shadowScale, 1);
      (shadow.material as THREE.MeshBasicMaterial).opacity = 0.16 + (1 - night) * 0.06;

      mirror.position.set(anchor.x, 0.04, anchor.z);
      mirror.scale.set(pet.scale.x * 0.92, pet.scale.y * 0.42, 1);
      mirror.rotation.z = -rotZ * 0.25;
      mirrorMat.uniforms.opacity.value = asleep ? 0.08 : 0.2;

      aura.position.set(anchor.x, 0.85 + lift, anchor.z);
      aura.rotation.x = Math.PI / 2.4;
      aura.rotation.z = elapsed;

      const camX = anchor.x * 0.22 + 0.28;
      const camY = 1.9 + (reduce ? 0 : Math.sin(elapsed * 0.4) * 0.04) + night * 0.06;
      const camZ = 6.35 - (activeAction && !asleep ? 0.28 : 0) - (asleep ? 0.05 : 0);
      camera.position.x = THREE.MathUtils.damp(camera.position.x, camX, 2.2, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, camY, 2.2, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, camZ, 2.2, dt);
      look.set(anchor.x * 0.35, 1.16, 0.05);
      camera.lookAt(look);

      if (!reduce) {
        curtainL.rotation.z = Math.sin(elapsed * 0.8) * 0.04;
        curtainR.rotation.z = -Math.sin(elapsed * 0.7 + 1) * 0.045;
        plant.rotation.z = Math.sin(elapsed * 0.9) * 0.08;
        plantB.rotation.z = Math.sin(elapsed * 1.1 + 0.6) * 0.1;
        mobile.rotation.y = elapsed * 0.35;
        mobileStars.forEach((star, i) => {
          star.rotation.y = elapsed * (1.2 + i * 0.3);
          star.rotation.x = elapsed * 0.8;
        });
        const bounce = Math.abs(Math.sin(elapsed * 1.6));
        ball.position.y = 0.16 + bounce * bounce * 0.18;
        ball.rotation.z = elapsed * 0.8;
        ballStripe.position.copy(ball.position);
        ballStripe.rotation.z = ball.rotation.z;
        blanket.position.y = 0.38 + (asleep ? Math.sin(elapsed * 1.4) * 0.01 : 0);
        clouds.forEach((cloud, i) => {
          cloud.position.x = -0.35 + i * 0.4 + Math.sin(elapsed * 0.15 + i) * 0.12;
        });
      }

      const time = new Date();
      const minutes = time.getMinutes();
      const hours = time.getHours() % 12;
      minutePivot.rotation.z = -((minutes / 60) * Math.PI * 2);
      hourPivot.rotation.z = -(((hours + minutes / 60) / 12) * Math.PI * 2);

      dustClock += dt;
      const dustEvery = vibe === "dirty" ? 0.18 : vibe === "great" ? 0.55 : 0.34;
      if (dustClock > dustEvery) {
        dustClock = 0;
        const kind = vibe === "great" && Math.random() < 0.45 ? "star" : "dust";
        burst(kind, (Math.random() - 0.5) * 3.2, 0.2 + Math.random() * 2.2, -0.4 + Math.random() * 1.6, 1, 0.02);
      }
      if (vibe === "play" && !activeAction) {
        sparkleClock += dt;
        if (sparkleClock > 0.7) {
          sparkleClock = 0;
          burst("star", anchor.x, pet.position.y + 0.2, anchor.z, 1, 0.3);
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
        const mat = particle.sprite.material as THREE.SpriteMaterial;
        mat.opacity = 1 - t;
        particle.sprite.scale.setScalar(particle.base * (1 + t * 0.4));
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
    // Scene is created once; skin, sleep and actions stream in through refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="game-scene" ref={mountRef} />;
}
