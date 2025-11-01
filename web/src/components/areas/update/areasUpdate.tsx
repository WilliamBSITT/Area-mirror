"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, X, PencilLine } from "lucide-react";
import AreasActionSelect from "@/components/areas/update/areasActionSelect";
import AreasReactionSelect from "@/components/areas/update/areasReactionSelect";
import { usePutArea } from "@/hooks/areas/useUpdateAreas";
import { useAreaDetails } from "@/hooks/areas/useAreasDetails";
import { Checkbox } from "@/components/ui/checkbox";

type ActionItem = { id: number; left: string | null; right: string | null };
type ReactionItem = { id: number; left: string | null; right: string | null };

interface AreasUpdateDialogProps {
    areaId: string | number;
    onCreated?: () => void;
}

const secondsToTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export function AreasUpdateDialog({ areaId, onCreated }: AreasUpdateDialogProps) {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState("");
    const [frequency, setFrequency] = React.useState("01:30");
    const [isPublic, setIsPublic] = React.useState(false);
    const { putArea, loading, error, data } = usePutArea();
    const { fetchArea, loading: loadingArea } = useAreaDetails();
    const router = useRouter();

    const [actions, setActions] = React.useState<ActionItem[]>([
        { id: 1, left: null, right: null },
    ]);

    const [reactions, setReactions] = React.useState<ReactionItem[]>([
        { id: 1, left: null, right: null },
    ]);

    const [showExtras, setShowExtras] = React.useState(false);

    const [actionsParams, setActionsParams] = React.useState<Record<number, Record<string, string>>>({});
    const [reactionsParams, setReactionsParams] = React.useState<Record<number, Record<string, string>>>({});

    const actionsParamsRef = React.useRef(actionsParams);
    const reactionsParamsRef = React.useRef(reactionsParams);

    React.useEffect(() => {
        actionsParamsRef.current = actionsParams;
    }, [actionsParams]);

    React.useEffect(() => {
        reactionsParamsRef.current = reactionsParams;
    }, [reactionsParams]);

    React.useEffect(() => {
        if (open && areaId) {
            setActions([{ id: 1, left: null, right: null }]);
            setReactions([{ id: 1, left: null, right: null }]);

            const loadAreaData = async () => {
                try {
                    const areaData = await fetchArea(areaId.toString());

                    setName(areaData.name || "");
                    const frequencyFormatted = secondsToTime(areaData.frequency || 3600);
                    setFrequency(frequencyFormatted);
                    setIsPublic(areaData.public || false);

                    setTimeout(() => {
                        if (areaData.action_service && areaData.action) {
                            const actionItem = {
                                id: 1,
                                left: areaData.action_service,
                                right: areaData.action
                            };
                            setActions([actionItem]);

                            if (areaData.params && typeof areaData.params === 'object') {
                                setActionsParams({ 1: areaData.params });
                            }
                        }

                        if (areaData.reaction_service && areaData.reaction) {
                            const reactionItem = {
                                id: 1,
                                left: areaData.reaction_service,
                                right: areaData.reaction,
                            };
                            setReactions([reactionItem]);

                            if (areaData.params && typeof areaData.params === 'object') {
                                setReactionsParams({ 1: areaData.params });
                            }
                        }
                    }, 100);


                } catch (error) {
                    console.error("Erreur:", error);
                }
            };
            loadAreaData();
        }
    }, [open, areaId, fetchArea]);

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

    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            router.refresh();
        }
    };

    const timeToSeconds = (timeString: string): number => {
        const parts = timeString.split(':');
        const hours = parseInt(parts[0], 10) || 0;
        const minutes = parseInt(parts[1], 10) || 0;
        return hours * 3600 + minutes * 60;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name.trim()) {
            setErrorMsg("Le nom est obligatoire.");
            return;
        }

        const frequencyInSeconds = timeToSeconds(frequency);

        try {
            for (const a of actions) {
                for (const r of reactions) {
                    const actionParams = actionsParamsRef.current[a.id] || {};
                    const reactionParams = reactionsParamsRef.current[r.id] || {};

                    const combinedParams = {
                        ...actionParams,
                        ...reactionParams,
                    };

                    const payload = {
                        action: a.right ?? "",
                        action_service: a.left ?? "",
                        frequency: frequencyInSeconds,
                        name,
                        params: combinedParams,
                        reaction: r.right ?? "",
                        reaction_service: r.left ?? "",
                        public: isPublic,
                    };

                    await putArea(areaId, payload);
                }
            }
            setErrorMsg(null);
            setOpen(false);
            if (onCreated) onCreated();
            setTimeout(() => router.refresh(), 300);
        } catch (err: any) {
            console.error("Erreur :", err);
            setErrorMsg(err.message);
            setErrorMsg(err.message || "Une erreur s'est produite lors de la mise à jour.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open update dialog">
                    <PencilLine/>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[700px] h-[70vh] overflow-y-auto overflow-x-hidden">
                <DialogHeader>
                    <DialogTitle>Edit Workflow</DialogTitle>
                    <DialogDescription>
                        Update your workflow here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>

                {loadingArea ? (
                    <div className="flex items-center justify-center p-8">
                        <p>Chargement...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <section className="grid md:grid-cols-2">
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Name</Label>
                                    <Input
                                        id="name-1"
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="px-2 md:px-3"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 px-14">
                                <br/>
                                <Label htmlFor="time-picker" className="px-1">
                                    Frequency
                                </Label>
                                <Input
                                    type="text"
                                    id="time-picker"
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value)}
                                    placeholder="HH:MM"
                                    pattern="^([0-1][0-9]|2[0-3]):[0-5][0-9]$"
                                    className="bg-background w-35"
                                />
                            </div>
                        </section>

                        <br />
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={isPublic}
                                onCheckedChange={(checked) => setIsPublic(checked as boolean)}
                            />
                            <label className="max-w-lg">Public Workflow</label>
                        </div>
                        <br/>

                        <div className="space-y-3">
                            {actions.map((a, idx) => (
                                <div key={a.id} className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <AreasActionSelect
                                            key={`action-${areaId}-${a.id}-${a.left}-${a.right}`}
                                            leftValue={a.left ?? undefined}
                                            onLeftChange={v => setActionLeft(a.id, v)}
                                            rightValue={a.right ?? undefined}
                                            onRightChange={v => setActionRight(a.id, v)}
                                            onParamsChange={params => setActionsParams(prev => ({ ...prev, [a.id]: params }))}
                                            initialParams={actionsParams[a.id]}
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
                                            key={`reaction-${areaId}-${r.id}-${r.left}-${r.right}`}
                                            leftValue={r.left ?? undefined}
                                            onLeftChange={v => setReactionLeft(r.id, v)}
                                            rightValue={r.right ?? undefined}
                                            onRightChange={v => setReactionRight(r.id, v)}
                                            onParamsChange={params => setReactionsParams(prev => ({ ...prev, [r.id]: params }))}
                                            initialParams={reactionsParams[r.id]}
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

                        {errorMsg && (
                            <p className="text-red-500 mt-2 text-sm text-center">{errorMsg}</p>
                        )}

                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
