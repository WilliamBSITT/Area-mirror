"use client"

import { CircleUserRoundIcon, XIcon, UploadIcon } from "lucide-react"
import { useFileUpload } from "@/hooks/useFileUpload"
import { Button } from "@/components/ui/button"

interface AvatarProps {
    currentImage?: string;
    onUpload: (file: File) => Promise<void>;
    isLoading?: boolean;
}

export default function Avatar({ currentImage, onUpload, isLoading = false }: AvatarProps) {
    const [{ files }, { removeFile, openFileDialog, getInputProps }] =
        useFileUpload({
            accept: "image/*",
        })

    let fixedImage = currentImage;
    if (currentImage && !currentImage.startsWith("data:")) {
        fixedImage = currentImage.replace(/^dataimage\/([a-z]+)base64/, "data:image/$1;base64,");
    }

    const previewUrl = files[0]?.preview || fixedImage || null

    const fileName = files[0]?.file?.name || null
    const fileObject = files[0]?.file

    const handleUpload = async () => {
        if (fileObject && fileObject instanceof File) {
            try {
                await onUpload(fileObject)
                removeFile(files[0]?.id)
            } catch (error) {
                console.error("Upload error:", error)
            }
        }
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative inline-flex">
                <Button
                    variant="outline"
                    className="relative size-28 overflow-hidden p-0 shadow-none"
                    onClick={openFileDialog}
                    aria-label={previewUrl ? "Change image" : "Upload image"}
                >
                    {previewUrl ? (
                        <img
                            className="size-full object-cover"
                            src={previewUrl}
                            alt="Preview of uploaded image"
                            width={112}
                            height={112}
                            style={{ objectFit: "cover" }}
                        />
                    ) : (
                        <div aria-hidden="true">
                            <CircleUserRoundIcon className="size-10 opacity-60" />
                        </div>
                    )}
                </Button>
                {previewUrl && files[0] && (
                    <Button
                        onClick={() => removeFile(files[0]?.id)}
                        size="icon"
                        className="absolute -top-2 -right-2 size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background"
                        aria-label="Remove image"
                    >
                        <XIcon className="size-3.5" />
                    </Button>
                )}
                <input
                    {...getInputProps()}
                    className="sr-only"
                    aria-label="Upload image file"
                    tabIndex={-1}
                />
            </div>
            {fileName && <p className="text-xs text-muted-foreground">{fileName}</p>}
            {fileObject && (
                <Button
                    onClick={handleUpload}
                    disabled={isLoading}
                    className="gap-2"
                >
                    <UploadIcon className="size-4" />
                    Upload
                </Button>
            )}
            <p
                aria-live="polite"
                role="region"
                className="mt-2 text-xl text-muted-foreground"
            >
            </p>
        </div>
    )
}
