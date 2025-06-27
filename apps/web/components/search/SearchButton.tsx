import { siteConfig } from "@/data/config/site.settings";
import { KBarButton } from "@shipixen/pliny/search/KBarButton";
import { SearchIcon } from "lucide-react";

const SearchButton = () => {
	if (siteConfig.search) {
		return (
			<KBarButton aria-label="Search">
				<SearchIcon />
			</KBarButton>
		);
	}
};

export default SearchButton;
