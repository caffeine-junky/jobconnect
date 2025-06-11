from fastapi import HTTPException, status


class NotFoundException(HTTPException):
    def __init__(self, message: str = "Resource not found") -> None:
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=message)


class BadRequestException(HTTPException):
    def __init__(self, message: str = "Bad request") -> None:
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=message)


class ConfictException(HTTPException):
    def __init__(self, message: str = "Conflict") -> None:
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=message)


class InternalServerException(HTTPException):
    def __init__(self, message: str = "Server Error") -> None:
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=message
        )


class UnauthorizedException(HTTPException):
    def __init__(self, message: str = "Unauthorized") -> None:
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=message)


class NotImplementedException(HTTPException):
    def __init__(self, message: str = "Not implemented") -> None:
        super().__init__(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail=message)
