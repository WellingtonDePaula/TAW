import ClassPage from "@/app/components/ClassPage";
import { notFound } from "next/navigation";

interface ClassData {
  name: string;
  description: string;
  image: string;
}

const classes: Record<string, ClassData> = {
  mage: {
    name: "Mage",
    description: "Classe focada em magia, desferindo feitiços poderosos de longa distância e controlando elementos cósmicos.",
    image: "/nebula-armor.png",
  },
  ranger: {
    name: "Ranger",
    description: "Classe focada em armas de distância, combinando precisão mortal, alta mobilidade e munições variadas.",
    image: "/vortice-armor.png",
  },
  summoner: {
    name: "Summoner",
    description: "Classe focada em invocações, comandando lacaios e sentinelas místicas para lutarem em seu lugar.",
    image: "/stardust-armor.png",
  },
  melee: {
    name: "Melee",
    description: "Classe focada em armas corpo a corpo, oferecendo a maior defesa do jogo e ataques frontais devastadores.",
    image: "/solar-armor.png",
  }
};

export default async function Page({ params }: { params: Promise<{ className: string }> }) {
  const { className } = await params;
  
  const classe = classes[className];

  if (!classe) {
    notFound();
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 md:p-6 bg-[#040203]">
      <ClassPage
        name={classe.name}
        description={classe.description}
        imageSrc={classe.image}
      />
    </main>
  );
}