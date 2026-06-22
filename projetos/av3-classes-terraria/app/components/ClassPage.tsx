import Image from "next/image";

interface Props {
    name: string;
    description: string;
    imageSrc: string;
}

export default function ClassPage({name, description, imageSrc}: Props) {
    return (
        <div>
            <Image
            src={imageSrc} alt="Imagem da classe" width={300} height={300} className="border-l-0 mx-auto"
            />
            <div className="text-center">
                <h2 className="text-x1 font-bold">{name}:</h2>
                <p className="text-gray-300">{description}</p>
            </div>
        </div>
    );
}