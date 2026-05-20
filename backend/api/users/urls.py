from django.urls import path

from api.users.presentation.views import (
    CustomRefreshToken,
    GetUserProfile,
    LogoutUser,
    RegisterUser,
    LoginUser,
    UpdateUserView,
)

urlpatterns = [
    path("user/login/", LoginUser.as_view(), name="login_user"),
    path("user/token/refresh/", CustomRefreshToken.as_view(), name="token_refresh"),
    path("user/register/", RegisterUser.as_view(), name="register_user"),
    path("user/logout/", LogoutUser.as_view(), name="logout_user"),
    path("user/profile/", GetUserProfile.as_view(), name="user_profile"),
    path("user/profile/update/", UpdateUserView.as_view(), name="user_update"),
    path("user/<uuid:pk>/", GetUserProfile.as_view(), name="get_user_profile"),
]
