/**
 * Link Pulse Animation Utilities
 *
 * Bimba Tech Architecture Alignment:
 * - #5-3-2-1 (Harmonic Layer - Utils)
 *
 * This file contains functions for creating a pulse animation that modulates
 * the opacity of links in both 2D and 3D graph visualizations, creating a flashing effect
 * that enhances the visibility of connections.
 */

// Pulse animation state
interface LinkPulseState {
  active: boolean;           // Whether the pulse animation is active
  startTime: number;         // Animation start timestamp
  cycleDuration: number;     // Duration of a complete pulse cycle in ms
  minPulseFactor: number;    // Minimum opacity factor
  maxPulseFactor: number;    // Maximum opacity factor
  pulseSpeed: number;        // Speed of the pulse animation
  currentPulseFactor: number; // Current pulse factor
}

// Global pulse animation state
const pulseState: LinkPulseState = {
  active: false,
  startTime: 0,
  cycleDuration: 2500,      // 2.5 seconds for a complete cycle (was 5 seconds)
  minPulseFactor: 0.3,      // Minimum opacity factor
  maxPulseFactor: 3.0,      // Increased maximum opacity factor (was 2.5)
  pulseSpeed: 0.2,          // Adjusted pulse speed (was 0.15)
  currentPulseFactor: 1.0   // Default pulse factor
};

/**
 * Start the link pulse animation
 */
export function startLinkPulse(): void {
  pulseState.active = true;
  pulseState.startTime = Date.now();
}

/**
 * Stop the link pulse animation
 */
export function stopLinkPulse(): void {
  pulseState.active = false;
}

/**
 * Set the speed of the link pulse animation
 * @param speed - Speed multiplier (1.0 is normal speed)
 */
export function setLinkPulseSpeed(speed: number): void {
  pulseState.pulseSpeed = Math.max(0.1, Math.min(2.0, speed));
}

/**
 * Set the pulse range
 * @param min - Minimum opacity factor
 * @param max - Maximum opacity factor
 */
export function setLinkPulseRange(min: number, max: number): void {
  pulseState.minPulseFactor = Math.max(0.1, Math.min(0.9, min));
  pulseState.maxPulseFactor = Math.max(1.0, Math.min(3.0, max));
}

/**
 * Calculate the current pulse factor
 * @returns The current pulse factor
 */
export function calculatePulseFactor(): number {
  if (!pulseState.active) {
    return 1.0; // Default factor when not active
  }

  // Calculate pulse factor based on time
  const time = Date.now();

  // Use a sawtooth wave pattern instead of sine wave
  // This creates a slow rise and quick fall pattern
  const normalizedTime = (time * 0.0005 * pulseState.pulseSpeed) % 1.0;

  // Apply logarithmic scaling to spend more time at lower opacity
  // and quickly rise to a flash before dropping back down
  let pulseFactor: number;

  // COMPLETELY REWRITTEN: Create a more natural pulse that comes on strong and tapers off gently
  // Use a different approach with a quick rise and long, gentle decay

  // Divide the cycle into rise (4%) and decay (96%) phases
  if (normalizedTime < 0.04) {
    // Rise phase (0-4% of cycle) - very quick, strong rise
    const riseProgress = normalizedTime / 0.04; // 0 to 1 during rise

    // Use a cubic ease-in curve for a natural acceleration
    // This creates a curve that starts slow and accelerates
    const riseCurve = Math.pow(riseProgress, 2); // Quadratic curve for natural acceleration

    // Map the rise curve to our opacity range
    pulseFactor = pulseState.minPulseFactor + riseCurve * (pulseState.maxPulseFactor - pulseState.minPulseFactor);
  } else {
    // Decay phase (4-100% of cycle) - very long, gentle decay
    const decayProgress = (normalizedTime - 0.04) / 0.96; // 0 to 1 during decay

    // Use an exponential decay curve for a natural, gradual fade
    // e^(-kt) where k controls the decay rate
    const decayRate = 2.0; // Controls how quickly the pulse fades
    const decayCurve = Math.exp(-decayRate * decayProgress);

    // Map the decay curve to our opacity range, starting from max and decaying to min
    pulseFactor = pulseState.minPulseFactor + decayCurve * (pulseState.maxPulseFactor - pulseState.minPulseFactor);
  }

  // Update the current pulse factor
  pulseState.currentPulseFactor = pulseFactor;

  return pulseFactor;
}

/**
 * Get the current pulse factor
 * @returns The current pulse factor
 */
export function getPulseFactor(): number {
  return pulseState.currentPulseFactor;
}

/**
 * Apply pulsation to a color string (RGB or RGBA)
 * @param color - The original color string (RGB or RGBA)
 * @param customPulseFactor - Optional custom pulse factor to apply
 * @returns The pulsated RGBA color string
 */
export function applyPulsationToColor(color: string, customPulseFactor?: number): string {
  // Use custom pulsation factor if provided, otherwise use the current pulse factor
  const factor = customPulseFactor !== undefined ? customPulseFactor : pulseState.currentPulseFactor;

  // Parse the color string
  let r = 255, g = 255, b = 255, baseOpacity = 0.5;

  // Check if it's an RGBA color
  const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
  if (rgbaMatch) {
    r = parseInt(rgbaMatch[1], 10);
    g = parseInt(rgbaMatch[2], 10);
    b = parseInt(rgbaMatch[3], 10);
    baseOpacity = parseFloat(rgbaMatch[4]);
  } else {
    // Check if it's an RGB color
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      r = parseInt(rgbMatch[1], 10);
      g = parseInt(rgbMatch[2], 10);
      b = parseInt(rgbMatch[3], 10);
    } else {
      // Check if it's a hex color
      const hexMatch = color.match(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
      if (hexMatch) {
        r = parseInt(hexMatch[1], 16);
        g = parseInt(hexMatch[2], 16);
        b = parseInt(hexMatch[3], 16);
      } else {
        // Return original color if we can't parse it
        return color;
      }
    }
  }

  // Apply pulsation factor to opacity
  const opacity = Math.min(1.0, Math.max(0.1, baseOpacity * factor));

  // Brighten the color slightly for the pulse effect
  const brightnessBoost = Math.max(0, factor - 1.0) * 50; // Up to 50 points brighter at max pulse
  const adjustedR = Math.min(255, r + brightnessBoost);
  const adjustedG = Math.min(255, g + brightnessBoost);
  const adjustedB = Math.min(255, b + brightnessBoost);

  // Return the new RGBA color string
  return `rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, ${opacity})`;
}

/**
 * Create a pulse animation function that can be used with requestAnimationFrame
 * @param onPulse - Callback function to be called on each pulse update
 * @returns Animation function that can be passed to requestAnimationFrame
 */
export function createPulseAnimation(onPulse: (pulseFactor: number) => void): () => void {
  // Start the pulse animation
  startLinkPulse();

  // Animation function
  const animate = () => {
    if (!pulseState.active) return;

    // Calculate the current pulse factor
    const pulseFactor = calculatePulseFactor();

    // Call the callback function
    onPulse(pulseFactor);

    // Continue animation
    requestAnimationFrame(animate);
  };

  return animate;
}
