import { Button } from "@mjs/ui/primitives/button";
import { Textarea } from "@mjs/ui/primitives/textarea";

export default function TextareaWithButton() {
	return (
		<div className="grid w-full gap-2">
			<Textarea placeholder="Type your message here." />
			<Button>Send message</Button>
		</div>
	);
}
