import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Signal, Database, Clock, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DataSourceIndicatorProps {
  source: 'live' | 'cache' | 'database';
  timestamp?: Date | string;
  providerName: string;
  className?: string;
}

export const DataSourceIndicator = ({ 
  source, 
  timestamp, 
  providerName,
  className = '' 
}: DataSourceIndicatorProps) => {
  const getSourceConfig = () => {
    switch (source) {
      case 'live':
        return {
          icon: Signal,
          label: 'Live',
          color: 'bg-green-500/10 text-green-700 border-green-200',
          description: 'Data scraped directly from provider website',
        };
      case 'cache':
        return {
          icon: RefreshCw,
          label: 'Cached',
          color: 'bg-blue-500/10 text-blue-700 border-blue-200',
          description: 'Recent data from cache (updated within last hour)',
        };
      case 'database':
        return {
          icon: Database,
          label: 'Database',
          color: 'bg-muted text-muted-foreground border-border',
          description: 'Historical data from database',
        };
    }
  };

  const config = getSourceConfig();
  const Icon = config.icon;
  
  const formattedTime = timestamp 
    ? formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    : 'Unknown';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`${config.color} ${className} cursor-help`}
          >
            <Icon className="h-3 w-3 mr-1" />
            <span className="text-xs font-medium">{config.label}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold text-sm">{providerName} - {config.label} Data</p>
            <p className="text-xs text-muted-foreground">{config.description}</p>
            {timestamp && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1 border-t">
                <Clock className="h-3 w-3" />
                <span>Updated {formattedTime}</span>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
