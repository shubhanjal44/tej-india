import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Onboarding Service
 *
 * Manages user onboarding flow, tutorial progress, and feature discovery
 */

// Onboarding steps
export const ONBOARDING_STEPS = {
  WELCOME: 'welcome',
  PROFILE_SETUP: 'profile_setup',
  ADD_SKILLS: 'add_skills',
  DISCOVER_USERS: 'discover_users',
  FIRST_SWAP: 'first_swap',
  COMPLETE: 'complete',
} as const;

export type OnboardingStep = typeof ONBOARDING_STEPS[keyof typeof ONBOARDING_STEPS];

// Tutorial types
export const TUTORIAL_TYPES = {
  PROFILE: 'profile',
  SKILLS: 'skills',
  SEARCH: 'search',
  SWAP_REQUEST: 'swap_request',
  MESSAGING: 'messaging',
  REVIEWS: 'reviews',
  EVENTS: 'events',
  COMMUNITIES: 'communities',
  PREMIUM: 'premium',
} as const;

export type TutorialType = typeof TUTORIAL_TYPES[keyof typeof TUTORIAL_TYPES];

// Feature discovery items
export const FEATURES = {
  SKILL_RECOMMENDATIONS: 'skill_recommendations',
  USER_MATCHING: 'user_matching',
  EVENT_DISCOVERY: 'event_discovery',
  COMMUNITY_JOIN: 'community_join',
  PREMIUM_UPGRADE: 'premium_upgrade',
  PROFILE_BOOST: 'profile_boost',
  ADVANCED_SEARCH: 'advanced_search',
  ANALYTICS_DASHBOARD: 'analytics_dashboard',
} as const;

export type Feature = typeof FEATURES[keyof typeof FEATURES];

interface OnboardingProgress {
  userId: string;
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  isCompleted: boolean;
  startedAt: Date;
  completedAt?: Date;
  skippedSteps: OnboardingStep[];
}

interface TutorialProgress {
  userId: string;
  tutorialType: TutorialType;
  isCompleted: boolean;
  currentStep: number;
  totalSteps: number;
  startedAt: Date;
  completedAt?: Date;
}

interface FeatureDiscovery {
  userId: string;
  feature: Feature;
  isDiscovered: boolean;
  discoveredAt?: Date;
  isDismissed: boolean;
}

class OnboardingService {
  /**
   * Initialize onboarding for new user
   */
  async initializeOnboarding(userId: string): Promise<OnboardingProgress> {
    try {
      // Check if onboarding already exists
      const existing = await prisma.onboardingProgress.findUnique({
        where: { userId },
      });

      if (existing) {
        return existing as OnboardingProgress;
      }

      // Create new onboarding progress
      const onboarding = await prisma.onboardingProgress.create({
        data: {
          userId,
          currentStep: ONBOARDING_STEPS.WELCOME,
          completedSteps: [],
          isCompleted: false,
          startedAt: new Date(),
          skippedSteps: [],
        },
      });

      // Initialize feature discovery
      await this.initializeFeatureDiscovery(userId);

      return onboarding as OnboardingProgress;
    } catch (error) {
      console.error('Error initializing onboarding:', error);
      throw error;
    }
  }

  /**
   * Get onboarding progress for user
   */
  async getProgress(userId: string): Promise<OnboardingProgress | null> {
    try {
      const progress = await prisma.onboardingProgress.findUnique({
        where: { userId },
      });

      return progress as OnboardingProgress | null;
    } catch (error) {
      console.error('Error getting onboarding progress:', error);
      throw error;
    }
  }

  /**
   * Update onboarding step
   */
  async updateStep(
    userId: string,
    step: OnboardingStep,
    action: 'complete' | 'skip' = 'complete'
  ): Promise<OnboardingProgress> {
    try {
      const progress = await this.getProgress(userId);
      if (!progress) {
        throw new Error('Onboarding not initialized');
      }

      const steps = Object.values(ONBOARDING_STEPS);
      const currentStepIndex = steps.indexOf(step);
      const nextStep = steps[currentStepIndex + 1] || ONBOARDING_STEPS.COMPLETE;

      const completedSteps = action === 'complete'
        ? [...(progress.completedSteps || []), step]
        : progress.completedSteps || [];

      const skippedSteps = action === 'skip'
        ? [...(progress.skippedSteps || []), step]
        : progress.skippedSteps || [];

      const isCompleted = nextStep === ONBOARDING_STEPS.COMPLETE;

      const updated = await prisma.onboardingProgress.update({
        where: { userId },
        data: {
          currentStep: nextStep,
          completedSteps,
          skippedSteps,
          isCompleted,
          completedAt: isCompleted ? new Date() : undefined,
        },
      });

      return updated as OnboardingProgress;
    } catch (error) {
      console.error('Error updating onboarding step:', error);
      throw error;
    }
  }

  /**
   * Skip onboarding
   */
  async skipOnboarding(userId: string): Promise<OnboardingProgress> {
    try {
      const updated = await prisma.onboardingProgress.update({
        where: { userId },
        data: {
          currentStep: ONBOARDING_STEPS.COMPLETE,
          isCompleted: true,
          completedAt: new Date(),
        },
      });

      return updated as OnboardingProgress;
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      throw error;
    }
  }

  /**
   * Reset onboarding
   */
  async resetOnboarding(userId: string): Promise<OnboardingProgress> {
    try {
      const updated = await prisma.onboardingProgress.update({
        where: { userId },
        data: {
          currentStep: ONBOARDING_STEPS.WELCOME,
          completedSteps: [],
          skippedSteps: [],
          isCompleted: false,
          completedAt: null,
        },
      });

      return updated as OnboardingProgress;
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      throw error;
    }
  }

  /**
   * Start tutorial
   */
  async startTutorial(
    userId: string,
    tutorialType: TutorialType,
    totalSteps: number
  ): Promise<TutorialProgress> {
    try {
      const tutorial = await prisma.tutorialProgress.upsert({
        where: {
          userId_tutorialType: {
            userId,
            tutorialType,
          },
        },
        create: {
          userId,
          tutorialType,
          currentStep: 0,
          totalSteps,
          isCompleted: false,
          startedAt: new Date(),
        },
        update: {
          currentStep: 0,
          totalSteps,
          isCompleted: false,
          completedAt: null,
        },
      });

      return tutorial as TutorialProgress;
    } catch (error) {
      console.error('Error starting tutorial:', error);
      throw error;
    }
  }

  /**
   * Update tutorial progress
   */
  async updateTutorialProgress(
    userId: string,
    tutorialType: TutorialType,
    currentStep: number
  ): Promise<TutorialProgress> {
    try {
      const tutorial = await prisma.tutorialProgress.findUnique({
        where: {
          userId_tutorialType: {
            userId,
            tutorialType,
          },
        },
      });

      if (!tutorial) {
        throw new Error('Tutorial not started');
      }

      const isCompleted = currentStep >= tutorial.totalSteps;

      const updated = await prisma.tutorialProgress.update({
        where: {
          userId_tutorialType: {
            userId,
            tutorialType,
          },
        },
        data: {
          currentStep,
          isCompleted,
          completedAt: isCompleted ? new Date() : undefined,
        },
      });

      return updated as TutorialProgress;
    } catch (error) {
      console.error('Error updating tutorial progress:', error);
      throw error;
    }
  }

  /**
   * Get tutorial progress
   */
  async getTutorialProgress(
    userId: string,
    tutorialType: TutorialType
  ): Promise<TutorialProgress | null> {
    try {
      const tutorial = await prisma.tutorialProgress.findUnique({
        where: {
          userId_tutorialType: {
            userId,
            tutorialType,
          },
        },
      });

      return tutorial as TutorialProgress | null;
    } catch (error) {
      console.error('Error getting tutorial progress:', error);
      throw error;
    }
  }

  /**
   * Get all tutorials for user
   */
  async getAllTutorials(userId: string): Promise<TutorialProgress[]> {
    try {
      const tutorials = await prisma.tutorialProgress.findMany({
        where: { userId },
      });

      return tutorials as TutorialProgress[];
    } catch (error) {
      console.error('Error getting all tutorials:', error);
      throw error;
    }
  }

  /**
   * Complete tutorial
   */
  async completeTutorial(
    userId: string,
    tutorialType: TutorialType
  ): Promise<TutorialProgress> {
    try {
      const tutorial = await prisma.tutorialProgress.findUnique({
        where: {
          userId_tutorialType: {
            userId,
            tutorialType,
          },
        },
      });

      if (!tutorial) {
        throw new Error('Tutorial not found');
      }

      const updated = await prisma.tutorialProgress.update({
        where: {
          userId_tutorialType: {
            userId,
            tutorialType,
          },
        },
        data: {
          currentStep: tutorial.totalSteps,
          isCompleted: true,
          completedAt: new Date(),
        },
      });

      return updated as TutorialProgress;
    } catch (error) {
      console.error('Error completing tutorial:', error);
      throw error;
    }
  }

  /**
   * Initialize feature discovery for user
   */
  async initializeFeatureDiscovery(userId: string): Promise<void> {
    try {
      const features = Object.values(FEATURES);

      await prisma.featureDiscovery.createMany({
        data: features.map((feature) => ({
          userId,
          feature,
          isDiscovered: false,
          isDismissed: false,
        })),
        skipDuplicates: true,
      });
    } catch (error) {
      console.error('Error initializing feature discovery:', error);
      throw error;
    }
  }

  /**
   * Mark feature as discovered
   */
  async discoverFeature(userId: string, feature: Feature): Promise<FeatureDiscovery> {
    try {
      const discovered = await prisma.featureDiscovery.upsert({
        where: {
          userId_feature: {
            userId,
            feature,
          },
        },
        create: {
          userId,
          feature,
          isDiscovered: true,
          discoveredAt: new Date(),
          isDismissed: false,
        },
        update: {
          isDiscovered: true,
          discoveredAt: new Date(),
        },
      });

      return discovered as FeatureDiscovery;
    } catch (error) {
      console.error('Error discovering feature:', error);
      throw error;
    }
  }

  /**
   * Dismiss feature discovery
   */
  async dismissFeature(userId: string, feature: Feature): Promise<FeatureDiscovery> {
    try {
      const dismissed = await prisma.featureDiscovery.update({
        where: {
          userId_feature: {
            userId,
            feature,
          },
        },
        data: {
          isDismissed: true,
        },
      });

      return dismissed as FeatureDiscovery;
    } catch (error) {
      console.error('Error dismissing feature:', error);
      throw error;
    }
  }

  /**
   * Get undiscovered features
   */
  async getUndiscoveredFeatures(userId: string): Promise<FeatureDiscovery[]> {
    try {
      const features = await prisma.featureDiscovery.findMany({
        where: {
          userId,
          isDiscovered: false,
          isDismissed: false,
        },
      });

      return features as FeatureDiscovery[];
    } catch (error) {
      console.error('Error getting undiscovered features:', error);
      throw error;
    }
  }

  /**
   * Get onboarding stats
   */
  async getOnboardingStats(): Promise<{
    totalUsers: number;
    completedOnboarding: number;
    inProgress: number;
    completionRate: number;
    averageCompletionTime: number;
    stepCompletionRates: Record<OnboardingStep, number>;
  }> {
    try {
      const [total, completed, allProgress] = await Promise.all([
        prisma.onboardingProgress.count(),
        prisma.onboardingProgress.count({
          where: { isCompleted: true },
        }),
        prisma.onboardingProgress.findMany(),
      ]);

      const inProgress = total - completed;
      const completionRate = total > 0 ? (completed / total) * 100 : 0;

      // Calculate average completion time
      const completedWithTime = allProgress.filter(
        (p) => p.isCompleted && p.completedAt && p.startedAt
      );

      const averageCompletionTime =
        completedWithTime.length > 0
          ? completedWithTime.reduce((sum, p) => {
              const time = p.completedAt!.getTime() - p.startedAt.getTime();
              return sum + time;
            }, 0) / completedWithTime.length
          : 0;

      // Calculate step completion rates
      const stepCompletionRates: Record<string, number> = {};
      const steps = Object.values(ONBOARDING_STEPS);

      for (const step of steps) {
        const completedStep = allProgress.filter((p) =>
          (p.completedSteps || []).includes(step)
        ).length;
        stepCompletionRates[step] = total > 0 ? (completedStep / total) * 100 : 0;
      }

      return {
        totalUsers: total,
        completedOnboarding: completed,
        inProgress,
        completionRate,
        averageCompletionTime: averageCompletionTime / 1000 / 60, // Convert to minutes
        stepCompletionRates: stepCompletionRates as Record<OnboardingStep, number>,
      };
    } catch (error) {
      console.error('Error getting onboarding stats:', error);
      throw error;
    }
  }

  /**
   * Get tutorial stats
   */
  async getTutorialStats(): Promise<{
    totalTutorials: number;
    completedTutorials: number;
    completionRate: number;
    tutorialCompletionRates: Record<TutorialType, number>;
  }> {
    try {
      const [total, completed, allTutorials] = await Promise.all([
        prisma.tutorialProgress.count(),
        prisma.tutorialProgress.count({
          where: { isCompleted: true },
        }),
        prisma.tutorialProgress.findMany(),
      ]);

      const completionRate = total > 0 ? (completed / total) * 100 : 0;

      // Calculate tutorial-specific completion rates
      const tutorialCompletionRates: Record<string, number> = {};
      const types = Object.values(TUTORIAL_TYPES);

      for (const type of types) {
        const typeTotal = allTutorials.filter((t) => t.tutorialType === type).length;
        const typeCompleted = allTutorials.filter(
          (t) => t.tutorialType === type && t.isCompleted
        ).length;
        tutorialCompletionRates[type] =
          typeTotal > 0 ? (typeCompleted / typeTotal) * 100 : 0;
      }

      return {
        totalTutorials: total,
        completedTutorials: completed,
        completionRate,
        tutorialCompletionRates: tutorialCompletionRates as Record<TutorialType, number>,
      };
    } catch (error) {
      console.error('Error getting tutorial stats:', error);
      throw error;
    }
  }

  /**
   * Get feature discovery stats
   */
  async getFeatureDiscoveryStats(): Promise<{
    totalFeatures: number;
    discoveredFeatures: number;
    discoveryRate: number;
    featureDiscoveryRates: Record<Feature, number>;
  }> {
    try {
      const [total, discovered, allFeatures] = await Promise.all([
        prisma.featureDiscovery.count(),
        prisma.featureDiscovery.count({
          where: { isDiscovered: true },
        }),
        prisma.featureDiscovery.findMany(),
      ]);

      const discoveryRate = total > 0 ? (discovered / total) * 100 : 0;

      // Calculate feature-specific discovery rates
      const featureDiscoveryRates: Record<string, number> = {};
      const features = Object.values(FEATURES);

      for (const feature of features) {
        const featureTotal = allFeatures.filter((f) => f.feature === feature).length;
        const featureDiscovered = allFeatures.filter(
          (f) => f.feature === feature && f.isDiscovered
        ).length;
        featureDiscoveryRates[feature] =
          featureTotal > 0 ? (featureDiscovered / featureTotal) * 100 : 0;
      }

      return {
        totalFeatures: total,
        discoveredFeatures: discovered,
        discoveryRate,
        featureDiscoveryRates: featureDiscoveryRates as Record<Feature, number>,
      };
    } catch (error) {
      console.error('Error getting feature discovery stats:', error);
      throw error;
    }
  }
}

export default new OnboardingService();
