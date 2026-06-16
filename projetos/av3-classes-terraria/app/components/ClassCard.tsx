import Image from "next/image";
import Link from "next/link";

interface ClassCardProps {
    name: string;
    description: string;
    imageSrc: string;
    href: string;
}

export default function ClassCard({name, description, imageSrc, href}: ClassCardProps) {
    return (
        <Link href={href}>
            <div className="border border-gray-800 p-4 rounded-lg bg-gray-900
            hover:-translate-y-2 transition-all duration-300 shadow-md hover:shadow-xl text-center">
                <h2 className="text-xl font-bold mb-2">{name}</h2>
                
                <div className="relative w-full h-48 mb-2 flex justify-center items-center">
                    <Image 
                        src={imageSrc} 
                        alt={`Armadura da Classe ${name}`}
                        width={150}
                        height={150}
                        // fill
                        className="object-contain"
                    />
                </div>

                <h3 className="text-gray-400">{description}</h3>
            </div>
        </Link>
    );
}