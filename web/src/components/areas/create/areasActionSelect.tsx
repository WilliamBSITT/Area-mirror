"use client";

import * as React from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useServices } from "@/hooks/services/useServices";
import { useServiceDetails } from "@/hooks/services/useServicesName";


export type AreasActionSelectProps = {
    // left
    leftValue?: string;
    onLeftChange?: (v: string) => void;
    // right
    rightValue?: string;
    onRightChange?: (v: string) => void;
};

import { SelectItemWithIcon } from "@/components/areas/create/selectItemWithIcon"

export default function AreasActionSelect({ leftValue, onLeftChange, rightValue, onRightChange }: AreasActionSelectProps) {
    const { data, loading, error } = useServices();
    const { data: details, loading: detailsLoading, error: detailsError } = useServiceDetails(leftValue ?? undefined);

    return (
        <section className="grid md:grid-cols-3">
            <div>
                <div className="px-30">
                    <h1 className="font-bold text-4xl">If</h1>
                </div>
            </div>

            <div>
                <Select
                    value={leftValue}
                    onValueChange={onLeftChange ?? (() => {})}
                    disabled={loading || !!error}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue
                            placeholder={
                                loading
                                    ? "Chargement…"
                                    : error
                                        ? "Erreur de chargement"
                                        : "Sélectionner un service"
                            }
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Services</SelectLabel>
                            {data?.map((s) => (
                                <SelectItemWithIcon
                                    key={s.id}
                                    value={s.name}
                                    imgSrc={`data:image/png;base64,${s.image}`}
                                >
                                    {s.name}
                                </SelectItemWithIcon>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Select
                    value={rightValue}
                    onValueChange={onRightChange ?? (() => {})}
                    disabled={detailsLoading || !!detailsError || !details}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue
                            placeholder={
                                !leftValue
                                    ? "Choisissez un service"
                                    : detailsLoading
                                    ? "Chargement…"
                                    : detailsError
                                    ? "Erreur de chargement"
                                    : "Sélectionner une action"
                            }
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Actions</SelectLabel>
                            {details?.actions.map((a) => (
                                <SelectItem key={a.name} value={a.name}>
                                    {a.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </section>
    );
}
