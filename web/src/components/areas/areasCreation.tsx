"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusIcon, X } from "lucide-react"

import AreasActionSelect from "@/components/areas/areasActionSelect"
import AreasReactionSelect from "@/components/areas/areasReactionSelect"

export default function AreasCreationDialog() {
    const [showExtras, setShowExtras] = React.useState(false)

    // Actions dynamiques
    const [actions, setActions] = React.useState([{ id: 1 }])
    const addAction = () => {
        setActions(prev => {
            const maxId = prev.length ? Math.max(...prev.map(a => a.id)) : 0
            return [...prev, { id: maxId + 1 }]
        })
    }
    const removeAction = (id: number) => {
        setActions(prev => prev.filter(a => a.id !== id))
    }

    const [reactions, setReactions] = React.useState([{ id: 1 }])
    const addReaction = () => {
        setReactions(prev => {
            const maxId = prev.length ? Math.max(...prev.map(r => r.id)) : 0
            return [...prev, { id: maxId + 1 }]
        })
    }
    const removeReaction = (id: number) => {
        setReactions(prev => prev.filter(r => r.id !== id))
    }

    const toggleExtras = () => setShowExtras(v => !v)

    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon" aria-label="Submit">
                        <PlusIcon />
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Edit Workflows</DialogTitle>
                        <DialogDescription>
                            Create your workflow here. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Name</Label>
                            <Input id="name-1" name="name" />
                        </div>
                    </div>

                    <br />

                    <div className="space-y-3">
                        {actions.map((action, idx) => (
                            <div key={action.id} className="flex items-center gap-2">
                                <div className="flex-1">
                                    <AreasActionSelect />
                                </div>
                                {actions.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeAction(action.id)}
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
                        {reactions.map((reaction, idx) => (
                            <div key={reaction.id} className="flex items-center gap-2">
                                <div className="flex-1">
                                    <AreasReactionSelect />
                                </div>
                                {reactions.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeReaction(reaction.id)}
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
                            aria-label="Toggle extra actions"
                            aria-pressed={showExtras}
                            onClick={toggleExtras}
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

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
