"use client";

import { cn } from "@mjs/ui/lib/utils";
import { Check } from "lucide-react";

type Step = {
	id: number;
	name: string;
	description?: string;
};

interface StepperProps {
	currentStep: number;
	steps: Step[];
	onStepClick?: (step: number) => void;
	className?: string;
}

export function Stepper({
	currentStep,
	steps,
	onStepClick,
	className,
}: StepperProps) {
	return (
		<div className={cn("w-full py-6", className)}>
			<div className="flex items-center">
				{steps.map((step, index) => (
					<div key={step.id} className="flex items-center flex-1">
						<div className="flex flex-col items-center">
							<button
								onClick={() => onStepClick?.(step.id)}
								className={cn(
									"flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
									currentStep > step.id
										? "border-primary bg-primary text-primary-foreground"
										: currentStep === step.id
											? "border-primary bg-background text-primary"
											: "border-muted-foreground/25 bg-background text-muted-foreground",
									onStepClick && "hover:border-primary/50 cursor-pointer",
								)}
							>
								{currentStep > step.id ? (
									<Check className="h-5 w-5" />
								) : (
									step.id
								)}
							</button>
							<div className="mt-2 text-center">
								<div
									className={cn(
										"text-xs sm:text-sm font-medium",
										currentStep >= step.id
											? "text-foreground"
											: "text-muted-foreground",
									)}
								>
									{step.name}
								</div>
								<div className="text-xs text-muted-foreground hidden sm:block">
									{step.description}
								</div>
							</div>
						</div>
						{index < steps.length - 1 && (
							<div className="flex-1 mx-2 sm:mx-4">
								<div
									className={cn(
										"h-0.5 w-full transition-colors",
										currentStep > step.id
											? "bg-primary"
											: "bg-muted-foreground/25",
									)}
								/>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
