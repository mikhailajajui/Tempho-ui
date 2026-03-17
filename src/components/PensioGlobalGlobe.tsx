"use client";

import { useEffect, useRef } from "react";
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

function generateContinentTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
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
    ctx.shadowColor = "rgba(150, 103, 37, 0.18)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
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

  for (let i = 0; i < 2200; i += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 1.8 + 0.45;

    ctx.beginPath();
    ctx.fillStyle = i % 3 === 0 ? "rgba(255, 244, 204, 0.28)" : "rgba(126, 86, 26, 0.12)";
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 320; i += 1) {
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

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 4;
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

export function PensioGlobalGlobe({ className }: PensioGlobalGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mountNode = mountRef.current;

    if (!mountNode) {
      return;
    }

    const rootStyles = getComputedStyle(document.documentElement);
    const ink900 = rootStyles.getPropertyValue("--ink-900").trim() || "#0f172a";
    const ink300 = rootStyles.getPropertyValue("--ink-300").trim() || "#cbd5e1";
    const yellow = rootStyles.getPropertyValue("--yellow-cta").trim() || "#FFD55A";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    // Transparent background to inherit slide colors
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.2, 5.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0); // Fully transparent
    mountNode.appendChild(renderer.domElement);

    const globeCenterWorld = new THREE.Vector3();
    const objectWorld = new THREE.Vector3();
    const cameraDirection = new THREE.Vector3();
    const objectDirection = new THREE.Vector3();

    // Store arc data for animation
    type ArcData = {
      curve: THREE.QuadraticBezierCurve3;
      dashNodes: THREE.Mesh[];
      pulse: THREE.Mesh;
      pulseGlow?: THREE.Mesh;
      progress: number;
      speed: number;
      color: string;
      dashOffset: number;
    };
    const arcDataList: ArcData[] = [];
    const continentTexture = generateContinentTexture();

    const getFrontVisibility = (object: THREE.Object3D) => {
      globeGroup.getWorldPosition(globeCenterWorld);
      object.getWorldPosition(objectWorld);

      cameraDirection.copy(camera.position).sub(globeCenterWorld).normalize();
      objectDirection.copy(objectWorld).sub(globeCenterWorld).normalize();

      const dot = objectDirection.dot(cameraDirection);
      return THREE.MathUtils.smoothstep(dot, -0.06, 0.16);
    };

    const renderFrame = (elapsed: number) => {
      // Animate pulsing rings at destinations
      rings.children.forEach((ringNode) => {
        const ring = ringNode as THREE.Mesh;
        const pulse = reducedMotion
          ? 1.24
          : 1 + ((Math.sin(elapsed * 1.8 + ring.userData.phase) + 1) / 2) * 0.75;
        ring.scale.setScalar(pulse);
        const ringMaterial = ring.material as THREE.MeshBasicMaterial;
        const frontVisibility = getFrontVisibility(ring);
        ringMaterial.opacity = (reducedMotion
          ? 0.34
          : 0.18 + ((Math.sin(elapsed * 1.8 + ring.userData.phase) + 1) / 2) * 0.32) * frontVisibility;
        ring.visible = frontVisibility > 0.02;
        ring.lookAt(camera.position);
      });

      markers.children.forEach((markerNode) => {
        const marker = markerNode as THREE.Mesh;
        const markerMaterial = marker.material as THREE.MeshBasicMaterial;
        const frontVisibility = getFrontVisibility(marker);
        markerMaterial.opacity = (marker.userData.baseOpacity as number) * frontVisibility;
        marker.visible = frontVisibility > 0.02;
      });

      // Animate traveling pulses along arcs
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
          arcData.progress = 0.5; // Static midpoint for reduced motion
          arcData.dashOffset = 0.22;
        }

        arcData.dashNodes.forEach((dashNode, index) => {
          const dashProgress = (index / arcData.dashNodes.length + arcData.dashOffset) % 1;
          const dashPoint = arcData.curve.getPoint(dashProgress);
          dashNode.position.copy(dashPoint);

          const dashMaterial = dashNode.material as THREE.MeshBasicMaterial;
          const pulseBand = Math.sin(((dashProgress + arcData.progress) % 1) * Math.PI);
          const baseOpacity = 0.12 + Math.max(0, pulseBand) * 0.48;
          const frontVisibility = getFrontVisibility(dashNode);
          dashMaterial.opacity = (reducedMotion ? 0.18 : baseOpacity) * frontVisibility;
          dashNode.visible = frontVisibility > 0.02;

          const dashScale = 0.75 + Math.max(0, pulseBand) * 0.9;
          dashNode.scale.setScalar(dashScale);
        });

        // Get position along the curve
        const point = arcData.curve.getPoint(arcData.progress);
        arcData.pulse.position.copy(point);
        if (arcData.pulseGlow) {
          arcData.pulseGlow.position.copy(point);
        }

        // Fade pulse based on position (brighter in middle)
        const fadeIn = Math.min(arcData.progress * 3, 1);
        const fadeOut = Math.min((1 - arcData.progress) * 3, 1);
        const opacity = fadeIn * fadeOut;
        const pulseVisibility = getFrontVisibility(arcData.pulse);

        const pulseMaterial = arcData.pulse.material as THREE.MeshBasicMaterial;
        pulseMaterial.opacity = opacity * pulseVisibility;
        arcData.pulse.visible = pulseVisibility > 0.02;

        if (arcData.pulseGlow) {
          const glowVisibility = getFrontVisibility(arcData.pulseGlow);
          const glowMaterial = arcData.pulseGlow.material as THREE.MeshBasicMaterial;
          glowMaterial.opacity = opacity * 0.6 * glowVisibility;
          arcData.pulseGlow.visible = glowVisibility > 0.02;
        }

        // Scale pulse (larger in middle of journey)
        const scale = 1 + Math.sin(arcData.progress * Math.PI) * 0.5;
        arcData.pulse.scale.setScalar(scale);
        if (arcData.pulseGlow) {
          arcData.pulseGlow.scale.setScalar(scale);
        }
      });

      if (reducedMotion) {
        globeGroup.rotation.set(0.04, 0.56, 0);
        stars.rotation.y = -0.08;
        orbitRing.rotation.z = 0.24;
      }

      renderer.render(scene, camera);
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

    // Warm lighting setup
    const ambientLight = new THREE.AmbientLight("#fff8e7", 1.2);
    const keyLight = new THREE.DirectionalLight("#fffaf0", 1.6);
    keyLight.position.set(4, 3, 5);
    const fillLight = new THREE.DirectionalLight(yellow, 0.5);
    fillLight.position.set(-3, 1, 3);
    const rimLight = new THREE.PointLight("#ffecd2", 0.8, 20);
    rimLight.position.set(-4, -2, -3);

    scene.add(ambientLight, keyLight, fillLight, rimLight);

    // Globe core - soft taupe/sand with warm undertone for contrast against cream background
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(1.55, 64, 64),
      new THREE.MeshPhongMaterial({
        color: new THREE.Color("#ddd1bf"),
        map: continentTexture ?? undefined,
        emissive: new THREE.Color("#c8b9a4"),
        emissiveIntensity: 0.2,
        shininess: 12,
        transparent: true,
        opacity: 0.97,
      }),
    );
    globeGroup.add(core);

    // Grid lines - slightly visible for structure
    const wireframe = new THREE.Mesh(
      new THREE.SphereGeometry(1.56, 36, 18),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#c4b49a"),      // Darker gold-brown for visibility
        wireframe: true,
        transparent: true,
        opacity: 0.2,
      }),
    );
    globeGroup.add(wireframe);

    // Warm atmosphere glow
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.72, 48, 48),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#f5d78e"),      // Golden glow
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
      }),
    );
    globeGroup.add(atmosphere);

    // Subtle outer glow ring
    const glowRing = new THREE.Mesh(
      new THREE.RingGeometry(1.7, 2.1, 64),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(yellow),
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide,
      }),
    );
    glowRing.rotation.x = Math.PI / 2;
    globeGroup.add(glowRing);

    // Background particles (very subtle, warm gold tint)
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(600);
    for (let i = 0; i < starPositions.length; i += 3) {
      const radius = THREE.MathUtils.randFloat(6, 12);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));

      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.cos(phi);
      starPositions[i + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starsGeometry,
      new THREE.PointsMaterial({
        color: new THREE.Color("#d4b87a"),      // Warm gold particles
        size: 0.015,
        transparent: true,
        opacity: 0.25,
      }),
    );
    scene.add(stars);

    // Subtle orbit ring
    const orbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.0, 0.008, 16, 200),
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
    const arcs = new THREE.Group();
    const pulses = new THREE.Group();
    globeGroup.add(markers, rings, arcs, pulses);

    // Create arcs with animated traveling pulses
    globeArcs.forEach((arc, index) => {
      const start = latLngToVector3(arc.startLat, arc.startLng, 1.58);
      const end = latLngToVector3(arc.endLat, arc.endLng, 1.58);
      const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(2.3 + (index % 2) * 0.15);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);

      const dashNodes: THREE.Mesh[] = [];
      for (let dashIndex = 0; dashIndex < 22; dashIndex += 1) {
        const dash = new THREE.Mesh(
          new THREE.SphereGeometry(0.018, 10, 10),
          new THREE.MeshBasicMaterial({
            color: new THREE.Color(arc.color),
            transparent: true,
            opacity: 0.2,
          }),
        );
        dashNodes.push(dash);
        arcs.add(dash);
      }

      // Traveling pulse sphere - BRIGHT
      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 16, 16),   // Larger pulse
        new THREE.MeshBasicMaterial({
          color: new THREE.Color("#ffffff"),      // White core for glow effect
          transparent: true,
          opacity: 1,
        }),
      );
      pulse.position.copy(start);
      pulses.add(pulse);

      // Pulse glow (larger, colored)
      const pulseGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 12, 12),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(arc.color),
          transparent: true,
          opacity: 0.6,
        }),
      );
      pulseGlow.position.copy(start);
      pulses.add(pulseGlow);

      // Store arc data for animation (pulse and glow move together)
      arcDataList.push({
        curve,
        dashNodes,
        pulse,
        pulseGlow,
        progress: index * 0.16,                   // Stagger start positions
        speed: 0.004 + Math.random() * 0.002,    // Slightly faster
        color: arc.color,
        dashOffset: index * 0.08,
      });

      // Start marker (origin city)
      const startMarker = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 16, 16),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(yellow),
          transparent: true,
          opacity: 0.95,
        }),
      );
      startMarker.position.copy(start);
      startMarker.userData.baseOpacity = 0.95;
      markers.add(startMarker);

      // End marker (destination city)
      const endMarker = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 16, 16),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(arc.color),
          transparent: true,
          opacity: 0.9,
        }),
      );
      endMarker.position.copy(end);
      endMarker.userData.baseOpacity = 0.9;
      markers.add(endMarker);

      // Destination rings (pulsing)
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.08, 0.12, 32),
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

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mountNode);

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const rotationStep = 0.12 * delta;

      globeGroup.rotation.y += rotationStep;
      globeGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.06;
      stars.rotation.y -= 0.015 * delta;
      orbitRing.rotation.z += 0.06 * delta;
      glowRing.rotation.z -= 0.03 * delta;

      renderFrame(elapsed);
      frameId = window.requestAnimationFrame(animate);
    };

    renderFrame(0);

    if (!reducedMotion) {
      animate();
    }

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      resizeObserver.disconnect();
      mountNode.removeChild(renderer.domElement);
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
      continentTexture?.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className={[styles.globeShell, className].filter(Boolean).join(" ")}>
      <div ref={mountRef} className={styles.globeCanvas} aria-hidden="true" />
    </div>
  );
}
