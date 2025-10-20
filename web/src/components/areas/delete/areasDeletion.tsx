"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import * as React from "react";

type AreasDeletionDialogProps = {
    title?: string;
    description?: string;
    onConfirm: () => Promise<void> | void;
    children: React.ReactNode; // le trigger (ex: bouton trash)
};

export function AreasDeletionDialog({ title = "Delete Workflows",
                                        description = "Are you sure you want to delete this Workflow. Click Delete if you're sure, Cancel if it's a mistake.",
                                        onConfirm,
                                        children,
                                    }: AreasDeletionDialogProps) {
    const [busy, setBusy] = React.useState(false);

    const handleConfirm = async () => {
        if (busy) return;
        setBusy(true);
        try {
            await onConfirm();
        } finally {
            setBusy(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleConfirm} disabled={busy}>
                        {busy ? "Deleting…" : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
