/**
 * Save Button
 *
 * Ghost button floating top-right. Comfort feature for the 18% who need it.
 * Auto-save happens after every why commit; this triggers explicit output generation.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { tokenKeys } from '../../lib/query';

export function SaveButton() {
  const queryClient = useQueryClient();
  const [pulse, setPulse] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/save/all', { method: 'POST' });
      if (!response.ok) throw new Error('Save failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tokenKeys.all });
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    },
  });

  const handleSave = useCallback(() => {
    saveMutation.mutate();
  }, [saveMutation]);

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={saveMutation.isPending}
      className={[
        'fixed top-4 right-4 z-50',
        'rounded-lg px-4 py-2',
        'text-sm text-neutral-400',
        'transition-colors',
        'hover:bg-neutral-100 hover:text-neutral-600',
        'disabled:opacity-50',
        pulse ? 'animate-pulse text-neutral-600' : '',
      ].join(' ')}
    >
      {saveMutation.isPending ? 'Saving...' : 'Save'}
    </button>
  );
}
