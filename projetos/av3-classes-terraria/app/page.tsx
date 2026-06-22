import Image from "next/image";
import ClassCard from "./components/ClassCard";

const classes = [
  { id: 1, name: "Mage", imageSrc: "/nebula-armor.png", href: "/classes/mage" },
  { id: 2, name: "Melee", imageSrc: "/solar-armor.png", href: "/classes/melee" },
  { id: 3, name: "Ranger", imageSrc: "/vortice-armor.png", href: "/classes/ranger" },
  { id: 4, name: "Summoner", imageSrc: "/stardust-armor.png", href: "/classes/summoner" }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#040203] text-[#ededed]">
      
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
        
        <Image
          src="/terraria-banner.jpg"
          alt="Terraria Banner"
          width={1920}
          height={1080}
          priority
          className="w-full h-full object-cover object-[center_20%] opacity-80"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#040203] via-[#040203]/40 to-transparent" />
      </div>

      <main className="max-w-6xl mx-auto px-6 pb-24 -mt-16 relative z-10">
        
        <div className="text-center mb-12 space-y-3">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            Escolha sua Classe
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto">
            Explore os quatro caminhos fundamentais do Terraria e domine o fim dos tempos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {classes.map((item) => (
            <ClassCard
              key={item.id}
              name={item.name}
              imageSrc={item.imageSrc}
              href={item.href}
            />
          ))}
        </div>

      </main>
    </div>
  );
}