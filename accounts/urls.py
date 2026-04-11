from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('register/',        views.RegisterView.as_view(),      name='register'),
    path('login/',           TokenObtainPairView.as_view(),     name='login'),
    path('token/refresh/',   TokenRefreshView.as_view(),        name='token_refresh'),
    path('me/',              views.MeView.as_view(),            name='me'),
    path('profile/',         views.ProfileUpdateView.as_view(), name='profile'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    path('delete/',          views.DeleteAccountView.as_view(), name='delete_account'),
    path('avatar/delete/', views.DeleteAvatarView.as_view(), name='delete_avatar'),
]