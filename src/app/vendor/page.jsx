"use client"

import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getAllTenderDetails, initializeContract } from '@/lib/ContractFunctions'
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table'
import { ArrowRight } from 'lucide-react'
import TenderDetailCard from '@/components/tender-detail'

const page = () => {
  const [activeTab, setActiveTab] = useState("tenders")
  const [allTenders, setAllTenders] = useState([])
  const [selectedTender, setSelectedTender] = useState(null)

  useEffect(()=>{
    const tender = async () =>{
      await initializeContract();
      const AllTender = await getAllTenderDetails();
      console.log(AllTender)
      setAllTenders(AllTender)
    }
    tender();
  }, [])

  useEffect(() => {
    console.log("Updated selectedTender:", selectedTender);
  }, [selectedTender]);

  return (
    <div className='flex min-h-screen flex-col mx-auto'>
      <div className='bg-gradient-to-b from-primary/10 to-background'>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
      <nav className='relative h-12 bg-background shadow-md z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center'>
          <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger
            value="tenders"
          >
            All Tenders
          </TabsTrigger>
          
          <TabsTrigger
            value="details"
          >
            Tender Details
          </TabsTrigger>
        </TabsList>
        </div>
      </nav>
        <TabsContent value="tenders" className="mt-0 m-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Tender ID</TableHead>
                <TableHead>Tender Name</TableHead>
                <TableHead>Tender Type</TableHead>
                <TableHead>Bid Submission Deadline</TableHead>
                <TableHead>Contract Sign Deadline</TableHead>
                <TableHead>Estimated Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {allTenders.map((tender, index) => (
                    <TableRow key={tender.tenderId} onClick={() => {
                      setSelectedTender(tender); // Update state
                      setActiveTab("details"); // Switch to details tab
                    }} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{tender.tenderId}</TableCell>
                    <TableCell>{tender.tenderName}</TableCell>
                    <TableCell>{tender.tenderType}</TableCell>
                    <TableCell>{new Date(tender.bidSubmissionDeadline * 1000).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(tender.contractSignDeadline * 1000).toLocaleDateString()}</TableCell>
                    <TableCell>Rs.{tender.estimatedCost}</TableCell>
                    <TableCell>{tender.isOpen ? "Open":"Closed!"}</TableCell>
                    {tender.isOpen ?<TableCell className="flex items-center">Submit Bid<ArrowRight/></TableCell>:<TableCell className="flex items-center">View<ArrowRight/></TableCell>}
                    </TableRow>
                ))}
              </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="details" className="mt-0 m-4">
          <h1 className="text-xl font-bold mb-4">Tender Details</h1>
          {selectedTender ? (
            <TenderDetailCard Tender={selectedTender} />
          ) : (
            <p className="text-gray-500">No tender selected. Click a row to view details.</p>
          )}
        </TabsContent>

        </Tabs>
        </div>
    </div>
  )
}

export default page