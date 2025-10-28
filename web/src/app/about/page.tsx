"use client"

import Image from "next/image";
import triggerhubImage from "@/../public/logo_trigger_hub.png"
import webDev from "@/../public/developers/web.png"

import Link from 'next/link'
import AuthCodeReader from "@/hooks/auth/useSearchParams";
import PixelCard from '@/components/PixelCard';
import PixelTransition from '@/components/PixelTransition';

export default function Page() {
    return (
        <main className="py-8 px-20">
            <AuthCodeReader />
            <section className="grid md:grid-cols-2">
                <div className="py-5">
                    <Image
                        src={triggerhubImage}
                        alt="triggerhubImage"
                        width={400}
                        priority
                    />
                </div>

                <div>
                    <p className="max-w-lg">
                        TriggerHub a pour objectif de créer une plateforme d’automatisation simple, flexible et ouverte. L’idée est de permettre à n’importe quel utilisateur de connecter facilement des services, des applications ou des objets entre eux, sans avoir à écrire une seule ligne de code. L’utilisateur définit des règles logiques sous la forme “Si tel événement se produit, alors exécute telle action”. Ces enchaînements, appelés applets ou scénarios, rendent possible une infinité d’automatisations du quotidien.
                        L’ambition du projet est d’offrir un écosystème modulaire, capable d’interagir aussi bien avec des API web qu’avec des appareils connectés ou des scripts locaux. Chaque élément du système, déclencheur, condition et action  est conçu comme un module indépendant pouvant être combiné librement avec d’autres. Cela permet aux utilisateurs de personnaliser leurs automatisations selon leurs besoins spécifiques, qu’il s’agisse de gérer des tâches domestiques, de centraliser des notifications, ou encore de synchroniser des données entre différentes plateformes.
                        L’architecture du projet repose sur une approche événementielle : un moteur central détecte les déclencheurs (par exemple un nouveau message, un changement d’état d’un capteur ou une donnée reçue depuis Internet) et exécute immédiatement les actions correspondantes. Cette conception garantit une réactivité élevée et une consommation minimale de ressources.
                        En plus de sa souplesse technique, le projet met l’accent sur la transparence et la confidentialité. Les données traitées localement ne sont pas transmises à des serveurs externes, assurant un contrôle total à l’utilisateur sur ses informations. À terme, la plateforme vise à devenir un outil universel d’automatisation, accessible, extensible et respectueux de la vie privée.
                    </p>
                </div>

            </section>
            <section className="py-8 grid md:grid-cols-5 gap-4">
                <PixelTransition
                    firstContent={
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg"
                            alt="default pixel transition content, a cat!"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    }
                    secondContent={
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "grid",
                                placeItems: "center",
                                backgroundColor: "#111"
                            }}
                        >
                            <p style={{ fontWeight: 900, fontSize: "3rem", color: "#ffffff" }}>Meow!</p>
                        </div>
                    }
                    gridSize={12}
                    pixelColor='#ffffff'
                    animationStepDuration={0.4}
                    className="custom-pixel-card"
                />

                <PixelTransition
                    firstContent={
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg"
                            alt="default pixel transition content, a cat!"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    }
                    secondContent={
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "grid",
                                placeItems: "center",
                                backgroundColor: "#111"
                            }}
                        >
                            <p style={{ fontWeight: 900, fontSize: "3rem", color: "#ffffff" }}>Meow!</p>
                        </div>
                    }
                    gridSize={12}
                    pixelColor='#ffffff'
                    animationStepDuration={0.4}
                    className="custom-pixel-card"
                />

                <PixelTransition
                    firstContent={
                        <img
                            src={webDev.src}
                            alt="default pixel transition content, a cat!"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    }
                    secondContent={
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "grid",
                                placeItems: "center",
                                backgroundColor: "#111"
                            }}
                        >
                            <p style={{ fontWeight: 900, fontSize: "3rem", color: "#ffffff" }}>Meow!</p>
                        </div>
                    }
                    gridSize={12}
                    pixelColor='#ffffff'
                    animationStepDuration={0.4}
                    className="custom-pixel-card"
                />

                <PixelTransition
                    firstContent={
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg"
                            alt="default pixel transition content, a cat!"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    }
                    secondContent={
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "grid",
                                placeItems: "center",
                                backgroundColor: "#111"
                            }}
                        >
                            <p style={{ fontWeight: 900, fontSize: "3rem", color: "#ffffff" }}>Meow!</p>
                        </div>
                    }
                    gridSize={12}
                    pixelColor='#ffffff'
                    animationStepDuration={0.4}
                    className="custom-pixel-card"
                />

                <PixelTransition
                    firstContent={
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg"
                            alt="default pixel transition content, a cat!"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    }
                    secondContent={
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "grid",
                                placeItems: "center",
                                backgroundColor: "#111"
                            }}
                        >
                            <p style={{ fontWeight: 900, fontSize: "3rem", color: "#ffffff" }}>Meow!</p>
                        </div>
                    }
                    gridSize={12}
                    pixelColor='#ffffff'
                    animationStepDuration={0.4}
                    className="custom-pixel-card"
                />

            </section>
        </main>
    );
}
