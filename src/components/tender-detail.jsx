"use client"

import React, { useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from './ui/button'
import { TicketCheck } from 'lucide-react'
import { Input } from './ui/input'
import {  initializeContract, submitBid, approveTenderDetails } from '@/lib/ContractFunctions'
import { toast } from 'sonner'

const TenderDetailCard = ({ Tender }) => {
    console.log(Tender)
    if (!Tender) {
        return <p className="text-red-500">No Tender data available.</p>;
      }

    const [amount, setAmount] = React.useState(0);
    const [approves, setApproves] = React.useState();

    useEffect(() => {
        const init = async () =>{
            await initializeContract();
            const approve = await approveTenderDetails();
            findApprovedBid(approve)
        }
        init();
    })

    const HandleSubmitBid = async () => {
        const timestamp = Math.floor(Date.now() / 1000);
        const response = await submitBid(Tender?.tenderId, amount, timestamp);
        toast("Bid Submitted Successfully", { description: `Transaction Hash: ${response}` });
        console.log(response);
    }

    const findApprovedBid = (approvals) => {
            const approvedBid = approvals.find(approval => approval?.tenderId === Tender?.tenderId);
            console.log(approvedBid)
            setApproves(approvedBid?.vendorId);
        };
        
    useEffect(()=>{
        console.log("Updated selectedTender:", approves);
    },[approves])

  return (
    <div>
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Tender ID: {Tender?.tenderId}</CardTitle>
                <CardDescription>{Tender?.tenderName} {Tender?.tenderType}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col gap-2'>
                    {!Tender?.approved && (
                        <div className='flex justify-between'>
                        <span className='font-bold'>Bid Submission Deadline:</span>
                        <span>{new Date(Tender?.bidSubmissionDeadline * 1000).toLocaleDateString()}</span>
                    </div>
                    )}
                    <div className='flex justify-between'>
                        <span className='font-bold'>Contract Sign Deadline:</span>
                        <span>{new Date(Tender?.contractSignDeadline * 1000).toLocaleDateString()}</span>
                    </div>
                    {!Tender?.approved && (
                        <div className='flex justify-between'>
                        <span className='font-bold'>Estimated Cost:</span>
                        <span>{Tender?.estimatedCost}</span>
                    </div>
                    )}
                    {Tender?.approved && (
                        <div className='flex justify-between'>
                        <span className='font-bold'>Approved To:</span>
                        <span>{approves}</span>
                        </div>
                    )}                   
                    {Tender?.approved && (
                        <div className='flex justify-between'>
                        <span className='font-bold'>Approved:</span>
                        <span><TicketCheck className='text-green-700' size={40}/></span>
                        </div>
                    )}
                </div>
            </CardContent>
            {Tender?.isOpen && (
                <CardFooter>
                    <Input type="text" placeholder="Enter your bid amount" className='w-full' value={amount} onChange={(e) =>  setAmount(e.target.value)} />
                    <Button onClick= {HandleSubmitBid}>Submit Bid</Button>
                </CardFooter>
            )}
            {!Tender?.isOpen && (
                <CardFooter className='flex justify-center'>
                    <span className='font-bold'>Bid Submission Closed!</span>
                </CardFooter>
            )
            }
        </Card>
    </div>
  )
}

export default TenderDetailCard