"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, X } from "lucide-react";
import AreasActionSelect from "@/components/areas/areasActionSelect";
import AreasReactionSelect from "@/components/areas/areasReactionSelect";

type ActionItem = { id: number; left: string | null; right: string | null };
type ReactionItem = { id: number; value: string | null };

export default function AreasCreationDialog() {
    const [name, setName] = React.useState("");

    const [actions, setActions] = React.useState<ActionItem[]>([
        { id: 1, left: null, right: null },
    ]);

    const [reactions, setReactions] = React.useState<ReactionItem[]>([
        { id: 1, value: null },
    ]);

    const [showExtras, setShowExtras] = React.useState(false);

    const addAction = () => {
        setActions(prev => {
            const nextId = prev.length ? Math.max(...prev.map(a => a.id)) + 1 : 1;
            return [...prev, { id: nextId, left: null, right: null }];
        });
    };

    const removeAction = (id: number) => {
        setActions(prev => prev.filter(a => a.id !== id));
    };

    const setActionLeft = (id: number, v: string) => {
        setActions(prev => prev.map(a => (a.id === id ? { ...a, left: v } : a)));
    };

    const setActionRight = (id: number, v: string) => {
        setActions(prev => prev.map(a => (a.id === id ? { ...a, right: v } : a)));
    };

    const addReaction = () => {
        setReactions(prev => {
            const nextId = prev.length ? Math.max(...prev.map(r => r.id)) + 1 : 1;
            return [...prev, { id: nextId, value: null }];
        });
    };

    const removeReaction = (id: number) => {
        setReactions(prev => prev.filter(r => r.id !== id));
    };

    const setReactionValue = (id: number, v: string) => {
        setReactions(prev => prev.map(r => (r.id === id ? { ...r, value: v } : r)));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Name:", name);
        console.log("Actions:", actions.map(a => ({ left: a.left, right: a.right })));
        console.log("Reactions:", reactions.map(r => r.value));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open creation dialog">
                    <PlusIcon />
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[700px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Workflows</DialogTitle>
                        <DialogDescription>
                            Create your workflow here. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Name</Label>
                            <Input
                                id="name-1"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <br />

                    <div className="space-y-3">
                        {actions.map((a, idx) => (
                            <div key={a.id} className="flex items-center gap-2">
                                <div className="flex-1">
                                    <AreasActionSelect
                                        leftValue={a.left ?? undefined}
                                        onLeftChange={(v) => setActionLeft(a.id, v)}
                                        rightValue={a.right ?? undefined}
                                        onRightChange={(v) => setActionRight(a.id, v)}
                                    />
                                </div>
                                {actions.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeAction(a.id)}
                                        className="text-destructive hover:text-destructive"
                                        aria-label={`Remove action ${idx + 1}`}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <br />

                    <div className="space-y-3">
                        {reactions.map((r, idx) => (
                            <div key={r.id} className="flex items-center gap-2">
                                <div className="flex-1">
                                    <AreasReactionSelect
                                        value={r.value ?? undefined}
                                        onValueChange={(v: string) => setReactionValue(r.id, v)}
                                    />
                                </div>
                                {reactions.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeReaction(r.id)}
                                        className="text-destructive hover:text-destructive"
                                        aria-label={`Remove reaction ${idx + 1}`}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            aria-pressed={showExtras}
                            aria-label="Toggle extra actions"
                            onClick={() => setShowExtras(v => !v)}
                        >
                            <PlusIcon />
                        </Button>
                    </div>

                    {showExtras && (
                        <div className="mt-3 flex items-center gap-2">
                            <Button type="button" variant="outline" onClick={addAction}>
                                Add Action
                            </Button>
                            <Button type="button" variant="outline" onClick={addReaction}>
                                Add Reaction
                            </Button>
                        </div>
                    )}

                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
