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
import AreasActionSelect from "@/components/areas/create/areasActionSelect";
import AreasReactionSelect from "@/components/areas/create/areasReactionSelect";

type ActionItem = { id: number; left: string | null; right: string | null };
type ReactionItem = { id: number; left: string | null; right: string | null };

export default function AreasCreationDialog() {
    const [name, setName] = React.useState("");

    const [actions, setActions] = React.useState<ActionItem[]>([
        { id: 1, left: null, right: null },
    ]);

    const [reactions, setReactions] = React.useState<ReactionItem[]>([
        { id: 1, left: null, right: null },
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
            return [...prev, { id: nextId, left: null, right: null }];
        });
    };
    const removeReaction = (id: number) => {
        setReactions(prev => prev.filter(r => r.id !== id));
    };
    const setReactionLeft = (id: number, v: string) => {
        setReactions(prev => prev.map(r => (r.id === id ? { ...r, left: v } : r)));
    };
    const setReactionRight = (id: number, v: string) => {
        setReactions(prev => prev.map(r => (r.id === id ? { ...r, right: v } : r)));
    };

    const [actionsParams, setActionsParams] = React.useState<Record<number, Record<string, string>>>({});
    const [reactionsParams, setReactionsParams] = React.useState<Record<number, Record<string, string>>>({});


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Name:", name);
        console.log("Actions:", actions.map(a => ({
            left: a.left,
            right: a.right,
            params: actionsParams[a.id] ?? {}
        })));
        console.log("Reactions:", reactions.map(r => ({
            left: r.left,
            right: r.right,
            params: reactionsParams[r.id] ?? {}
        })));
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

                    {/* Actions */}
                    <div className="space-y-3">
                        {actions.map(a => (
                            <AreasActionSelect
                                key={a.id}
                                leftValue={a.left ?? undefined}
                                onLeftChange={v => setActionLeft(a.id, v)}
                                rightValue={a.right ?? undefined}
                                onRightChange={v => setActionRight(a.id, v)}
                                onParamsChange={params => setActionsParams(prev => ({ ...prev, [a.id]: params }))}
                            />
                        ))}
                    </div>

                    <br />

                    {/* Reactions */}
                    <div className="space-y-3">
                        {reactions.map(r => (
                            <AreasReactionSelect
                                key={r.id}
                                leftValue={r.left ?? undefined}
                                onLeftChange={v => setReactionLeft(r.id, v)}
                                rightValue={r.right ?? undefined}
                                onRightChange={v => setReactionRight(r.id, v)}
                                onParamsChange={params => setReactionsParams(prev => ({ ...prev, [r.id]: params }))}
                            />
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
