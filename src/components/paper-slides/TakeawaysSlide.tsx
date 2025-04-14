
import React from 'react';
import { Card } from '../ui/card';
import { FormattedTakeaway } from '../../utils/takeawayParser';
import PaperCardTakeaways from '../PaperCardTakeaways';

interface TakeawaysSlideProps {
  takeaways: FormattedTakeaway[];
}

const TakeawaysSlide: React.FC<TakeawaysSlideProps> = ({ takeaways }) => {
  return (
    <Card className="w-full h-full overflow-y-auto p-6 bg-white">
      <PaperCardTakeaways takeaways={takeaways} />
    </Card>
  );
};

export default TakeawaysSlide;
