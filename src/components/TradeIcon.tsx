import React from 'react';
import {
  Zap,
  Droplets,
  Hammer,
  Flame,
  Wind,
  Paintbrush,
  HardHat,
  ShieldCheck,
  Wrench,
} from 'lucide-react';

interface TradeIconProps {
  name: string;
  className?: string;
}

export const TradeIcon: React.FC<TradeIconProps> = ({ name, className = 'w-6 h-6' }) => {
  switch (name) {
    case 'Zap':
      return <Zap className={className} />;
    case 'Droplets':
      return <Droplets className={className} />;
    case 'Hammer':
      return <Hammer className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Wind':
      return <Wind className={className} />;
    case 'Paintbrush':
      return <Paintbrush className={className} />;
    case 'HardHat':
      return <HardHat className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    default:
      return <Wrench className={className} />;
  }
};
