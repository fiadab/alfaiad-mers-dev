import { Navbar } from "./_components/navbar";
import Sidebar from "./_components/sidebar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const DashboardLayout = ({ children } : { children : React.ReactNode }) => {
    return (
    <div className="h-full">
{/* header */}

<header className="sticky top-0 h-20 md:pl-56 w-full z-50">
  <Navbar/>
</header>


{/* sidebar */}
<div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
<Sidebar />
    </div>

<main className="md:pl-56 pt-20 h-full">{children}</main>
    </div> );
};

export default DashboardLayout;