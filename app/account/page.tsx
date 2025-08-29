// frontend/app/account/page.tsx
"use client"

import  userService from "@/services/api/user";
import { useQuery } from "@tanstack/react-query";

export default function AccountPage() {

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => userService.getCurrentUser(),
  })
  console.log(data,"Current User")
  // Mock data
  const user = {
    name: "paul ajeigbe",
    email: "pdave4krist@yahoo.com",
    address: {
      name: "paul ajeigbe",
      details: "Nos 28, Alonge street, Almustapha, Megida, Ayobo, Lagos Iyana Ipaja (Ayobo Road), Lagos",
      phone: "+234 8104560227"
    },
    storeCredit: 0,
  };
  
  return (
    <div className="max-w-6xl mx-auto py-2">
      <h1 className="text-2xl font-semibold mb-6">Account Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Details */}
        <div className="bg-white rounded-lg border p-6 flex flex-col gap-2">
          <h2 className="font-semibold text-lg mb-2">ACCOUNT DETAILS</h2>
          <div className="text-gray-900 font-medium">{data?.data?.user?.name}</div>
          <div className="text-gray-500">{data?.data?.user?.email}</div>
        </div>
        {/* Address Book */}
        {/* <div className="bg-white rounded-xl border p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-lg">ADDRESS BOOK</h2>
            <button className="text-brand-yellow hover:text-yellow-600">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6.586-6.586a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-2.828 0L3 7.828a2 2 0 112.828-2.828L9 11z" /></svg>
            </button>
          </div>
          <div className="text-gray-900 font-medium">Your default shipping address:</div>
          <div className="text-gray-700">{user.address.name}</div>
          <div className="text-gray-500">{user.address.details}</div>
          <div className="text-gray-500">{user.address.phone}</div>
        </div> */}
        {/* Store Credit */}
        {/* <div className="bg-white rounded-xl border p-6 flex flex-col gap-2">
          <h2 className="font-semibold text-lg mb-2">JUMIA STORE CREDIT</h2>
          <div className="flex items-center gap-2 text-blue-800 font-semibold">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 3v4M8 3v4M2 11h20" /></svg>
            Jumia store credit balance: ₦ {user.storeCredit}
          </div>
        </div> */}
        {/* Newsletter Preferences */}
        {/* <div className="bg-white rounded-xl border p-6 flex flex-col gap-2">
          <h2 className="font-semibold text-lg mb-2">NEWSLETTER PREFERENCES</h2>
          <div className="text-gray-700">Manage your email communications to stay updated with the latest news and offers.</div>
        </div> */}
      </div>
    </div>
  );
}