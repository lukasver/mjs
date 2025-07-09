"use client";

import { Link, usePathname } from "@/lib/i18n/navigation";
import { getLocaleNames } from "@mjs/i18n";
import { cn } from "@mjs/ui/lib/utils";
import { Button } from "@mjs/ui/primitives/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@mjs/ui/primitives/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@mjs/ui/primitives/popover";
import { Check, Globe } from "lucide-react";
import { useState } from "react";

interface Locale {
	code: string;
	name: string;
}

const locales: Locale[] = getLocaleNames().map(({ locale, name }) => ({
	code: locale,
	name,
}));

interface LocaleSwitcherProps {
	currentLocale?: string;
	onLocaleChange?: (locale: string) => void;
}

export default function LocaleSwitcher({
	currentLocale = "en",
	onLocaleChange,
}: LocaleSwitcherProps) {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const [selectedLocale, setSelectedLocale] = useState(
		locales.find((locale) => locale.code === currentLocale) || locales[0],
	);

	const handleLocaleSelect = (locale: Locale) => {
		setSelectedLocale(locale);
		setOpen(false);
		onLocaleChange?.(locale.code);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					aria-label="Select language"
					className="justify-between flex flex-row gap-2"
				>
					<div className="flex items-center gap-2">
						<Globe className="h-4 w-4" />
						<span className="text-sm">{selectedLocale?.name || "English"}</span>
					</div>
					{/* <ChevronDown className='h-4 w-4 shrink-0 opacity-50' /> */}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[125px] p-0 bg-primary">
				<Command>
					<CommandList>
						<CommandEmpty>No language found.</CommandEmpty>
						<CommandGroup>
							{locales.map((locale) => (
								<Link href={pathname} locale={locale.code} key={locale.code}>
									<CommandItem
										value={locale.name}
										onSelect={() => handleLocaleSelect(locale)}
										className="flex items-center gap-2"
									>
										<span className="flex-1">{locale.name}</span>
										<Check
											className={cn(
												"ml-auto h-4 w-4",
												selectedLocale?.code === locale.code
													? "opacity-100"
													: "opacity-0",
											)}
										/>
									</CommandItem>
								</Link>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
