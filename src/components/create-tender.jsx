"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

import { createTender } from "@/lib/ContractFunctions"

// Define the form schema with Zod
const formSchema = z.object({
  tenderName: z.string().min(3, { message: "Tender name must be at least 3 characters" }),
  tenderType: z.string().min(1, { message: "Please select a tender type" }),
  bidSubmissionDeadline: z.date({
    required_error: "Bid submission deadline is required",
  }),
  contractSignDeadline: z
    .date({
      required_error: "Contract sign deadline is required",
    })
    .refine((date) => date > new Date(), {
      message: "Contract sign deadline must be in the future",
    }),
  estimatedCost: z.coerce.number().positive({ message: "Cost must be a positive number" }),
  tenderDetails: z.string().min(10, { message: "Please provide more details (min 10 characters)" }),
})


export default function CreateTenderForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenderName: "",
      tenderType: "",
      tenderDetails: "",
      estimatedCost: 0,
    },
  })

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true)

    try {
      // Convert dates to timestamps
      const bidSubmissionTimestamp = Math.floor(data.bidSubmissionDeadline.getTime() / 1000)
      const contractSignTimestamp = Math.floor(data.contractSignDeadline.getTime() / 1000)

      // Call the createTender function
      const txHash = await createTender(
        data.tenderName,
        data.tenderType,
        bidSubmissionTimestamp,
        contractSignTimestamp,
        data.estimatedCost,
        data.tenderDetails,
        "0xCd2dC4809bEa02621630CfeCB03f34D9A5Fe7Cfe" // Hardcoded admin address,
      )

      toast(
        "Tender Created Successfully",
        {
        description: `Transaction Hash: ${txHash.slice(0, 10)}...`,
      })

      // Reset the form
      form.reset()
    } catch (error) {
      console.error("Error creating tender:", error)
      toast(
        "Error Creating Tender",{
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-auto max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Tender</CardTitle>
        <CardDescription>Fill out the form below to create a new tender on the blockchain.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="tenderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tender Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tender name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tenderType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tender Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tender type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="construction">Construction</SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                        <SelectItem value="supplies">Supplies</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="bidSubmissionDeadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Bid Submission Deadline</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Deadline for submitting bids</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contractSignDeadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Contract Sign Deadline</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Deadline for signing the contract</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="estimatedCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Cost</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Estimated cost in your currency</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tenderDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tender Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide detailed information about the tender"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Tender...
                </>
              ) : (
                "Create Tender"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <p>All fields are required</p>
        <p>Transaction will be recorded on the blockchain</p>
      </CardFooter>
    </Card>
  )
}

