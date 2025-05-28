'use client';

import { useRouter } from '@/lib/i18n/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@mjs/ui/primitives/dialog';
import { useState } from 'react';

function ModalPage() {
  const [open, setOpen] = useState(true);
  const router = useRouter();
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      router.back();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ModalPage;
