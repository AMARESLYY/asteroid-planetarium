import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Section3 = () => {
  return (
    <section className=" w-full  h-screen flex  flex-col items-center justify-center gap-5 lg:gap-20 py-24 md:py-28 lg:py-32 xl:py-48 relative bg-black px-10 md:px-18 lg:px-24 xl:px-30 relative">
        <p className="text-2xl md:text-4xl lg:text-8xl text-pretty text-bold antialiased tracking-wide text-background text-center z-20">
            Menu
        </p>
        <div className="w-full h-full items-start justify-start flex absolute top-0 left-0 z-0 overflow-hidden">
        <Image className="object-cover" fill alt="Image" src={"/cielo.png"} />
      </div>
        <div className="w-full h-full flex  flex-cols items-center justify-center gap-14 lg:gap-20 z-20 ">
            <div className="w-64 h-64 aspect-square items-start justify-start flex flex-col  bg-muted p-5 border rounded-lg gap-32">
                <p className="text-lg md:text-xl lg:text-2xl text-pretty text-bold antialiased tracking-wide text-muted-foreground text-center">
                Asteroid
                </p>
                <Button
                    variant={"outline"}
                    size={"default"}
                    asChild
                    className="w-full h-fit"
                >
                    <Link href={"/asteroidP"}>Try it</Link>
                </Button>
            </div>
            <div className="w-64 h-64  aspect-square items-start justify-start flex flex-col  bg-muted p-5 border rounded-lg gap-32">
                <p className="text-lg md:text-xl lg:text-2xl text-pretty text-bold antialiased tracking-wide text-muted-foreground text-center">
                Solar System
                </p>
                <Button
                    variant={"outline"}
                    size={"default"}
                    asChild
                    className="w-full h-fit"
                >
                    <Link href={"/system"}>Try it</Link>
                </Button>
            </div>
            <div className="w-64 h-64 aspect-square items-start justify-start flex flex-col  bg-muted p-5 border rounded-lg gap-24">
                <p className="text-lg md:text-xl lg:text-2xl text-pretty text-bold antialiased tracking-wide text-muted-foreground text-center">
                Impact Probabilities
                </p>
                <Button
                    variant={"outline"}
                    size={"default"}
                    asChild
                    className="w-full h-fit"
                >
                    <Link href={"/Compare"}>Try it</Link>
                </Button>
            </div>
      </div>
    </section>
  );
};