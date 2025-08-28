import { Logo } from '@rafters/shared';

interface HeaderProps {
  title?: string;
  titleClasses?: string;
}

export function Header({ title, titleClasses = 'text-4xl leading-3 tracking-wide' }: HeaderProps) {
  return (
    <header className="max-w-4xl w-full flex flex-col gap-4">
      <a href="/" className="mx-auto">
        <Logo className="size-32 mb-16 fill-current" />
      </a>
      {title && <h1 className={titleClasses}>{title}</h1>}
    </header>
  );
}
