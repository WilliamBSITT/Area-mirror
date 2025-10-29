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
    initialParams?: Record<string, string>;
};

export default function AreasActionSelect({ leftValue, onLeftChange, rightValue, onRightChange, onParamsChange, initialParams = {}}: AreasActionSelectProps) {
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

    const hasInitialized = React.useRef(false);

    const [formValues, setFormValues] = React.useState<Record<string, string>>(initialParams);

    React.useEffect(() => {
        if (!hasInitialized.current && initialParams && Object.keys(initialParams).length > 0) {
            setFormValues(initialParams);
            hasInitialized.current = true;
        }
    }, [initialParams]);

    React.useEffect(() => {
        if (paramsData?.params) {
            setFormValues((prev) => {
                const updatedValues: Record<string, string> = {};
                let changed = false;

                paramsData.params.forEach((p) => {
                    if (p.name in prev) {
                        updatedValues[p.name] = prev[p.name];
                    } else {
                        updatedValues[p.name] = initialParams?.[p.name] ?? "";
                        changed = true;
                    }
                });

                return changed ? updatedValues : prev;
            });
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
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
                <div className="px-4 md:px-30">
                    <h1 className="font-bold text-2xl md:text-4xl">If</h1>
                </div>
            </div>

            <div className="md:col-span-1">
                <Select
                    value={leftValue}
                    onValueChange={onLeftChange ?? (() => {})}
                    disabled={loading || !!error}
                >
                    <SelectTrigger className="w-full md:w-[200px]">
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

            <div className="md:col-span-1">
                <Select
                    value={rightValue}
                    onValueChange={onRightChange ?? (() => {})}
                    disabled={detailsLoading || !!detailsError || !details}
                >
                    <SelectTrigger className="w-full md:w-[200px]">
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

            {leftValue && rightValue && (
                <div className="col-span-1 md:col-span-3">
                    {paramsLoading && <p>Chargement des paramètres…</p>}
                    {paramsError && <p>Erreur : {paramsError.message}</p>}
                    {!paramsLoading && !paramsError && paramsData?.params?.length === 0 && (
                        <p>Aucun paramètre requis pour cette action.</p>
                    )}

                    <div className="flex flex-col gap-3 px-4 md:px-20">
                        {paramsData?.params.map((p) => (
                            <div
                                key={p.name}
                                className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4"
                            >
                                <label htmlFor={p.name} className="text-sm font-medium md:w-1/3">
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
                                    className="w-full md:w-2/3 text-sm md:text-base h-8 md:h-10 px-2 md:px-3"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
