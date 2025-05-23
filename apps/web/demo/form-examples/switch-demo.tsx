import { Label } from "@mjs/ui/primitives/label";
import { Switch } from "@mjs/ui/primitives/switch";

export default function SwitchDemo() {
	return (
		<div className="flex items-center space-x-2">
			<Switch id="airplane-mode" />
			<Label htmlFor="airplane-mode">Airplane Mode</Label>
		</div>
	);
}
