import { Menu } from "lucide-react";

import {Sheet,SheetContent,SheetTrigger} from '@/components/ui/sheet';
import { Button } from "./ui/button";
import {NavigationSidebar} from "./navigation/NavigationSidebar";
import ServerSidebar from "./server/ServerSidebar";
import { FC } from "react";

interface MobileToggleProps{
  serverId:string;
}

const MobileToggle:FC<MobileToggleProps> = ({serverId}) => {
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant='ghost' size='icon' className="md:hidden">
          <Menu/>
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className="p-0 flex gap-0">
        <div className="w-[72px]">
          <NavigationSidebar/>
        </div>
        <ServerSidebar serverId={serverId}/>
      </SheetContent>
    </Sheet>
    
  )
}

export default MobileToggle

