import { IcoPhasesLoading } from "./ico-phases-loading";
import { TokenMetricsLoading } from "./token-metrics-loading";

export function BottomSectionsLoading() {
	return (
		<div className="grid grid-cols-2 gap-6">
			<TokenMetricsLoading />
			<IcoPhasesLoading />
		</div>
	);
}
