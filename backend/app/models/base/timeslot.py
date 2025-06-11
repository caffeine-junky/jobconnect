from pydantic import BaseModel
from datetime import date, time


class TimeSlot(BaseModel):
    slot_date: date
    start_time: time
    end_time: time
