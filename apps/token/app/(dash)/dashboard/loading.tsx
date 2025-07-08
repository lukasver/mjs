import { HeaderLoading } from '@/components/skeletons/header-loading';
import { SidebarLoading } from '@/components/skeletons/sidebar-loading';
import { FundraisingProgressLoading } from '@/components/skeletons/fundraising-progress-loading';
import { MetricCardsLoading } from '@/components/skeletons/metric-cards-loading';
import { LargeCardsLoading } from '@/components/skeletons/large-cards-loading';
import { BottomSectionsLoading } from '@/components/skeletons/bottom-sections-loading';

function Loading() {
  return (
    <div className='min-h-screen bg-background'>
      <HeaderLoading />

      <div className='flex'>
        <SidebarLoading />

        <div className='flex-1 p-8 space-y-8'>
          <FundraisingProgressLoading />
          <MetricCardsLoading />
          <LargeCardsLoading />
          <BottomSectionsLoading />
        </div>
      </div>
    </div>
  );
}

export default Loading;
