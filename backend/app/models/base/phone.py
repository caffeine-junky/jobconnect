from pydantic import constr

PhoneNumber = constr(pattern=r"^(?:\+27|27|0)[6-8][0-9]{8}$")
