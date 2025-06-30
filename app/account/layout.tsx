// frontend/app/account/layout.tsx
import AccountSideNav from '@/components/account/AccountSideNav';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <Header /> */}
      <div className="relative">
        <div className="flex min-h-[80vh] bg-[#FAFAFA] px-20 py-10 relative">
          <div className="relative w-64">
            <AccountSideNav />
          </div>
          <main className="flex-1 px-6">{children}</main>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}