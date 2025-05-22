/**
 * Animation Manager
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-2-1 (Harmonic Layer - Utils)
 *
 * This utility provides a centralized manager for all animations in the system.
 * It follows the Parashakti principle of coordinating vibrational/dynamic aspects
 * across the entire application.
 */

import * as THREE from 'three';

// Animation subsystem enum (aligned with Bimba architecture)
export enum AnimationSubsystem {
  ANUTTARA = 0,    // Foundational animations
  PARAMASIVA = 1,  // Logical structure animations
  PARASHAKTI = 2,  // Template/vibrational animations
  MAHAMAYA = 3,    // Integration animations
  NARA = 4,        // Application-level animations
  EPII = 5         // Meta-level animations
}

// Animation category enum
export enum AnimationCategory {
  WIREFRAME = 'wireframe',  // Diamond/torus wireframe animations
  NODE = 'node',            // Node animations (size, color, etc.)
  LINK = 'link',            // Link animations (pulse, particles, etc.)
  CAMERA = 'camera',        // Camera movements
  PHYSICS = 'physics',      // Physics simulation adjustments
  SYSTEM = 'system'         // System-level animations
}

// Animation priority levels
export enum AnimationPriority {
  CRITICAL = 3,    // Must run every frame (e.g., user interaction feedback)
  HIGH = 2,        // Should run most frames (e.g., primary visual elements)
  MEDIUM = 1,      // Can skip frames under load (e.g., secondary animations)
  LOW = 0          // Can run infrequently (e.g., background effects)
}

// Animation ID type (for unique identification)
export type AnimationId = string;

// Animation callback type
export type AnimationCallback = (
  time: number,
  deltaTime: number,
  scene: THREE.Scene | null
) => void;

// Animation registration options
export interface AnimationOptions {
  subsystem: AnimationSubsystem;
  category: AnimationCategory;
  priority: AnimationPriority;
  updateInterval?: number;  // Minimum time between updates in ms (0 = every frame)
  enabled?: boolean;        // Whether the animation starts enabled
  name?: string;            // Human-readable name for debugging
}

// Animation state
interface AnimationState {
  id: AnimationId;
  subsystem: AnimationSubsystem;
  category: AnimationCategory;
  priority: AnimationPriority;
  enabled: boolean;
  lastUpdateTime: number;
  updateInterval: number;
  callback: AnimationCallback;
  name: string;
}

// Performance metrics
interface PerformanceMetrics {
  frameRates: number[];
  frameTimes: number[];
  animationTimes: Map<AnimationId, number[]>;
  averageFrameRate: number;
  averageFrameTime: number;
  lastFpsUpdateTime: number;
  displayFps: number;
}

/**
 * Animation Manager Class
 *
 * Provides centralized management of all animations in the system.
 * Handles registration, prioritization, and performance optimization.
 */
class AnimationManager {
  // Animation registry
  private animations: Map<AnimationId, AnimationState> = new Map();

  // Cached animations array to avoid recreating it on every frame
  private cachedAnimations: AnimationState[] = [];
  private animationsCacheValid: boolean = false;

  // Cached frame count masks for efficient modulo operations
  private readonly FRAME_MASK_2 = 0x1;  // frameCount % 2 === 0 is equivalent to (frameCount & FRAME_MASK_2) === 0
  private readonly FRAME_MASK_4 = 0x3;  // frameCount % 4 === 0 is equivalent to (frameCount & FRAME_MASK_4) === 0
  private readonly FRAME_MASK_8 = 0x7;  // frameCount % 8 === 0 is equivalent to (frameCount & FRAME_MASK_8) === 0

  /**
   * Constructor
   */
  constructor() {
    console.log('[AnimationManager] Created');
  }

  // Scene reference
  private scene: THREE.Scene | null = null;

  // Animation loop state
  private isRunning: boolean = false;
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private frameCount: number = 0;

  // Performance monitoring
  private performanceMetrics: PerformanceMetrics = {
    frameRates: [],
    frameTimes: [],
    animationTimes: new Map(),
    averageFrameRate: 60,
    averageFrameTime: 16.67,
    lastFpsUpdateTime: 0,
    displayFps: 60
  };

  // Performance mode
  private performanceMode: 'high' | 'balanced' | 'low' = 'balanced';

  // Debug mode
  private debugMode: boolean = false;

  /**
   * Register an animation with the manager
   * @param callback Animation callback function
   * @param options Animation options
   * @returns Animation ID for later reference
   */
  registerAnimation(
    callback: AnimationCallback,
    options: AnimationOptions
  ): AnimationId {
    // Generate a unique ID
    const id = `${options.subsystem}-${options.category}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    // Create animation state
    const animationState: AnimationState = {
      id,
      subsystem: options.subsystem,
      category: options.category,
      priority: options.priority,
      enabled: options.enabled ?? true,
      lastUpdateTime: 0,
      updateInterval: options.updateInterval ?? 0,
      callback,
      name: options.name ?? `${AnimationSubsystem[options.subsystem]}-${options.category}`
    };

    // Register the animation
    this.animations.set(id, animationState);

    // Initialize performance metrics for this animation
    this.performanceMetrics.animationTimes.set(id, []);

    // Invalidate the animations cache
    this.animationsCacheValid = false;

    if (this.debugMode) {
      console.log(`[AnimationManager] Registered animation: ${animationState.name} (${id})`);
    }

    return id;
  }

  /**
   * Unregister an animation
   * @param id Animation ID
   */
  unregisterAnimation(id: AnimationId): void {
    if (this.animations.has(id)) {
      const animation = this.animations.get(id)!;

      if (this.debugMode) {
        console.log(`[AnimationManager] Unregistered animation: ${animation.name} (${id})`);
      }

      this.animations.delete(id);
      this.performanceMetrics.animationTimes.delete(id);

      // Invalidate the animations cache
      this.animationsCacheValid = false;
    }
  }

  /**
   * Enable or disable an animation
   * @param id Animation ID
   * @param enabled Whether the animation should be enabled
   */
  setAnimationEnabled(id: AnimationId, enabled: boolean): void {
    const animation = this.animations.get(id);
    if (animation) {
      animation.enabled = enabled;

      if (this.debugMode) {
        console.log(`[AnimationManager] ${enabled ? 'Enabled' : 'Disabled'} animation: ${animation.name} (${id})`);
      }
    }
  }

  /**
   * Enable or disable all animations in a category
   * @param category Animation category
   * @param enabled Whether the animations should be enabled
   */
  setAnimationCategoryEnabled(category: AnimationCategory, enabled: boolean): void {
    for (const animation of this.animations.values()) {
      if (animation.category === category) {
        animation.enabled = enabled;
      }
    }

    if (this.debugMode) {
      console.log(`[AnimationManager] ${enabled ? 'Enabled' : 'Disabled'} all animations in category: ${category}`);
    }
  }

  /**
   * Enable or disable all animations in a subsystem
   * @param subsystem Animation subsystem
   * @param enabled Whether the animations should be enabled
   */
  setAnimationSubsystemEnabled(subsystem: AnimationSubsystem, enabled: boolean): void {
    for (const animation of this.animations.values()) {
      if (animation.subsystem === subsystem) {
        animation.enabled = enabled;
      }
    }

    if (this.debugMode) {
      console.log(`[AnimationManager] ${enabled ? 'Enabled' : 'Disabled'} all animations in subsystem: ${AnimationSubsystem[subsystem]}`);
    }
  }

  /**
   * Set the scene to use for animations
   * @param scene THREE.js scene
   */
  setScene(scene: THREE.Scene | null): void {
    this.scene = scene;

    if (this.debugMode) {
      console.log(`[AnimationManager] Set scene: ${scene ? 'provided' : 'null'}`);
    }
  }

  /**
   * Set the performance mode
   * @param mode Performance mode ('high', 'balanced', or 'low')
   */
  setPerformanceMode(mode: 'high' | 'balanced' | 'low'): void {
    // Only update and log if the mode actually changed
    if (this.performanceMode !== mode) {
      this.performanceMode = mode;

      if (this.debugMode) {
        console.log(`[AnimationManager] Set performance mode: ${mode}`);
      }
    }
  }

  /**
   * Set debug mode
   * @param enabled Whether debug mode should be enabled
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
    console.log(`[AnimationManager] ${enabled ? 'Enabled' : 'Disabled'} debug mode`);
  }

  /**
   * Start the animation loop
   */
  start(): void {
    if (this.isRunning) {
      console.log('[AnimationManager] Animation loop already running');
      return;
    }

    this.isRunning = true;
    this.lastFrameTime = performance.now();

    // Use a direct call to start the animation loop
    console.log('[AnimationManager] Starting animation loop');
    this.animationLoop();
  }

  /**
   * Stop the animation loop
   */
  stop(): void {
    // Only stop if already running
    if (!this.isRunning) return;

    console.log('[AnimationManager] Stopping animation loop');
    this.isRunning = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Get performance metrics
   * @returns Current performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  /**
   * Get current FPS (frames per second)
   * @returns Current FPS as a rounded integer
   */
  getFPS(): number {
    return this.performanceMetrics.displayFps;
  }

  /**
   * Check if the animation loop is running
   * @returns True if the animation loop is running
   */
  getIsRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Check if the animation manager is initialized
   * @returns Always returns true since we're using a factory pattern
   */
  isInitialized(): boolean {
    return true;
  }

  /**
   * The main animation loop
   */
  private animationLoop(): void {
    if (!this.isRunning) return;

    const now = performance.now();
    const deltaTime = now - this.lastFrameTime;
    this.lastFrameTime = now;

    // Increment frame count
    this.frameCount++;

    // Only update performance metrics occasionally to reduce overhead
    if (this.frameCount % 60 === 0) {
      this.updatePerformanceMetrics(deltaTime);
    }

    // Run animations based on priority, performance mode, and frame rate
    this.runAnimations(now, deltaTime);

    // Request the next frame - use a simple arrow function to avoid binding issues
    this.animationFrameId = requestAnimationFrame(() => this.animationLoop());
  }

  /**
   * Update performance metrics
   * @param deltaTime Time since last frame
   */
  private updatePerformanceMetrics(deltaTime: number): void {
    // Calculate frame rate
    const fps = 1000 / deltaTime;
    const now = performance.now();

    // Update frame rate history
    this.performanceMetrics.frameRates.push(fps);
    if (this.performanceMetrics.frameRates.length > 60) {
      this.performanceMetrics.frameRates.shift();
    }

    // Update frame time history
    this.performanceMetrics.frameTimes.push(deltaTime);
    if (this.performanceMetrics.frameTimes.length > 60) {
      this.performanceMetrics.frameTimes.shift();
    }

    // Calculate averages
    this.performanceMetrics.averageFrameRate = this.performanceMetrics.frameRates.reduce((sum, fps) => sum + fps, 0) /
      this.performanceMetrics.frameRates.length;

    this.performanceMetrics.averageFrameTime = this.performanceMetrics.frameTimes.reduce((sum, time) => sum + time, 0) /
      this.performanceMetrics.frameTimes.length;

    // Update display FPS once per second (reduces overhead)
    if (now - this.performanceMetrics.lastFpsUpdateTime > 1000) {
      this.performanceMetrics.displayFps = Math.round(this.performanceMetrics.averageFrameRate);
      this.performanceMetrics.lastFpsUpdateTime = now;
    }
  }

  /**
   * Run animations based on priority, performance mode, and frame rate
   * @param now Current time
   * @param deltaTime Time since last frame
   */
  private runAnimations(now: number, deltaTime: number): void {
    // Use cached animations array if valid, otherwise rebuild it
    if (!this.animationsCacheValid) {
      this.cachedAnimations = Array.from(this.animations.values());
      this.animationsCacheValid = true;
    }

    // In high performance mode, run all animations that are due
    if (this.performanceMode === 'high') {
      for (const animation of this.cachedAnimations) {
        if (!animation.enabled) continue;

        // Check if it's time to update this animation based on its interval
        const timeSinceLastUpdate = now - animation.lastUpdateTime;
        if (timeSinceLastUpdate < animation.updateInterval) continue;

        try {
          animation.callback(now, deltaTime, this.scene);
        } catch (error) {
          // Only log errors in debug mode
          if (this.debugMode) {
            console.error(`[AnimationManager] Error in animation ${animation.name}:`, error);
          }
        }

        // Update last update time without performance metrics overhead
        animation.lastUpdateTime = now;
      }
      return;
    }

    // For balanced and low performance modes, we'll be more selective
    // Determine which animations to run based on performance mode
    for (const animation of this.cachedAnimations) {
      if (!animation.enabled) continue;

      // Check if it's time to update this animation based on its interval
      const timeSinceLastUpdate = now - animation.lastUpdateTime;
      if (timeSinceLastUpdate < animation.updateInterval) continue;

      // Determine if we should run this animation based on priority and performance mode
      let shouldRun = true;

      if (this.performanceMode === 'low') {
        // In low performance mode, only run critical animations every frame
        // Run high priority every other frame
        // Run medium priority every 4th frame
        // Run low priority every 8th frame
        switch (animation.priority) {
          case AnimationPriority.CRITICAL:
            shouldRun = true;
            break;
          case AnimationPriority.HIGH:
            // Use bitwise AND instead of modulo for better performance
            shouldRun = (this.frameCount & this.FRAME_MASK_2) === 0;
            break;
          case AnimationPriority.MEDIUM:
            shouldRun = (this.frameCount & this.FRAME_MASK_4) === 0;
            break;
          case AnimationPriority.LOW:
            shouldRun = (this.frameCount & this.FRAME_MASK_8) === 0;
            break;
        }
      } else { // balanced mode
        // In balanced performance mode, run critical and high every frame
        // Run medium every other frame
        // Run low every 4th frame
        switch (animation.priority) {
          case AnimationPriority.CRITICAL:
          case AnimationPriority.HIGH:
            shouldRun = true;
            break;
          case AnimationPriority.MEDIUM:
            // Use bitwise AND instead of modulo for better performance
            shouldRun = (this.frameCount & this.FRAME_MASK_2) === 0;
            break;
          case AnimationPriority.LOW:
            shouldRun = (this.frameCount & this.FRAME_MASK_4) === 0;
            break;
        }
      }

      if (shouldRun) {
        try {
          animation.callback(now, deltaTime, this.scene);
        } catch (error) {
          // Only log errors in debug mode
          if (this.debugMode) {
            console.error(`[AnimationManager] Error in animation ${animation.name}:`, error);
          }
        }

        // Update last update time
        animation.lastUpdateTime = now;
      }
    }
  }
}

// Use a factory pattern instead of creating the instance immediately
// This allows us to control when the instance is created
let instance: AnimationManager | null = null;

export function getAnimationManager(): AnimationManager {
  if (!instance) {
    console.log('[AnimationManager] Creating singleton instance');
    instance = new AnimationManager();
  }
  return instance;
}
