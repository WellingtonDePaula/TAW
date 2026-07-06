import ClassPage from "@/app/components/ClassPage";
import { notFound } from "next/navigation";

interface ClassData {
  name: string;
  description: string;
  image: string;
}

// 1. Seu objeto de dados locais (Mapeamento baseado em Terraria, excelente escolha!)
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

// 2. Gerando os parâmetros estáticos a partir das chaves do objeto local (mage, ranger, etc.)
export async function generateStaticParams() {
  // Object.keys(classes) retorna ['mage', 'ranger', 'summoner', 'melee']
  return Object.keys(classes).map((key) => ({
    className: key,
  }));
}

// 3. Trava o acesso apenas a essas 4 páginas. Qualquer outra rota gerará 404 automaticamente no build
export const dynamicParams = false;

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