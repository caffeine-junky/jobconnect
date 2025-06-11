from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # DATABASE
    DATABASE_NAME: str = ""
    DATABASE_HOST: str = ""
    DATABASE_USER: str = ""
    DATABASE_PASSWORD: str = ""
    DATABASE_PORT: int = 5432

    # SECURITY
    JWT_SECRET_TOKEN: str = ""
    TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"

    # API
    API_V1_STR: str = "/api/v1"

    DEBUG: bool = True

    class Config:
        env_file = ".env"


settings: Settings = Settings()
