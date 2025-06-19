import type { TechnicianResponse } from "@/lib/types/technician";

interface TechnicianProps {
    technician: TechnicianResponse
}

export default function AnalyticsView({technician}: TechnicianProps) {
    return (
        <div className="flex flex-col items-start justify-center w-full p-8">
            <h2 className="text-2xl font-bold">Analytics</h2>
        </div>
    );
}
