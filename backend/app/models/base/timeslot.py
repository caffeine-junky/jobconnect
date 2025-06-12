from pydantic import BaseModel, Field
from datetime import date, time


class TimeSlot(BaseModel):
    slot_date: date
    start_time: time
    end_time: time


class TimeSlotDay(BaseModel):
    day: int = Field(ge=0, le=6)
    start_time: time
    end_time: time
