"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import globeGeoJson from "@/data/globe.json";
import styles from "./PensioGlobalGlobe.module.css";

type ArcConfig = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
  label: string;
};

const globeArcs: ArcConfig[] = [
  { startLat: -33.8688, startLng: 151.2093, endLat: 1.3521, endLng: 103.8198, color: "#ffd55a", label: "Sydney - Singapore" },
  { startLat: -33.8688, startLng: 151.2093, endLat: 51.5072, endLng: -0.1276, color: "#f4a300", label: "Sydney - London" },
  { startLat: -37.8136, startLng: 144.9631, endLat: 34.0522, endLng: -118.2437, color: "#ffd55a", label: "Melbourne - Los Angeles" },
  { startLat: -27.4698, startLng: 153.0251, endLat: 35.6762, endLng: 139.6503, color: "#f7c948", label: "Brisbane - Tokyo" },
  { startLat: -31.9505, startLng: 115.8605, endLat: 25.2048, endLng: 55.2708, color: "#ffbf3c", label: "Perth - Dubai" },
  { startLat: -36.8485, startLng: 174.7633, endLat: 40.7128, endLng: -74.006, color: "#ffd55a", label: "Auckland - New York" },
];

type LonLat = [number, number];

type GeoPolygon = LonLat[][];
type GeoMultiPolygon = LonLat[][][];
type GlobeFeature = {
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: GeoPolygon | GeoMultiPolygon;
  };
  properties?: {
    admin?: string;
    continent?: string;
    name?: string;
  };
};

const continentFeatures = (globeGeoJson.features as unknown as GlobeFeature[]).filter((feature) => {
  if (feature.geometry.type !== "Polygon" && feature.geometry.type !== "MultiPolygon") {
    return false;
  }

  const admin = feature.properties?.admin;
  const continent = feature.properties?.continent;
  return admin !== "Antarctica" && continent !== "Seven seas (open ocean)";
});

function projectLonLatToCanvas(lng: number, lat: number, width: number, height: number) {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

function traceRing(
  ctx: CanvasRenderingContext2D,
  ring: LonLat[],
  width: number,
  height: number,
) {
  if (ring.length < 2) {
    return;
  }

  ring.forEach(([lng, lat], index) => {
    const { x, y } = projectLonLatToCanvas(lng, lat, width, height);
    if (index === 0) {
      ctx.moveTo(x, y);
      return;
    }

    ctx.lineTo(x, y);
  });

  ctx.closePath();
}

function tracePolygon(
  ctx: CanvasRenderingContext2D,
  polygon: GeoPolygon,
  width: number,
  height: number,
) {
  polygon.forEach((ring) => {
    traceRing(ctx, ring, width, height);
  });
}

function traceContinentPaths(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  continentFeatures.forEach((feature) => {
    ctx.beginPath();

    if (feature.geometry.type === "Polygon") {
      tracePolygon(ctx, feature.geometry.coordinates as GeoPolygon, width, height);
    } else {
      (feature.geometry.coordinates as GeoMultiPolygon).forEach((polygon) => {
        tracePolygon(ctx, polygon, width, height);
      });
    }
  });
}

let cachedTextureCanvas: HTMLCanvasElement | null = null;

function generateContinentTextureCanvas(): HTMLCanvasElement {
  if (cachedTextureCanvas) {
    return cachedTextureCanvas;
  }

  // Reduced from 2048×1024 to 1024×512 — halves GPU memory and generation time
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return canvas;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = true;

  const fillGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  fillGradient.addColorStop(0, "#f2cf72");
  fillGradient.addColorStop(0.38, "#ddb452");
  fillGradient.addColorStop(0.58, "#d4a43a");
  fillGradient.addColorStop(1, "#9a7035");

  const ridgeGradient = ctx.createLinearGradient(0, canvas.height * 0.12, canvas.width, canvas.height * 0.88);
  ridgeGradient.addColorStop(0, "rgba(255, 247, 214, 0.28)");
  ridgeGradient.addColorStop(0.5, "rgba(255, 247, 214, 0.08)");
  ridgeGradient.addColorStop(1, "rgba(122, 83, 24, 0.18)");

  const coastalGradient = ctx.createLinearGradient(canvas.width * 0.2, 0, canvas.width * 0.8, canvas.height);
  coastalGradient.addColorStop(0, "rgba(255, 250, 230, 0.32)");
  coastalGradient.addColorStop(0.35, "rgba(255, 234, 176, 0.12)");
  coastalGradient.addColorStop(1, "rgba(122, 83, 24, 0.2)");

  const glowGradient = ctx.createRadialGradient(
    canvas.width * 0.55,
    canvas.height * 0.42,
    20,
    canvas.width * 0.55,
    canvas.height * 0.42,
    canvas.width * 0.48,
  );
  glowGradient.addColorStop(0, "rgba(255, 234, 176, 0.45)");
  glowGradient.addColorStop(1, "rgba(255, 234, 176, 0)");

  continentFeatures.forEach((feature) => {
    ctx.beginPath();
    if (feature.geometry.type === "Polygon") {
      tracePolygon(ctx, feature.geometry.coordinates as GeoPolygon, canvas.width, canvas.height);
    } else {
      (feature.geometry.coordinates as GeoMultiPolygon).forEach((polygon) => {
        tracePolygon(ctx, polygon, canvas.width, canvas.height);
      });
    }
    ctx.save();
    ctx.fillStyle = fillGradient;
    ctx.fill("evenodd");
    ctx.fillStyle = ridgeGradient;
    ctx.fill("evenodd");
    ctx.strokeStyle = "rgba(255, 247, 214, 0.45)";
    ctx.lineWidth = 3.5;
    ctx.stroke();
    ctx.restore();
  });

  ctx.save();
  traceContinentPaths(ctx, canvas.width, canvas.height);
  ctx.clip();

  // Reduced from 2200 to 800 dots — still dense enough at lower resolution
  for (let i = 0; i < 800; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 1.8 + 0.45;

    ctx.beginPath();
    ctx.fillStyle = i % 3 === 0 ? "rgba(255, 244, 204, 0.28)" : "rgba(126, 86, 26, 0.12)";
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Reduced from 320 to 120 ridge lines
  for (let i = 0; i < 120; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const length = Math.random() * 24 + 10;
    const angle = (-20 + Math.random() * 40) * (Math.PI / 180);

    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 248, 221, 0.08)";
    ctx.lineWidth = Math.random() * 1.6 + 0.4;
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    ctx.stroke();
  }

  ctx.fillStyle = coastalGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = "rgba(255, 251, 232, 0.8)";
  ctx.lineWidth = 2;
  traceContinentPaths(ctx, canvas.width, canvas.height);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.strokeStyle = "rgba(110, 74, 20, 0.5)";
  ctx.lineWidth = 1.2;
  traceContinentPaths(ctx, canvas.width, canvas.height);
  ctx.stroke();
  ctx.restore();

  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = glowGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";

  cachedTextureCanvas = canvas;
  return canvas;
}

function createTextureFromCanvas(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 2; // Reduced from 4
  texture.needsUpdate = true;
  return texture;
}

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

type PensioGlobalGlobeProps = {
  className?: string;
};

type WindowWithIdleCallback = Window & {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const DASHES_PER_ARC = 14; // Reduced from 22

export function PensioGlobalGlobe({ className }: PensioGlobalGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const mountNode = mountRef.current;

    if (!mountNode || shouldLoad) {
      return;
    }

    const idleWindow = window as WindowWithIdleCallback;
    let idleHandle: number | null = null;

    const scheduleLoad = () => {
      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(() => {
          setShouldLoad(true);
        }, { timeout: 900 });
        return;
      }

      idleHandle = window.setTimeout(() => {
        setShouldLoad(true);
      }, 120);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        observer.disconnect();
        scheduleLoad();
      },
      { rootMargin: "240px 0px", threshold: 0.01 },
    );

    observer.observe(mountNode);

    return () => {
      observer.disconnect();
      if (idleHandle !== null) {
        if (idleWindow.cancelIdleCallback) {
          idleWindow.cancelIdleCallback(idleHandle);
        } else {
          window.clearTimeout(idleHandle);
        }
      }
    };
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad) {
      return;
    }

    const mountNode = mountRef.current;

    if (!mountNode) {
      return;
    }

    const rootStyles = getComputedStyle(document.documentElement);
    const yellow = rootStyles.getPropertyValue("--yellow-cta").trim() || "#FFD55A";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.2, 5.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // Disabled — saves ~50% GPU fill rate
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Reduced from 1.75
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    mountNode.appendChild(renderer.domElement);

    // Reusable vectors for visibility checks (allocated once)
    const _globeCenter = new THREE.Vector3();
    const _camDir = new THREE.Vector3();
    const _objDir = new THREE.Vector3();

    // Store arc data for animation
    type ArcData = {
      curve: THREE.QuadraticBezierCurve3;
      instancedMesh: THREE.InstancedMesh;
      pulse: THREE.Mesh;
      pulseGlow?: THREE.Mesh;
      progress: number;
      speed: number;
      color: string;
      dashOffset: number;
    };
    const arcDataList: ArcData[] = [];

    // Globe core material — start without texture, apply async
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: new THREE.Color("#ddd1bf"),
      emissive: new THREE.Color("#c8b9a4"),
      emissiveIntensity: 0.2,
      shininess: 12,
      transparent: true,
      opacity: 0.97,
    });

    // Generate texture off the critical path
    requestAnimationFrame(() => {
      const textureCanvas = generateContinentTextureCanvas();
      const texture = createTextureFromCanvas(textureCanvas);
      coreMaterial.map = texture;
      coreMaterial.needsUpdate = true;
    });

    let hasMarkedReady = false;

    // Visibility check using globe group world transform
    const getFrontVisibility = (worldPos: THREE.Vector3) => {
      _objDir.copy(worldPos).sub(_globeCenter).normalize();
      const dot = _objDir.dot(_camDir);
      return THREE.MathUtils.smoothstep(dot, -0.06, 0.16);
    };

    // Temp matrix/position/scale/quaternion for instanced mesh updates
    const _mat4 = new THREE.Matrix4();
    const _pos = new THREE.Vector3();
    const _quat = new THREE.Quaternion();
    const _scale = new THREE.Vector3();
    const _color = new THREE.Color();

    const renderFrame = (elapsed: number) => {
      // Compute camera direction once per frame
      globeGroup.getWorldPosition(_globeCenter);
      _camDir.copy(camera.position).sub(_globeCenter).normalize();

      // Animate pulsing rings at destinations
      rings.children.forEach((ringNode) => {
        const ring = ringNode as THREE.Mesh;
        const pulse = reducedMotion
          ? 1.24
          : 1 + ((Math.sin(elapsed * 1.8 + ring.userData.phase) + 1) / 2) * 0.75;
        ring.scale.setScalar(pulse);
        const ringMaterial = ring.material as THREE.MeshBasicMaterial;
        ring.getWorldPosition(_pos);
        const frontVisibility = getFrontVisibility(_pos);
        ringMaterial.opacity = (reducedMotion
          ? 0.34
          : 0.18 + ((Math.sin(elapsed * 1.8 + ring.userData.phase) + 1) / 2) * 0.32) * frontVisibility;
        ring.visible = frontVisibility > 0.02;
        ring.lookAt(camera.position);
      });

      markers.children.forEach((markerNode) => {
        const marker = markerNode as THREE.Mesh;
        const markerMaterial = marker.material as THREE.MeshBasicMaterial;
        marker.getWorldPosition(_pos);
        const frontVisibility = getFrontVisibility(_pos);
        markerMaterial.opacity = (marker.userData.baseOpacity as number) * frontVisibility;
        marker.visible = frontVisibility > 0.02;
      });

      // Animate arcs using InstancedMesh
      arcDataList.forEach((arcData) => {
        if (!reducedMotion) {
          arcData.progress += arcData.speed;
          arcData.dashOffset += arcData.speed * 0.9;
          if (arcData.progress > 1) {
            arcData.progress = 0;
          }
          if (arcData.dashOffset > 1) {
            arcData.dashOffset = 0;
          }
        } else {
          arcData.progress = 0.5;
          arcData.dashOffset = 0.22;
        }

        const im = arcData.instancedMesh;
        for (let i = 0; i < DASHES_PER_ARC; i++) {
          const dashProgress = (i / DASHES_PER_ARC + arcData.dashOffset) % 1;
          const dashPoint = arcData.curve.getPoint(dashProgress);

          // Transform dash point to world space for visibility check
          _pos.copy(dashPoint);
          globeGroup.localToWorld(_pos);
          const frontVisibility = getFrontVisibility(_pos);

          const pulseBand = Math.sin(((dashProgress + arcData.progress) % 1) * Math.PI);
          const baseOpacity = 0.12 + Math.max(0, pulseBand) * 0.48;
          const dashScale = 0.75 + Math.max(0, pulseBand) * 0.9;

          // Set instance transform
          _mat4.compose(
            dashPoint,
            _quat,
            _scale.setScalar(frontVisibility > 0.02 ? dashScale : 0), // scale to 0 = invisible
          );
          im.setMatrixAt(i, _mat4);

          // Set instance color with opacity baked into alpha
          const opacity = (reducedMotion ? 0.18 : baseOpacity) * frontVisibility;
          _color.set(arcData.color);
          // Approximate opacity via color brightness since InstancedMesh shares material
          _color.multiplyScalar(opacity / 0.5);
          im.setColorAt(i, _color);
        }
        im.instanceMatrix.needsUpdate = true;
        if (im.instanceColor) im.instanceColor.needsUpdate = true;

        // Traveling pulse
        const point = arcData.curve.getPoint(arcData.progress);
        arcData.pulse.position.copy(point);
        if (arcData.pulseGlow) {
          arcData.pulseGlow.position.copy(point);
        }

        const fadeIn = Math.min(arcData.progress * 3, 1);
        const fadeOut = Math.min((1 - arcData.progress) * 3, 1);
        const opacity = fadeIn * fadeOut;

        _pos.copy(point);
        globeGroup.localToWorld(_pos);
        const pulseVisibility = getFrontVisibility(_pos);

        const pulseMaterial = arcData.pulse.material as THREE.MeshBasicMaterial;
        pulseMaterial.opacity = opacity * pulseVisibility;
        arcData.pulse.visible = pulseVisibility > 0.02;

        if (arcData.pulseGlow) {
          const glowMaterial = arcData.pulseGlow.material as THREE.MeshBasicMaterial;
          glowMaterial.opacity = opacity * 0.6 * pulseVisibility;
          arcData.pulseGlow.visible = pulseVisibility > 0.02;
        }

        const scale = 1 + Math.sin(arcData.progress * Math.PI) * 0.5;
        arcData.pulse.scale.setScalar(scale);
        if (arcData.pulseGlow) {
          arcData.pulseGlow.scale.setScalar(scale);
        }
      });

      if (reducedMotion) {
        globeGroup.rotation.set(0.04, 0.56, 0);
        orbitRing.rotation.z = 0.24;
      }

      renderer.render(scene, camera);

      if (!hasMarkedReady) {
        hasMarkedReady = true;
        setIsReady(true);
      }
    };

    const resize = () => {
      const width = mountNode.clientWidth;
      const height = mountNode.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderFrame(clock.getElapsedTime());
    };

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Warm lighting setup — reduced to 2 lights from 4
    const ambientLight = new THREE.AmbientLight("#fff8e7", 1.4);
    const keyLight = new THREE.DirectionalLight("#fffaf0", 1.8);
    keyLight.position.set(4, 3, 5);
    scene.add(ambientLight, keyLight);

    // Globe core — reduced from 64×64 to 32×32 segments (8192 → 2048 triangles)
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(1.55, 32, 32),
      coreMaterial,
    );
    globeGroup.add(core);

    // Grid lines — reduced segments
    const wireframe = new THREE.Mesh(
      new THREE.SphereGeometry(1.56, 24, 12),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#c4b49a"),
        wireframe: true,
        transparent: true,
        opacity: 0.2,
      }),
    );
    globeGroup.add(wireframe);

    // Warm atmosphere glow — reduced from 48×48 to 16×16
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.72, 16, 16),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#f5d78e"),
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
      }),
    );
    globeGroup.add(atmosphere);

    // Subtle outer glow ring — reduced from 64 to 32 segments
    const glowRing = new THREE.Mesh(
      new THREE.RingGeometry(1.7, 2.1, 32),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(yellow),
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide,
      }),
    );
    glowRing.rotation.x = Math.PI / 2;
    globeGroup.add(glowRing);

    // Subtle orbit ring — reduced torus segments
    const orbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.0, 0.008, 8, 64),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#d4b56a"),
        transparent: true,
        opacity: 0.2,
      }),
    );
    orbitRing.rotation.x = Math.PI / 2.5;
    orbitRing.rotation.y = Math.PI / 6;
    globeGroup.add(orbitRing);

    const markers = new THREE.Group();
    const rings = new THREE.Group();
    const pulses = new THREE.Group();
    globeGroup.add(markers, rings, pulses);

    // Shared geometries for dash nodes — ONE geometry for ALL dashes
    const dashGeometry = new THREE.SphereGeometry(0.018, 6, 6); // Reduced from 10×10

    // Create arcs with InstancedMesh for dashes (1 draw call per arc instead of 14)
    globeArcs.forEach((arc, index) => {
      const start = latLngToVector3(arc.startLat, arc.startLng, 1.58);
      const end = latLngToVector3(arc.endLat, arc.endLng, 1.58);
      const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(2.3 + (index % 2) * 0.15);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);

      // InstancedMesh: 1 draw call for all dashes in this arc
      const dashMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(arc.color),
        transparent: true,
        opacity: 0.3,
      });
      const instancedMesh = new THREE.InstancedMesh(dashGeometry, dashMaterial, DASHES_PER_ARC);
      instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      // Initialize instances
      for (let i = 0; i < DASHES_PER_ARC; i++) {
        const t = i / DASHES_PER_ARC;
        const p = curve.getPoint(t);
        _mat4.makeTranslation(p.x, p.y, p.z);
        instancedMesh.setMatrixAt(i, _mat4);
      }
      globeGroup.add(instancedMesh);

      // Traveling pulse sphere — reduced segments
      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 8, 8),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color("#ffffff"),
          transparent: true,
          opacity: 1,
        }),
      );
      pulse.position.copy(start);
      pulses.add(pulse);

      // Pulse glow — reduced segments
      const pulseGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 8, 8),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(arc.color),
          transparent: true,
          opacity: 0.6,
        }),
      );
      pulseGlow.position.copy(start);
      pulses.add(pulseGlow);

      arcDataList.push({
        curve,
        instancedMesh,
        pulse,
        pulseGlow,
        progress: index * 0.16,
        speed: 0.004 + Math.random() * 0.002,
        color: arc.color,
        dashOffset: index * 0.08,
      });

      // Start marker — reduced segments
      const startMarker = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 8, 8),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(yellow),
          transparent: true,
          opacity: 0.95,
        }),
      );
      startMarker.position.copy(start);
      startMarker.userData.baseOpacity = 0.95;
      markers.add(startMarker);

      // End marker
      const endMarker = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 8, 8),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(arc.color),
          transparent: true,
          opacity: 0.9,
        }),
      );
      endMarker.position.copy(end);
      endMarker.userData.baseOpacity = 0.9;
      markers.add(endMarker);

      // Destination ring — reduced segments
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.08, 0.12, 16),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(arc.color),
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide,
        }),
      );
      ring.position.copy(end);
      ring.lookAt(camera.position);
      ring.userData = {
        phase: index * 0.7,
      };
      rings.add(ring);
    });

    const clock = new THREE.Clock();
    let frameId = 0;
    let isInViewport = true;
    let isTabVisible = true;

    const shouldAnimate = () => isInViewport && isTabVisible;

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mountNode);

    const startLoop = () => {
      if (!shouldAnimate() || reducedMotion || frameId) return;
      clock.start();
      frameId = window.requestAnimationFrame(animate);
    };

    const stopLoop = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
      clock.stop();
    };

    const animate = () => {
      if (!shouldAnimate()) {
        stopLoop();
        return;
      }

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const rotationStep = 0.12 * delta;

      globeGroup.rotation.y += rotationStep;
      globeGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.06;
      orbitRing.rotation.z += 0.06 * delta;
      glowRing.rotation.z -= 0.03 * delta;

      renderFrame(elapsed);
      frameId = window.requestAnimationFrame(animate);
    };

    renderFrame(0);

    // Pause when globe scrolls off-screen
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewport = entry.isIntersecting;
        if (isInViewport) startLoop(); else stopLoop();
      },
      { threshold: 0.01 },
    );
    visibilityObserver.observe(mountNode);

    // Pause when user switches tabs
    const onVisibilityChange = () => {
      isTabVisible = document.visibilityState === "visible";
      if (isTabVisible) startLoop(); else stopLoop();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (!reducedMotion) {
      animate();
    }

    return () => {
      isInViewport = false;
      isTabVisible = false;
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (mountNode.contains(renderer.domElement)) {
        mountNode.removeChild(renderer.domElement);
      }
      dashGeometry.dispose();
      scene.traverse((object) => {
        const disposableObject = object as THREE.Object3D & {
          geometry?: THREE.BufferGeometry;
          material?: THREE.Material | THREE.Material[];
        };

        if (disposableObject.geometry) {
          disposableObject.geometry.dispose();
        }

        const { material } = disposableObject;
        if (Array.isArray(material)) {
          material.forEach((item) => item.dispose());
        } else if (material) {
          material.dispose();
        }
      });
      coreMaterial.map?.dispose();
      renderer.dispose();
    };
  }, [shouldLoad]);

  return (
    <div className={[styles.globeShell, className].filter(Boolean).join(" ")}>
      <div
        className={[
          styles.globePoster,
          isReady && styles.globePosterHidden,
        ].filter(Boolean).join(" ")}
        aria-hidden="true"
      >
        <div className={styles.posterGlow} />
        <div className={styles.posterOrbit} />
        <div className={styles.posterSphere}>
          <div className={styles.posterSphereInner}>
            <div className={styles.posterMap} />
            <div className={styles.posterGrid} />
          </div>
        </div>
        <svg
          className={styles.posterRoutes}
          viewBox="0 0 640 420"
          fill="none"
          preserveAspectRatio="none"
        >
          <path d="M170 246C218 152 321 128 410 184" />
          <path d="M198 270C286 116 454 118 518 204" />
          <path d="M132 218C218 88 414 80 552 166" />
        </svg>
        <div className={[styles.posterMarker, styles.posterMarkerA].join(" ")} />
        <div className={[styles.posterMarker, styles.posterMarkerB].join(" ")} />
        <div className={[styles.posterMarker, styles.posterMarkerC].join(" ")} />
        <div className={[styles.posterPulse, styles.posterPulseA].join(" ")} />
        <div className={[styles.posterPulse, styles.posterPulseB].join(" ")} />
      </div>
      <div
        ref={mountRef}
        className={[
          styles.globeCanvas,
          shouldLoad && styles.globeCanvasLoading,
          isReady && styles.globeCanvasReady,
        ].filter(Boolean).join(" ")}
        aria-hidden="true"
      />
    </div>
  );
}
