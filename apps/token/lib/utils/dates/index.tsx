import { DateTime, type DateTimeFormatOptions } from "luxon";

export function dateFormatterInput(props: {
	date: string;
	format: DateTimeFormatOptions;
}) {
	const { date, format } = props;
	return DateTime.fromISO(date).toLocaleString(format);
}

export function DateFormatter(props: {
	date: string;
	time?: boolean;
	className?: string;
}) {
	const { date, time = true, className } = props;
	const dateTime = DateTime.fromISO(date);
	return (
		<div className={className}>
			<p>{dateTime.toLocaleString()}</p>
			{time && <span>{dateTime.toLocaleString(DateTime.TIME_24_SIMPLE)}</span>}
		</div>
	);
}
