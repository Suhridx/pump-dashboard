import ScrollLayout from "../Layout/ScrollLayout";

const ScheduleCardSkeleton = () => (
    <div className="flex h-full animate-pulse flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
            <div className="mb-2 h-5 w-3/4 rounded-md bg-slate-200"></div>
            <div className="mb-4 h-8 w-1/2 rounded-md bg-slate-200"></div>
            <div className="h-4 w-1/3 rounded-md bg-slate-200"></div>
        </div>
        <div className="mt-4 flex items-center justify-between">
            <div className="h-6 w-11 rounded-full bg-slate-200"></div>
            <div className="h-8 w-8 rounded-lg bg-slate-200"></div>
        </div>
    </div>
);

/**
 * A skeleton loader for the TimeTable component.
 */
const TimeTableSkeleton = () => {
    const skeletonRows = Array.from({ length: 5 }); // Create 5 skeleton rows

    return (
        <div className="animate-pulse rounded-lg border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        {/* Using actual headers for a more realistic skeleton */}
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Schedule #</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Start Time</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">End Time</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Duration (min)</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Mode</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Completed</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {skeletonRows.map((_, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4"><div className="h-4 w-8 rounded bg-slate-200"></div></td>
                            <td className="px-6 py-4"><div className="h-4 w-16 rounded bg-slate-200"></div></td>
                            <td className="px-6 py-4"><div className="h-4 w-16 rounded bg-slate-200"></div></td>
                            <td className="px-6 py-4"><div className="h-4 w-12 rounded bg-slate-200"></div></td>
                            <td className="px-6 py-4"><div className="h-5 w-20 rounded-full bg-slate-200"></div></td>
                            <td className="px-6 py-4">
                                <div className="flex justify-center">
                                    <div className="h-5 w-5 rounded-full bg-slate-200"></div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex justify-end">
                                    <div className="h-5 w-5 rounded bg-slate-200"></div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


/**
 * The main skeleton component for the entire Status page.
 */
export default function StatusSkeleton() {
    return (
        <ScrollLayout maxHeight="100%" className="max-w-4xl p-10">
            {/* Page Header Skeleton */}
            <div className="animate-pulse">
                <div className="h-10 w-3/4 rounded-lg bg-slate-300 mb-3"></div>
                <div className="h-6 w-1/2 rounded-lg bg-slate-200 mb-8"></div>
            </div>

            {/* Configured Schedules Section Skeleton */}
            <div>
                <div className="animate-pulse h-8 w-1/3 rounded-lg bg-slate-300 mt-8 mb-4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Render 3 card skeletons to match the grid layout */}
                    <ScheduleCardSkeleton />
                    <ScheduleCardSkeleton />
                    <ScheduleCardSkeleton />
                </div>
            </div>

            {/* Schedule Summary Section Skeleton */}
            <div>
                <div className="animate-pulse h-8 w-1/4 rounded-lg bg-slate-300 mt-8 mb-2"></div>
                <TimeTableSkeleton />
            </div>
        </ScrollLayout>
    );
}