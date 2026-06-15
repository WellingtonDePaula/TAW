import Image from "next/image";
import Link from "next/link";

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
      <p>Essa página vai levar a todas as outras classes!</p>

      <Link href={"/mage"}>Mage</Link> <br />
      <Link href={"/melee"}>Melee</Link> <br />
      <Link href={"/ranger"}>Ranger</Link> <br />
      <Link href={"/summoner"}>Summoner</Link> <br />

    </div>
  );
}
