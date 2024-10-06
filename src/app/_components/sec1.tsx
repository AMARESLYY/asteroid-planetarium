import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Section1 = () => {
  return (
    <section className="flex items-start justify-start gap-14 lg:gap-20 py-24 md:py-28 lg:py-32 xl:py-48 relative">
      <div className="w-full h-full items-start justify-start flex absolute top-0 left-0 z-0 overflow-hidden">
        <Image className="object-cover" fill alt="Image" src={"/fondo.jpg"} />
      </div>
      <div className="w-full h-full absolute top-0 left-0 bg-gradient-to-t from-background to-background/20 z-10 backdrop-blur-sm filter backdrop-contrast-125" />
      <div className="w-full h-fit items-center justify-center flex flex-col gap-y-4 z-20 max-w-4xl mx-auto">
        <p className="text-xl md:text-2xl lg:text-4xl text-pretty text-bold antialiased tracking-wide text-foreground text-center">
        Window to the Interactive Cosmos
        </p>
        <div className="w-full h-fit items-center justify-center flex flex-col md:flex-row gap-2 mt-5">
          <Button
            variant={"outline"}
            size={"default"}
            asChild
            className="w-full md:w-fit"
          >
            <Link href={"/"}>Ver</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};