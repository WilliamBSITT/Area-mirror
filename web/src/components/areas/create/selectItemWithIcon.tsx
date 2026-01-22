import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

export const SelectItemWithIcon = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & { imgSrc?: string }
>(({ className, children, imgSrc, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={cn(
            'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            className
        )}
        {...props}
    >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
        <SelectPrimitive.ItemText>
      <span className="flex items-center gap-2">
        {imgSrc ? <img src={imgSrc} alt="" className="h-4 w-4 rounded" /> : null}
          {children}
      </span>
        </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
));
SelectItemWithIcon.displayName = 'SelectItemWithIcon';
