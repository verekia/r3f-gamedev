# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Three Fiber (R3F) game development recipes project using Next.js. It demonstrates minimal patterns for 3D game development with R3F, including WebGPU support via Three.js TSL (Three Shading Language).

## Commands

- `bun dev` - Start development server
- `bun run build` - Build for production (static export to `out/`)
- `bun start` - Serve the production build locally

## Architecture

- **Next.js Pages Router** with static export (`output: 'export'`)
- **React 19** with React Compiler enabled
- **React Three Fiber v10 alpha** with WebGPU renderer (`@react-three/fiber/webgpu`)
- **Three.js TSL** for shader node materials (`three/tsl`)
- **Bun** as the package manager and runtime

## Key Files

- `pages/` - Page components, each demonstrating a recipe/pattern
- `r3f.d.ts` - Type declarations extending R3F's ThreeElements for WebGPU types
- `patches/` - Bun patches for three.js and detect-gpu dependencies

## WebGPU/TSL Notes

The project uses Three.js's new WebGPU renderer and TSL for declarative shaders. Import patterns:

- Canvas from `@react-three/fiber/webgpu`
- Shader nodes from `three/tsl` (e.g., `Fn`, `vec3`, `sin`, `time`)
- Use `meshBasicNodeMaterial` and similar node materials for TSL integration
