"use client";

import { Menu, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Web3 from 'web3';
import Product from "@/contracts/TenderManagement.json";
import { initializeContract, isAdmin } from "@/lib/ContractFunctions";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Navbar() {
  const [web3, setWeb3] = useState(null)
  const [isOpen, setIsOpen] = useState(false);
  const [account, setAccount] = useState(null)
  const [productContract, setProductContract] = useState(null)
  const router = useRouter();
  const [role, setRole] = useState(null);
  const path = usePathname();

  const loadBlockchainData = async () => {
		if (typeof window.ethereum !== 'undefined') {
			const web3 = new Web3(window.ethereum)
			setWeb3(web3)

			const accounts = await web3.eth.getAccounts()

			if (accounts.length > 0) {
				setAccount(accounts[0])
			}

			const networkId = await web3.eth.net.getId()

			const pro = new web3.eth.Contract(Product.abi, Product.networks[networkId].address)
			setProductContract(pro)

			// Event listeners...
			window.ethereum.on('accountsChanged', function (accounts) {
				setAccount(accounts[0])
			})

			window.ethereum.on('chainChanged', (chainId) => {
				window.location.reload();
			})
		}
	}
  const web3Handler = async () => {
		if (web3) {
			await initializeContract();
      const role = await isAdmin();
      setRole(role?"Admin":"Vendor")
      console.log(role)
      if(role){
        sessionStorage.setItem('role', 'Admin')
         router.push('/dashboard')
      }else{
        sessionStorage.setItem('role', 'Vendor')
        router.push('/vendor')
      }
		}
	}

  useEffect(() => {
    const init = async () => {
      try {
        await loadBlockchainData();
        await initializeContract();
        
        const isUserAdmin = await isAdmin();
        setRole(isUserAdmin ? "Admin" : "Vendor");
  
        console.log("User Role:", isUserAdmin); 
        if(!role){
          if(path === '/dashboard'){
            router.push('/')
            toast("Your are not authorized to access this page");
          }
        }
      } catch (error) {
        console.error("Error initializing:", error);
      }
    };
  
    init();
  }, []); 
  

  return (
    <nav className="relative top-0 left-1/2 transform -translate-x-1/2  bg-background shadow-md z-50 mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center text-xl font-bold">
          <Wallet/>
          OpenTender
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
              How It Works
            </Link>
          </nav>
          <div>
            {account ? (
                  <div className="flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:block ml-2 mr-2 border-2 p-2 rounded-lg cursor-pointer"
                            >
                            {account.slice(0, 5) + '...' + account.slice(38, 42)}
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-base">Address: {account}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button onClick={web3Handler} className="cursor-pointer">{role}</Button>
                    </div>
                        ) : (
                            <Button onClick={web3Handler} className="hidden md:block ml-2 mr-2">Get Started</Button>
                        )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <div>
            {account ? (
                  <div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            className=" ml-2 mr-2 border-2 p-2 rounded-lg cursor-pointer"
                            >
                            {account.slice(0, 5) + '...' + account.slice(38, 42)}
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-base">Address: {account}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    </div>
                        ) : (
                            <Button onClick={web3Handler} className="hidden md:block ml-2 mr-2">Get Started</Button>
                        )}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              <Menu size={24} />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col bg-background shadow-md p-4">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
              How It Works
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}