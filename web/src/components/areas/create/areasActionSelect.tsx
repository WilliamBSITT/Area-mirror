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
import { Input } from "@/components/ui/input";

import { useServices } from "@/hooks/services/useServices";
import { useServiceDetails } from "@/hooks/services/useServicesName";
import { useServiceActionParams } from "@/hooks/services/useServicesActions";
import { SelectItemWithIcon } from "@/components/areas/create/selectItemWithIcon";

export type AreasActionSelectProps = {
    leftValue?: string;
    onLeftChange?: (v: string) => void;
    rightValue?: string;
    onRightChange?: (v: string) => void;
    onParamsChange?: (params: Record<string, string>) => void;
};


export default function AreasActionSelect({ leftValue, onLeftChange, rightValue, onRightChange, onParamsChange }: AreasActionSelectProps) {
    const { data, loading, error } = useServices();
    const {
        data: details,
        loading: detailsLoading,
        error: detailsError,
    } = useServiceDetails(leftValue ?? undefined);

    const {
        data: paramsData,
        loading: paramsLoading,
        error: paramsError,
    } = useServiceActionParams(leftValue ?? undefined, rightValue ?? undefined);

    const [formValues, setFormValues] = React.useState<Record<string, string>>({});

    React.useEffect(() => {
        if (paramsData?.params) {
            setFormValues((prev) => {
                const updatedValues: Record<string, string> = {};
                let changed = false;

                paramsData.params.forEach((p) => {
                    updatedValues[p.name] = prev[p.name] ?? "";
                    if (!(p.name in prev)) changed = true;
                });

                return changed ? updatedValues : prev;
            });
        } else {
            setFormValues({});
        }
    }, [paramsData]);

    const handleInputChange = (name: string, value: string) => {
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const prevFormValuesRef = React.useRef<string>("");

    React.useEffect(() => {
        const json = JSON.stringify(formValues);
        if (json !== prevFormValuesRef.current) {
            prevFormValuesRef.current = json;
            onParamsChange?.(formValues);
        }
    }, [formValues, onParamsChange]);

    return (
        <section className="grid md:grid-cols-3 gap-4">
            {/* Colonne gauche : service */}
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
                    <SelectTrigger className="w-[200px]">
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

            {/* Colonne droite : action */}
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

            {/* Liste dynamique des paramètres */}
            {leftValue && rightValue && (
                <div className="col-span-3">
                    {paramsLoading && <p>Chargement des paramètres…</p>}
                    {paramsError && <p>Erreur : {paramsError.message}</p>}
                    {!paramsLoading && !paramsError && paramsData?.params?.length === 0 && (
                        <p>Aucun paramètre requis pour cette action.</p>
                    )}

                    <div className="flex flex-col gap-3 px-20">
                        {paramsData?.params.map((p) => (
                            <div
                                key={p.name}
                                className="flex items-center justify-between gap-4"
                            >
                                <label htmlFor={p.name} className="w-1/3 text-sm font-medium">
                                    {p.name}
                                    {p.required ? " *" : ""}
                                </label>
                                <Input
                                    id={p.name}
                                    name={p.name}
                                    value={formValues[p.name] || ""}
                                    onChange={(e) => handleInputChange(p.name, e.target.value)}
                                    placeholder={p.description}
                                    required={p.required}
                                    type={p.type === "number" ? "number" : "text"}
                                    className="w-2/3"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
