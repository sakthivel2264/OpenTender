"use client";

import { ArrowRight, CheckCircle, Database, FileText, Lock, Shield, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/hero-section"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col mx-auto ">
      <main className="flex-1 mx-auto">
        <HeroSection />
        <section id="features" className="container py-24 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Blockchain-Powered Features</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Our platform leverages blockchain technology to bring unprecedented transparency, security, and efficiency
              to tender management.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-primary" />}
              title="Immutable Records"
              description="All tender documents and transactions are stored on the blockchain, ensuring they cannot be altered or tampered with."
            />
            <FeatureCard
              icon={<Lock className="h-10 w-10 text-primary" />}
              title="Enhanced Security"
              description="Cryptographic security ensures that only authorized parties can access sensitive tender information."
            />
            <FeatureCard
              icon={<FileText className="h-10 w-10 text-primary" />}
              title="Smart Contracts"
              description="Automated contract execution ensures compliance with tender terms and conditions without manual intervention."
            />
            <FeatureCard
              icon={<CheckCircle className="h-10 w-10 text-primary" />}
              title="Transparent Evaluation"
              description="Fair and transparent bid evaluation process with complete audit trails accessible to all stakeholders."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="Efficient Processing"
              description="Streamlined workflows reduce tender processing time by up to 70% compared to traditional methods."
            />
            <FeatureCard
              icon={<Database className="h-10 w-10 text-primary" />}
              title="Decentralized Storage"
              description="Tender documents are stored across a distributed network, eliminating single points of failure."
            />
          </div>
        </section>

        <section id="how-it-works" className="container py-24 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How OpenTender Works</h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          Our blockchain-based platform simplifies and secures every step of the tender management process.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <Image
            src="/placeholder.svg?height=500&width=600"
            alt="Tender Creation Process"
            width={600}
            height={500}
            className="rounded-lg border shadow-md"
          />
        </div>
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-xl font-bold">Tender Creation & Publication</h3>
            </div>
            <p className="text-muted-foreground pl-11">
              Create tender documents with customizable templates. All documents are encrypted and stored on the
              blockchain with a unique hash identifier.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-xl font-bold">Bid Submission</h3>
            </div>
            <p className="text-muted-foreground pl-11">
              Vendors submit encrypted bids that remain sealed until the bidding deadline. The blockchain timestamps
              each submission to prevent late entries.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-xl font-bold">Transparent Evaluation</h3>
            </div>
            <p className="text-muted-foreground pl-11">
              Bids are automatically unsealed at the deadline. Evaluation criteria are executed through smart contracts,
              ensuring fair and transparent assessment.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                4
              </div>
              <h3 className="text-xl font-bold">Contract Award & Execution</h3>
            </div>
            <p className="text-muted-foreground pl-11">
              The winning bid is selected based on predefined criteria. Smart contracts automate payments and milestone
              tracking throughout project execution.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1 space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Complete Audit Trail</h3>
            <p className="text-muted-foreground">
              Every action in the tender process is recorded on the blockchain, creating an immutable audit trail. This
              ensures accountability and transparency for all stakeholders.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Dispute Resolution</h3>
            <p className="text-muted-foreground">
              Our platform includes built-in dispute resolution mechanisms with access to the complete history of
              interactions, making resolution faster and more equitable.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Analytics & Reporting</h3>
            <p className="text-muted-foreground">
              Gain insights into your procurement processes with comprehensive analytics and reporting tools. Identify
              bottlenecks and optimize your tender management.
            </p>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <Image
            src="/placeholder.svg?height=500&width=600"
            alt="Blockchain Audit Trail"
            width={600}
            height={500}
            className="rounded-lg border shadow-md"
          />
        </div>
      </div>
    </section>

        <section className="bg-primary text-primary-foreground py-16">
          <div className="container text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Transform Your Tender Management?
            </h2>
            <p className="mx-auto max-w-[700px] md:text-xl">
              Join hundreds of organizations that have already modernized their procurement processes with blockchain
              technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary">
                Schedule a Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}




function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

