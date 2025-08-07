
"use client";

import * as React from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uHover;
  uniform float uRippleStrength;
  uniform float uRippleSpeed;
  
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    
    // Hover distortion effect
    float hoverEffect = 1.0 - distance(uv, uMouse) * uHover * 2.0;
    hoverEffect = pow(hoverEffect, 2.0);
    uv.x += (uMouse.x - uv.x) * 0.05 * uHover * hoverEffect;
    uv.y += (uMouse.y - uv.y) * 0.05 * uHover * hoverEffect;

    // Ripple effect on click
    float dist = distance(uv, uMouse);
    float ripple = sin(dist * 20.0 - uTime * uRippleSpeed) * uRippleStrength * (1.0 - uTime * 0.2); // Fade out ripple
    uv.x += ripple * (uMouse.x - uv.x);
    uv.y += ripple * (uMouse.y - uv.y);

    vec4 color = texture2D(uTexture, uv);
    gl_FragColor = color;
  }
`;

export function GalleryItem({
  imageUrl,
  title,
  description,
  ...props
}: {
  imageUrl: string;
  title: string;
  description: string;
  [key: string]: any;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin(""); // Handle potential CORS issues
    const texture = textureLoader.load(imageUrl);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uHover: { value: 0 },
        uRippleStrength: { value: 0.0 },
        uRippleSpeed: { value: 5.0 },
      },
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationId: number;
    let hoverTween: number;
    let rippleTween: number;

    const handleResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    handleResize();

    const animate = () => {
      material.uniforms.uTime.value += 0.01;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();
    
    const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        material.uniforms.uMouse.value.x = (e.clientX - rect.left) / rect.width;
        material.uniforms.uMouse.value.y = 1.0 - (e.clientY - rect.top) / rect.height;
    };
    
    const handleMouseEnter = () => {
        if (hoverTween) cancelAnimationFrame(hoverTween);
        const animateHover = () => {
            material.uniforms.uHover.value += (1.0 - material.uniforms.uHover.value) * 0.1;
            if (Math.abs(1.0 - material.uniforms.uHover.value) > 0.001) {
                hoverTween = requestAnimationFrame(animateHover);
            }
        };
        animateHover();
    };
    
    const handleMouseLeave = () => {
        if (hoverTween) cancelAnimationFrame(hoverTween);
        const animateHoverOut = () => {
            material.uniforms.uHover.value += (0.0 - material.uniforms.uHover.value) * 0.1;
            if (material.uniforms.uHover.value > 0.001) {
                hoverTween = requestAnimationFrame(animateHoverOut);
            }
        };
        animateHoverOut();
    };

    const handleClick = () => {
        if(rippleTween) cancelAnimationFrame(rippleTween);
        material.uniforms.uTime.value = 0;
        material.uniforms.uRippleStrength.value = 0.1;
        const animateRipple = () => {
            material.uniforms.uRippleStrength.value += (0.0 - material.uniforms.uRippleStrength.value) * 0.05;
            if(material.uniforms.uRippleStrength.value > 0.001) {
                rippleTween = requestAnimationFrame(animateRipple);
            }
        };
        animateRipple();
    }

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleClick);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      if (hoverTween) cancelAnimationFrame(hoverTween);
      if (rippleTween) cancelAnimationFrame(rippleTween);

      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClick);
      window.removeEventListener("resize", handleResize);
      
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [imageUrl]);

  return (
    <div
      ref={containerRef}
      className="group relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
      {...props}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-white/80">{description}</p>
      </div>
    </div>
  );
}
