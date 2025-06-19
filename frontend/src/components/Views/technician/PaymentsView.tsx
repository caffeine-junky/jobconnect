import * as paymentService from "@/lib/services/payment";
import type { PaymentResponse } from "@/lib/types/payment";
import type { PaymentStatus } from "@/lib/types/enums";
import type { TechnicianResponse } from "@/lib/types/technician";

import { useState, useEffect } from "react";


export default function PaymentsView({technician}: {technician: TechnicianResponse}) {
    const [payments, setPayments] = useState<PaymentResponse[]>([]);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const paymentsData = await paymentService.readallPayments(undefined, technician.id);
                setPayments(paymentsData);
            } catch (error) {

            }
        }
        fetchPayments();
    }, [])

}
