import { Input } from "@mjs/ui/primitives/input";
import { Label } from "@mjs/ui/primitives/label";

export default function InputWithLabel() {
	return (
		<div className="grid w-full max-w-sm items-center gap-1.5">
			<Label htmlFor="email">Email</Label>
			<Input type="email" id="email" placeholder="Email" />
		</div>
	);
}
