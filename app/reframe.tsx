import { SupportiveReframeScreen } from '@/components/reframe/supportive-reframe-screen';
import { useHomeDashboard } from '@/hooks/use-home-dashboard';

/**
 * Modal-style supportive reframing route shown after a slip-up on Track.
 */
export default function ReframeScreen() {
  const { streakDays } = useHomeDashboard();

  return <SupportiveReframeScreen streakDays={streakDays} />;
}
