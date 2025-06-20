// frontend/app/account/layout.tsx
import {Header} from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import AccountSideNav from '@/components/account/AccountSideNav';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <Header /> */}
      <div className="flex min-h-[80vh] bg-[#FAFAFA] px-20 py-10">
        <AccountSideNav />
        <main className="flex-1 px-6">{children}</main>
      </div>
      {/* <Footer /> */}
    </>
  );
}