import Link from "next/link";
import * as React from "react";

import { cn } from "@mjs/ui/lib/utils";
import { Button } from "@mjs/ui/primitives/button";
import AccordionDemo from "./basic-examples/accordion-demo";
import AspectRatioDemo from "./basic-examples/aspect-ratio-demo";
import AvatarDemo from "./basic-examples/avatar-demo";
import BadgeDemo from "./basic-examples/badge-demo";
import BadgeDestructive from "./basic-examples/badge-destructive";
import BadgeOutline from "./basic-examples/badge-outline";
import BadgeSecondary from "./basic-examples/badge-secondary";
import ButtonDemo from "./basic-examples/button-demo";
import ButtonDestructive from "./basic-examples/button-destructive";
import ButtonGhost from "./basic-examples/button-ghost";
import ButtonLink from "./basic-examples/button-link";
import ButtonLoading from "./basic-examples/button-loading";
import ButtonOutline from "./basic-examples/button-outline";
import ButtonSecondary from "./basic-examples/button-secondary";
import ButtonWithIcon from "./basic-examples/button-with-icon";
import SeparatorDemo from "./basic-examples/separator-demo";
import SheetDemo from "./basic-examples/sheet-demo";
import SkeletonDemo from "./basic-examples/skeleton-demo";
import TooltipDemo from "./basic-examples/tooltip-demo";
import AlertDialogDemo from "./examples/alert-dialog-demo";
import CardDemo from "./examples/card-demo";
import CollapsibleDemo from "./examples/collapsible-demo";
import CommandDemo from "./examples/command-demo";
import ContextMenuDemo from "./examples/context-menu-demo";
import DatePickerDemo from "./examples/date-picker-demo";
import DialogDemo from "./examples/dialog-demo";
import HoverCardDemo from "./examples/hover-card-demo";
import MenubarDemo from "./examples/menubar-demo";
import PopoverDemo from "./examples/popover-demo";
import ProgressDemo from "./examples/progress-demo";
import ScrollAreaDemo from "./examples/scroll-area-demo";
import TabsDemo from "./examples/tabs-demo";
import ToastDemo from "./examples/toast-demo";
import ToggleDemo from "./examples/toggle-demo";
import ToggleDisabled from "./examples/toggle-disabled";
import ToggleOutline from "./examples/toggle-outline";
import ToggleWithText from "./examples/toggle-with-text";
import CheckboxDemo from "./form-examples/checkbox-demo";
import DropdownMenuDemo from "./form-examples/dropdown-menu-demo";
import RadioGroupDemo from "./form-examples/radio-group-demo";
import SelectDemo from "./form-examples/select-demo";
import SliderDemo from "./form-examples/slider-demo";
import SwitchDemo from "./form-examples/switch-demo";

const ComponentDemo = () => {
	return (
		<>
			<h2 className="text-3xl font-semibold leading-tight md:leading-tight max-w-xs sm:max-w-none md:text-4xl">
				Component examples
			</h2>
			<p className="text-lg text-muted-foreground mt-2">
				View the full list of components in{" "}
				<a
					className="underline"
					target="_blank"
					rel="noreferrer noopener"
					href="https://shipixen.com/component-explorer-shadcn"
				>
					the component explorer
				</a>
				.
			</p>

			<div className="mt-4 grid gap-4 bg-neutral-100 dark:bg-black rounded-md">
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-start gap-4">
					<div className="grid gap-4">
						<ComponentWrapper>
							<CardDemo className="w-full" />
						</ComponentWrapper>
						<ComponentWrapper>
							<SliderDemo className="w-full" />
						</ComponentWrapper>
						<ComponentWrapper
							className="spa flex-col items-start space-x-0
				space-y-2"
						>
							<p className="text-sm text-muted-foreground">Documentation</p>
							<p className="text-sm font-medium leading-none">
								You can customize the theme using{" "}
								<code className="relative rounded-sm bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-foreground">
									CSS variables
								</code>
								.{" "}
								<Link
									href="#"
									className="font-medium text-primary underline underline-offset-4"
								>
									Click here
								</Link>{" "}
								to learn more.
							</p>
						</ComponentWrapper>
						<ComponentWrapper>
							<CheckboxDemo />
							<HoverCardDemo />
						</ComponentWrapper>
						<ComponentWrapper className="[&>div]:w-full">
							<TabsDemo />
						</ComponentWrapper>
					</div>
					<div className="grid gap-4">
						<ComponentWrapper>
							<MenubarDemo />
							<AvatarDemo />
						</ComponentWrapper>
						<ComponentWrapper className="flex-col items-start space-x-0 space-y-2">
							<div className="flex space-x-2">
								<ButtonDemo />
								<ButtonSecondary />
								<ButtonDestructive />
							</div>
							<div className="flex space-x-2">
								<ButtonOutline />
								<ButtonLink />
								<ButtonGhost />
							</div>
							<div className="flex space-x-2">
								<ButtonWithIcon />
								<ButtonLoading />
							</div>
							<div className="flex space-x-2">
								<Button size="lg">Large</Button>
								<Button size="sm">Small</Button>
							</div>
						</ComponentWrapper>
						<ComponentWrapper>
							<DatePickerDemo />
						</ComponentWrapper>
						<ComponentWrapper>
							<AccordionDemo />
						</ComponentWrapper>
						<ComponentWrapper className="justify-between">
							<SwitchDemo />
							<SelectDemo />
						</ComponentWrapper>
						<ComponentWrapper>
							<SeparatorDemo />
						</ComponentWrapper>
						<ComponentWrapper>
							<AspectRatioDemo />
						</ComponentWrapper>
						<ComponentWrapper>
							<PopoverDemo />
							<ToastDemo />
						</ComponentWrapper>
					</div>
					<div className="grid gap-4">
						<ComponentWrapper>
							<TooltipDemo />
							<SheetDemo />
							<ProgressDemo />
						</ComponentWrapper>
						<ComponentWrapper>
							<CommandDemo />
						</ComponentWrapper>
						<ComponentWrapper className="[&>span]:h-[80px] [&>span]:w-[200px]">
							<RadioGroupDemo />
							<ContextMenuDemo />
						</ComponentWrapper>
						<ComponentWrapper>
							<div className="flex space-x-2">
								<DropdownMenuDemo />
								<AlertDialogDemo />
								<DialogDemo />
							</div>
						</ComponentWrapper>
						<ComponentWrapper>
							<div className="flex space-x-2">
								<BadgeDemo />
								<BadgeSecondary />
								<BadgeDestructive />
								<BadgeOutline />
							</div>
						</ComponentWrapper>
						<ComponentWrapper>
							<SkeletonDemo />
						</ComponentWrapper>
						<ComponentWrapper className="[&>div]:w-full">
							<CollapsibleDemo />
						</ComponentWrapper>
						<ComponentWrapper>
							<div className="flex space-x-2">
								<ToggleDemo />
								<ToggleOutline />
								<ToggleDisabled />
								<ToggleWithText />
							</div>
						</ComponentWrapper>
						<ComponentWrapper>
							<ScrollAreaDemo />
						</ComponentWrapper>
					</div>
				</div>
			</div>
		</>
	);
};

const ComponentWrapper = ({
	className,
	children,
}: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			className={cn(
				"flex items-center justify-between space-x-4 rounded-md p-4",
				className,
			)}
		>
			{children}
		</div>
	);
};

export { ComponentDemo };
