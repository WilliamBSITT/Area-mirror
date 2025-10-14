"use client"

import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {AreasActionSelectProps} from "@/components/areas/areasActionSelect";

export type AreasReactionSelectProps = {
    // left
    leftValue?: string;
    onLeftChange?: (v: string) => void;
    // right
    rightValue?: string;
    onRightChange?: (v: string) => void;
};

export default function AreasReactionSelect({ leftValue, onLeftChange, rightValue, onRightChange}: AreasActionSelectProps) {
    return (
        <section className="grid md:grid-cols-3">
            <div>
                <div className="px-15">
                    <h1 className="font-bold text-4xl text-blue-900">
                        Then
                    </h1>
                </div>
            </div>

            <div>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            <SelectItem value="apple">Apple</SelectItem>
                            <SelectItem value="banana">Banana</SelectItem>
                            <SelectItem value="blueberry">Blueberry</SelectItem>
                            <SelectItem value="grapes">Grapes</SelectItem>
                            <SelectItem value="pineapple">Pineapple</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </section>
    );
}
