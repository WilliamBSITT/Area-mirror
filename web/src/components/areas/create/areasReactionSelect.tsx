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
import { useServiceReactionParams } from "@/hooks/services/useServicesReactions";
import { SelectItemWithIcon } from "@/components/areas/create/selectItemWithIcon";
import { getSpotifyToken, getGitHubToken } from '@/hooks/services/useQAuthTokens';

type AreasReactionSelectProps = {
    leftValue?: string;
    onLeftChange?: (v: string) => void;
    rightValue?: string;
    onRightChange?: (v: string) => void;
    onParamsChange?: (paramsValues: Record<string, string>) => void;
};

export default function AreasReactionSelect({
                                                leftValue,
                                                onLeftChange,
                                                rightValue,
                                                onRightChange,
                                                onParamsChange
                                            }: AreasReactionSelectProps) {

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
    } = useServiceReactionParams(leftValue ?? undefined, rightValue ?? undefined);

    const [formValues, setFormValues] = React.useState<Record<string, string>>({});

    React.useEffect(() => {
        if (paramsData?.params) {
            setFormValues((prev) => {
                const updatedValues: Record<string, string> = {};

                paramsData.params.forEach((p) => {
                    if (leftValue && rightValue) {
                        const serviceLower = leftValue.toLowerCase();

                        if (serviceLower === "spotify") {
                            if (p.name === "access_token") {
                                const spotifyToken = getSpotifyToken();
                                updatedValues[p.name] = spotifyToken || prev[p.name] || "";
                            } else if (p.name === "refresh_token") {
                                const spotifyRefreshToken = sessionStorage.getItem('spotify_refresh_token');
                                updatedValues[p.name] = spotifyRefreshToken || prev[p.name] || "";
                            } else {
                                updatedValues[p.name] = prev[p.name] ?? "";
                            }
                        } else if (serviceLower === "github") {
                            if (p.name === "access_token") {
                                const githubToken = getGitHubToken();
                                updatedValues[p.name] = githubToken || prev[p.name] || "";
                            } else if (p.name === "refresh_token") {
                                const githubRefreshToken = sessionStorage.getItem('github_refresh_token');
                                updatedValues[p.name] = githubRefreshToken || prev[p.name] || "";
                            } else {
                                updatedValues[p.name] = prev[p.name] ?? "";
                            }
                        } else {
                            updatedValues[p.name] = prev[p.name] ?? "";
                        }
                    } else {
                        updatedValues[p.name] = prev[p.name] ?? "";
                    }
                });

                return updatedValues;
            });
        } else {
            setFormValues({});
        }
    }, [paramsData, leftValue, rightValue]);

    const handleInputChange = (name: string, value: string) =>
        setFormValues((prev) => ({ ...prev, [name]: value }));

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
            {/* Titre "Then" */}
            <div className="md:col-span-1">
                <div className="px-4 md:px-15">
                    <h1 className="font-bold text-2xl md:text-4xl text-blue-900">Then</h1>
                </div>
            </div>

            {/* Sélecteur de service */}
            <div className="md:col-span-1">
                <Select
                    value={leftValue}
                    onValueChange={onLeftChange ?? (() => {})}
                    disabled={loading || !!error}
                    data-test="service-select-reaction"
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

            {/* Sélecteur de réaction */}
            <div className="md:col-span-1">
                <Select
                    value={rightValue}
                    onValueChange={onRightChange ?? (() => {})}
                    disabled={detailsLoading || !!detailsError || !details}
                    data-test="action-select-reaction"
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
                                            : "Sélectionner une réaction"
                            }
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Réactions</SelectLabel>
                            {details?.reactions.map((r) => (
                                <SelectItem key={r.name} value={r.name}>
                                    {r.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* Bloc de paramètres dynamiques */}
            {leftValue && rightValue && (
                <div className="col-span-1 md:col-span-3">
                    {paramsLoading && <p>Chargement des paramètres…</p>}
                    {paramsError && <p>Erreur : {paramsError.message}</p>}
                    {!paramsLoading && !paramsError && paramsData?.params?.length === 0 && (
                        <p>Aucun paramètre requis pour cette réaction.</p>
                    )}

                    <div className="flex flex-col gap-3 px-4 md:px-20">
                        {paramsData?.params.map((p) => (
                            <div
                                key={p.name}
                                className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4"
                            >
                                <label
                                    htmlFor={p.name}
                                    className="text-sm font-medium text-gray-800 md:w-1/3"
                                >
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
