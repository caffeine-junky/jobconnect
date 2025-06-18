import { useState } from "react";
import * as taService from "@/lib/services/technician_availability";
import type { TechnicianAvailabilityCreate, TechnicianAvailabilityUpdate, TechnicianAvailabilityResponse } from "@/lib/types/technician_availability";
import type { TimeSlotDay } from "@/lib/types/base/timeslot";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardFooter, CardContent, CardTitle} from "@/components/ui/card";
import { PlusIcon, XIcon } from "lucide-react";

export function technicianAvailabilityCard({technician_id, day, active}: {technician_id: string, day: number, active: boolean}) {
    const [isActive, setIsActive] = useState<boolean>(active);
    const [availabilities, setAvailabilities] = useState<TechnicianAvailabilityResponse[]>([]);
    
    const dayName = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
    }[day];

    return (
        <Card>
            <CardHeader className="flex items-center justify-between">
                <CardTitle className="font-bold">{dayName}</CardTitle>
                <Switch checked={active} onCheckedChange={(checked) => {setIsActive(checked)}} />
            </CardHeader>
            {active && (
                <>
                <CardContent>

                </CardContent>
                <CardFooter>
                    <Button variant={"secondary"}>
                        <PlusIcon />
                        Add More
                    </Button>
                    <Button>
                        Save
                    </Button>
                </CardFooter>
                </>
            )}
        </Card>
    );
}
