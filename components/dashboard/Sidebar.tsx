"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LayoutDashboard, ShoppingCart, BarChart2, GraduationCap, Truck, Mail } from 'lucide-react'

const sidebarItems = [
  { name: 'Dashboards', icon: LayoutDashboard, items: ['CRM', 'Analytics', 'eCommerce', 'Academy', 'Logistics'] },
  { name: 'Front Pages', icon: ShoppingCart },
  { name: 'eCommerce', icon: ShoppingCart },
  { name: 'Academy', icon: GraduationCap },
  { name: 'Logistics', icon: Truck },
  { name: 'Email', icon: Mail },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Vuexy
          </h2>
          <div className="space-y-1">
            {sidebarItems.map((item, index) => (
              <div key={index}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    pathname === `/${item.name.toLowerCase()}` && "bg-accent"
                  )}
                  asChild
                >
                  <Link href={`/${item.name.toLowerCase()}`}>
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.name}
                  </Link>
                </Button>
                {item.items && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.items.map((subItem, subIndex) => (
                      <Button
                        key={subIndex}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start",
                          pathname === `/${item.name.toLowerCase()}/${subItem.toLowerCase()}` && "bg-accent"
                        )}
                        asChild
                      >
                        <Link href={`/${item.name.toLowerCase()}/${subItem.toLowerCase()}`}>
                          {subItem}
                        </Link>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}