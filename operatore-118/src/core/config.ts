/**
 * Default configuration for call generation.
 */
export const CALL_GENERATOR_CONFIG = {
  /** Interval between call generation in simulation milliseconds */
  intervalMs: 2000,
  
  /** Probability weights for severity distribution */
  severityWeights: {
    stable: 0.5,   // 50% stable cases
    medium: 0.3,   // 30% medium cases
    critical: 0.2  // 20% critical cases
  }
} as const;
