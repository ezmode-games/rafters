import { Avatar, AvatarFallback, AvatarImage } from '@rafters/ui/components/ui/avatar';

export function AvatarDemo() {
  return (
    <div className="flex gap-4 items-center justify-center">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    </div>
  );
}

export function AvatarSizes() {
  return (
    <div className="flex gap-4 items-end justify-center">
      <div className="flex flex-col items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">SM</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar>
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="text-lg">LG</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">large</span>
      </div>
    </div>
  );
}
