"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export function HeroSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section>
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background pointer-events-none "
        aria-hidden="true"
      />

      <div className="container relative pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-32 lg:pb-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Revolutionize Tender Management with <span className="text-primary">Blockchain</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px]">
                Secure, transparent, and efficient tender processes powered by blockchain technology. Eliminate fraud,
                reduce costs, and streamline procurement.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="gap-2">
                    <Play className="h-4 w-4" />
                    Watch Demo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] p-0 bg-black">
                  <div className="aspect-video w-full">
                    <iframe
                      width="100%"
                      height="100%"
                      src="about:blank"
                      title="Product Demo"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-2xl border">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Blockchain Tender Management Dashboard"
                width={800}
                height={600}
                className="w-full h-auto"
              />
              <div
                className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none"
                aria-hidden="true"
              />
            </div>

            {/* Floating feature highlights */}
            <div className="absolute -left-4 top-1/4 bg-background rounded-lg p-4 shadow-lg border">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">100% Transparent</p>
                  <p className="text-xs text-muted-foreground">All actions recorded on blockchain</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-1/4 bg-background rounded-lg p-4 shadow-lg border">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Tamper-Proof</p>
                  <p className="text-xs text-muted-foreground">Immutable tender records</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

