"use client"

import React, { useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TicketCheck } from 'lucide-react'
import { approveTender, approveTenderDetails, getSubmittedBids, initializeContract, submitBid } from '@/lib/ContractFunctions'
import { toast } from 'sonner'
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table'
import { ArrowUp, ArrowDown } from "lucide-react"; 

const AdminTenderDetailCard = ({ Tender }) => {
    console.log(Tender)
    if (!Tender) {
        return <p className="text-red-500">No Tender data available.</p>;
      }
    const [bids, setBids] = React.useState([]);
    const [sortOrder, setSortOrder] = React.useState("asc");
    const [approves, setApproves] = React.useState();

    useEffect(() => {
        const init = async () =>{
            await initializeContract();
            const response = await getSubmittedBids();
            console.log(response)
            setBids(response)
            const approve = await approveTenderDetails();
            findApprovedBid(approve)
        }
        init();
    },[])

    const sortedBids = [...bids].sort((a, b) => {
        const amountA = Number(a.amount);
        const amountB = Number(b.amount);
        return sortOrder === "asc" ? amountA - amountB : amountB - amountA;
      });

    const handleSubmitApproval = async (venderId) =>{
        const response = await approveTender(Tender?.tenderId, venderId);
        toast("Tender Approved Successfully", { description: `Transaction Hash: ${response}` });
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
                <CardDescription className="text-lg">{Tender?.tenderName} {Tender?.tenderType}</CardDescription>
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
                <CardFooter>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>S.No</TableHead>
                            <TableHead>Bidder Address</TableHead>
                            <TableHead>
                                <button
                                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                className="flex items-center gap-1"
                                >
                                Bid Amount {sortOrder === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                                </button>
                            </TableHead>
                            <TableHead>Bid Date</TableHead>
                            <TableHead>Approve</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {sortedBids.filter((bid) => bid.tenderId === Tender?.tenderId)
                            .map((bid, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{bid.bidder}</TableCell>
                                <TableCell>{Number(bid.amount)}</TableCell>
                                <TableCell>{new Date(Number(bid.bidDate) * 1000).toLocaleDateString()}</TableCell>
                                <TableCell>{Tender?.isOpen?<Button onClick={() => handleSubmitApproval(bid.bidder)}>Approve</Button>:"Closed!"}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardFooter>
        </Card>
    </div>
  )
}

export default AdminTenderDetailCard