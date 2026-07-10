import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Signal, Database, RefreshCw, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { CompareTestData } from '@/services/CompareService';

interface ProviderDataStatusProps {
  tests: CompareTestData[];
}

export const ProviderDataStatus = ({ tests }: ProviderDataStatusProps) => {
  const providerStats = useMemo(() => {
    const stats = new Map<string, {
      provider: string;
      dataSource: 'live' | 'cache' | 'database';
      lastUpdated?: string;
      testCount: number;
    }>();

    tests.forEach(test => {
      if (!stats.has(test.provider)) {
        stats.set(test.provider, {
          provider: test.provider,
          dataSource: test.dataSource || 'database',
          lastUpdated: test.lastUpdated,
          testCount: 1
        });
      } else {
        const existing = stats.get(test.provider)!;
        existing.testCount += 1;
      }
    });

    return Array.from(stats.values());
  }, [tests]);

  if (providerStats.length === 0) return null;

  const getSourceConfig = (source: 'live' | 'cache' | 'database') => {
    switch (source) {
      case 'live':
        return {
          icon: Signal,
          label: 'Live Data',
          color: 'bg-green-500/10 text-green-700 border-green-200',
        };
      case 'cache':
        return {
          icon: RefreshCw,
          label: 'Cached',
          color: 'bg-blue-500/10 text-blue-700 border-blue-200',
        };
      case 'database':
        return {
          icon: Database,
          label: 'Database',
          color: 'bg-muted text-muted-foreground border-border',
        };
    }
  };

  return (
    <Card className="mb-6 border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Data Freshness</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {providerStats.map(stat => {
            const config = getSourceConfig(stat.dataSource);
            const Icon = config.icon;
            const formattedTime = stat.lastUpdated 
              ? formatDistanceToNow(new Date(stat.lastUpdated), { addSuffix: true })
              : 'Unknown';

            return (
              <div 
                key={stat.provider}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md ${config.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{stat.provider}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.testCount} {stat.testCount === 1 ? 'test' : 'tests'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={`${config.color} text-xs mb-1`}>
                    {config.label}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {formattedTime}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
