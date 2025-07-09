"use client";
import { SaleSchema } from "@/common/schemas/generated";
import { Stepper } from "@/components/stepper";
import { FadeAnimation } from "@mjs/ui/components/motion";
import { cn } from "@mjs/ui/lib/utils";
import { useAppForm } from "@mjs/ui/primitives/tanstack-form";
import { parseAsInteger, useQueryState } from "nuqs";

const FormSchema = SaleSchema.pick({
	name: true,
	tokenName: true,
	tokenSymbol: true,
	tokenContractAddress: true,
	tokenContractChainId: true,
	tokenPricePerUnit: true,
	toWalletsAddress: true,
	saleCurrency: true,
	saleStartDate: true,
	saleClosingDate: true,
	initialTokenQuantity: true,
	availableTokenQuantity: true,
	minimumTokenBuyPerUser: true,
	maximumTokenBuyPerUser: true,
	saftCheckbox: true,
	saftContract: true,
});

const steps = [
	{ id: 1, name: "Create", description: "Basic information" },
	{ id: 2, name: "Contract", description: "Contract details" },
	{ id: 3, name: "Additional Information", description: "Final details" },
];

/**
 * AdminSales displays the form and helper content for creating a new sale.
 * TODO: Wire up FormProvider, methods, saleStep, InputsForm, step, projectPath, Quote, QUOTE_TITLE, QUOTE_CONTENT, CoreHelperComponent.
 */
const AdminSales = () => {
	const form = useAppForm({
		validators: { onSubmit: FormSchema },
		defaultValues: {},
		onSubmit: ({ value }) => console.log(value),
	});
	// TODO: Wire up step, projectPath, saleStep, methods from props/context
	// const step = 0;
	// const projectPath = 0;
	// TODO: Specify the correct type for saleStep
	// const saleStep: Array<unknown> = [];
	// const methods = {};

	return (
		<form.AppForm>
			<form className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<FadeAnimation delay={0.1} duration={0.5}>
					<FormStepper />
					<SectionContainer title="Token Information" className="col-span-2">
						<SectionForm />
					</SectionContainer>
				</FadeAnimation>
			</form>
		</form.AppForm>
	);
};

export default AdminSales;

const SectionContainer = ({
	children,
	title = "Create a New Sale",
	className,
}: {
	children: React.ReactNode;
	title?: string;
	className?: string;
}) => {
	return (
		<div className={cn("flex flex-col gap-6 justify-center", className)}>
			<h3 className="text-2xl font-bold text-primary text-center md:text-left font-sora mb-8">
				{title}
			</h3>
			{children}
		</div>
	);
};

const FormStepper = ({ className }: { className?: string }) => {
	const [step, setStep] = useQueryState(
		"step",
		parseAsInteger.withDefault(1).withOptions({ shallow: true }),
	);
	return (
		<Stepper
			currentStep={step}
			steps={steps}
			className={className}
			onStepClick={setStep}
		/>
	);
};

const SectionForm = ({ children }: { children?: React.ReactNode }) => {
	const [step] = useQueryState("step", parseAsInteger.withDefault(1));

	console.debug("🚀 ~ sales.tsx:104 ~ step:", step);

	if (!step) return null;
	return (
		<div className="flex flex-col gap-4">
			{step === 1 && <TokenInformation />}
			{step === 2 && <SaftInformation />}
			{step === 3 && <ProjectInformation />}
		</div>
	);
};

const TokenInformation = () => {
	return (
		<div>
			<h1>Basic Information</h1>
			{Object.keys(FormSchema.shape).map((key) => {
				return <div key={key}>{key}</div>;
			})}
		</div>
	);
};

const SaftInformation = () => {
	return (
		<div>
			<h1>Basic Information</h1>
		</div>
	);
};

const ProjectInformation = () => {
	return (
		<div>
			<h1>Basic Information</h1>
		</div>
	);
};
