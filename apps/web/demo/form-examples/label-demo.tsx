import { Checkbox } from "@mjs/ui/primitives/checkbox";
import { Label } from "@mjs/ui/primitives/label";

export default function LabelDemo() {
	return (
		<div>
			<div className="flex items-center space-x-2">
				<Checkbox id="terms" />
				<Label htmlFor="terms">Accept terms and conditions</Label>
			</div>
		</div>
	);
}
