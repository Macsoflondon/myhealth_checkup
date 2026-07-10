import React from 'react';
import { Trash2, Calendar, Tag, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { SavedComparison } from '@/types/comparison';
import { format } from 'date-fns';

interface SavedComparisonsListProps {
  comparisons: SavedComparison[];
  onLoad: (comparison: SavedComparison) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function SavedComparisonsList({ comparisons, onLoad, onDelete, isLoading }: SavedComparisonsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-muted rounded w-1/3 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (comparisons.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-heading font-semibold text-lg mb-2">No Saved Comparisons</h3>
          <p className="text-muted-foreground">
            Start comparing tests and save your comparisons to access them later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {comparisons.map(comparison => (
        <Card key={comparison.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="font-heading text-lg">{comparison.comparisonName}</CardTitle>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(comparison.createdAt), 'dd MMM yyyy')}
                  </span>
                  {comparison.category && (
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {comparison.category}
                    </span>
                  )}
                </div>
              </div>
              <Badge variant="secondary">
                {comparison.testIds.length} tests
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            {comparison.notes && (
              <p className="text-sm text-muted-foreground mb-4">{comparison.notes}</p>
            )}
            <div className="flex gap-2">
              <Button 
                variant="default" 
                size="sm"
                className="bg-[#e70d69] hover:bg-[#e70d69]/90"
                onClick={() => onLoad(comparison)}
              >
                Load Comparison
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Comparison?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete "{comparison.comparisonName}". This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDelete(comparison.id)}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
