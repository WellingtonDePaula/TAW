import Image from "next/image";
import Link from "next/link";
import ClassCard from "./components/ClassCard";

const classes = [
  {id: 1, name: "Mage", description: "Classe de mago", imageSrc:"/nebula-armor.png", href:"/mage"},
  {id: 2, name: "Melee", description: "Classe de Melee", imageSrc:"/solar-armor.png", href:"/melee"},
  {id: 3, name: "Ranger", description: "Classe de Ranger", imageSrc:"/vortice-armor.png", href:"/ranger"},
  {id: 4, name: "Summoner", description: "Classe de Summoner", imageSrc:"/stardust-armor.png", href:"/summoner"}
]

export default function Home() {
  return (
    <div>
      <div className="relative w-full">
        <Image
          src="/terraria-banner.jpg"
          alt="Terraria Banner"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      <main className="max-w-6xl mx-auto px-4 py-20">
        
        <p className="text-center text-lg mb-8">
          Essa página vai levar a todas as outras classes!
        </p>

        <div className="grid grid-cols-4 gap-26">
          {classes.map((type) => (
            <ClassCard
              key={type.id}
              name={type.name}
              description={type.description}
              imageSrc={type.imageSrc}
              href={type.href}
            />
          ))}
        </div>

      </main>
    </div>
  );
}