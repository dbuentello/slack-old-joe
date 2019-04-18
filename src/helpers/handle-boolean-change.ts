export function handleBooleanChange(handler: (checked: boolean) => void) {
  return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).checked);
}
