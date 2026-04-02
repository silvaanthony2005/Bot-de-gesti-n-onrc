from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.auth import (
    create_access_token,
    get_current_user,
    get_password_hash,
    verify_password,
)
from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import (
    TokenResponse,
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
)

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserRegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="El correo ya esta registrado")

    user = User(
        full_name=payload.full_name.strip(),
        email=payload.email.lower(),
        password_hash=get_password_hash(payload.password),
        is_active=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user=user)


@router.post("/login", response_model=TokenResponse)
def login_user(payload: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email o contrasena invalida")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Usuario inactivo")

    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user=user)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
