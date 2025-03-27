
import React from 'react';
import { ArrowRight } from 'lucide-react';

type KeyTakeawayProps = {
  text: string;
};

const KeyTakeaway: React.FC<KeyTakeawayProps> = ({ text }) => {
  return (
    <div className="key-takeaway animate-fade-in">
      <span className="key-takeaway-icon">
        <ArrowRight size={16} />
      </span>
      <span className="key-takeaway-text">{text}</span>
    </div>
  );
};

export default KeyTakeaway;
