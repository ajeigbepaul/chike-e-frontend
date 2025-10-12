// frontend/app/account/layout.tsx
import AccountSideNav from "@/components/account/AccountSideNav";
import AccountMobileNav from "@/components/account/AccountMobileNav";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <Header /> */}
      <div className="relative">
        <div className="flex min-h-[80vh] flex-col gap-6 bg-[#FAFAFA] px-4 py-8 relative md:flex-row md:gap-10 md:px-20 md:py-10">
          <aside className="hidden md:block md:w-64 md:flex-shrink-0">
            <AccountSideNav />
          </aside>
          <main className="flex-1 px-0 md:px-6">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
              <AccountMobileNav className="md:hidden" />
              {children}
            </div>
          </main>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}
