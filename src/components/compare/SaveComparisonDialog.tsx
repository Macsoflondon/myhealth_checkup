import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SaveComparisonDialogProps {
  onSave: (name: string, notes?: string) => Promise<any>;
  disabled?: boolean;
  testCount: number;
}

export function SaveComparisonDialog({ onSave, disabled, testCount }: SaveComparisonDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    
    setIsSaving(true);
    try {
      const result = await onSave(name.trim(), notes.trim() || undefined);
      if (result) {
        setOpen(false);
        setName('');
        setNotes('');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          disabled={disabled || testCount < 2}
          className="gap-2"
        >
          <Bookmark className="w-4 h-4" />
          Save Comparison
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-heading">Save Comparison</DialogTitle>
          <DialogDescription>
            Save this comparison of {testCount} tests to access it later from your dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Comparison Name</Label>
            <Input
              id="name"
              placeholder="e.g., Full Body Health Check Options"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this comparison..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!name.trim() || isSaving}
            className="bg-[#e70d69] hover:bg-[#e70d69]/90"
          >
            {isSaving ? 'Saving...' : 'Save Comparison'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
